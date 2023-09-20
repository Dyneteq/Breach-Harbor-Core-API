import ipaddress
import subprocess
import requests
from datetime import datetime, timedelta
from django.db.models import Count
from django.utils import timezone
from django.db.models.functions import ExtractHour
from collector.models import IPAddress, Incident
from collector.serializers.incident_serializer import IncidentSerializer
from collector.services import ip_address_service
from collector.services.location_service import LocationService
from ..serializers.location_serializer import LocationSerializer
from ..serializers.ip_address_serializer import IPAddressSerializer


class IPAddressService:
    @staticmethod 
    def get_all(limit=50):
        ip_addresses = IPAddress.objects.all()[:int(limit)]
        ip_serialized = IPAddressSerializer(ip_addresses, many=True)
        return ip_serialized.data
        
    @staticmethod
    def get_summary(ip_address):
        ip_address_obj = ip_address_service.IPAddressService.find_or_create(
            ip_address)
        ip_address_serialized = IPAddressSerializer(ip_address_obj).data

        location_serialized = {}
        if ip_address_obj.location:
            location = ip_address_obj.location
        else:
            location = LocationService.find_or_create_location(ip_address)
            ip_address_obj.location = location
            ip_address_obj.save()
        if ip_address_obj.location:
            location_serialized = LocationSerializer(location).data

        # user_search_activity

        total_amount = Incident.objects.filter(
            ip_address=ip_address_obj).count()

        last_24_hours = timezone.now() - timedelta(hours=24)
        latest_24_amount = Incident.objects.filter(
            ip_address=ip_address_obj, happened_at__gte=last_24_hours).count()

        last_five_incidents = Incident.objects.filter(
            ip_address=ip_address_obj).order_by('-happened_at')[:5]
        last_five_incidents_ser = IncidentSerializer(
            last_five_incidents, many=True).data

        return {
            "ipAddress": {
                **ip_address_serialized,
                "class": IPAddressService.ip_class(ip_address)
            },
            "dns": IPAddressService.reverse_dns(ip_address),
            "incidents": {
                "totalAmount": total_amount,
                "latest24hAmount": latest_24_amount,
                "lastFive": last_five_incidents_ser,
                "hourly": IPAddressService.get_hourly_incidents(ip_address_obj)
            },
            "location": location_serialized,
        }

    @staticmethod
    def ip_class(ip_addr):
        ip = ipaddress.ip_address(ip_addr)
        if isinstance(ip, ipaddress.IPv4Address):
            first_octet = int(str(ip).split('.')[0])
            if 0 <= first_octet <= 127:
                return 'A'
            elif 128 <= first_octet <= 191:
                return 'B'
            elif 192 <= first_octet <= 223:
                return 'C'
            elif 224 <= first_octet <= 239:
                return 'D'
            elif 240 <= first_octet <= 255:
                return 'E'
        else:
            return 'Not a valid IPv4 address'

    @staticmethod
    def get_hourly_incidents(ip_address):
        now = datetime.now()
        one_day_ago = now - timedelta(days=1)

        # Annotate incidents with the hour when they happened
        incidents_in_last_24_hours = (Incident.objects
                                      .filter(ip_address=ip_address, happened_at__gte=one_day_ago)
                                      .annotate(hour=ExtractHour('happened_at'))
                                      .values('hour')
                                      .annotate(incidents=Count('hour'))
                                      .order_by('hour'))

        # Convert the queryset to a dict for easy lookup
        incidents_by_hour = {entry['hour']: entry['incidents']
                             for entry in incidents_in_last_24_hours}

        hourly_incidents = []
        current_hour = now.hour
        for i in range(24):
            hour = (current_hour - 23 + i + 24) % 24
            incidents_amount = incidents_by_hour.get(hour, 0)
            formatted_hour = f"{str(hour).zfill(2)}:00"
            hourly_incidents.append(
                {"hour": formatted_hour, "amount": incidents_amount})

        return hourly_incidents

    @staticmethod
    def reverse_dns(ip_address):
        try:
            hostname = subprocess.check_output(
                ['dig', '-x', ip_address, '+short']).decode('utf-8').strip()
            if hostname:
                domain = IPAddressService.get_redirected_domain(f"http://{hostname}")
                return f"[{hostname}]: {domain}"
            return None
        except subprocess.CalledProcessError:
            return None

    @staticmethod
    def get_redirected_domain(url):
        try:
            # Allow redirection but don't fetch content of the final page
            response = requests.get(url, allow_redirects=True, stream=True, timeout=3)
            redirected_url = response.url
            # Extract the domain from the URL
            domain = redirected_url.split("://")[1].split("/")[0]
            return domain
        except Exception as e:
            print(f"Error: {e}")
            return None
