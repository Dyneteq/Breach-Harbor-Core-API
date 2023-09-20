
from datetime import timedelta
from django.utils import timezone
from collector.models import IPAddress, Incident
from django.db.models import Count

class DashboardService:
    @staticmethod
    def get_stats(user):
        total_incidents = Incident.objects.filter(user=user)
        total_incidents_amount = total_incidents.count()
        
        last_24_hours = timezone.now() - timedelta(hours=24)
        incidents_last24h = total_incidents.filter(happened_at__gte=last_24_hours)
        total_incidents_last24h_amount = incidents_last24h.count()
        
        ip_addresses_logged = IPAddress.objects.all()
        total_ip_addresses_logged = ip_addresses_logged.count()

        high_risk_ip_addresses = IPAddress.objects.annotate(num_incidents=Count('ip_addresses')).filter(num_incidents__gt=50)
        high_risk_ip_addresses_amount = high_risk_ip_addresses.count()

        country_stats = DashboardService.get_country_stats()
        
        return {
            "totalIncidents": format(total_incidents_amount, ","),
            "totalIncidentsLast24h": format(total_incidents_last24h_amount, ","),
            "totalIpAddresses": format(total_ip_addresses_logged, ","),
            "highRiskIPCount": format(high_risk_ip_addresses_amount, ","),
            "countryStats": country_stats
        }
        
    @staticmethod
    def get_country_stats():
        country_aggregation = Incident.objects.values('ip_address__location__country_name', 
                                                    'ip_address__location__country_iso_code', 
                                                    'ip_address__location__coords', 
                                                    'ip_address__location__city').annotate(incidentsAmount=Count('id')).order_by('-incidentsAmount')[:13]

        country_stats = []
        for country in country_aggregation:
            country_name = country['ip_address__location__country_name'] or 'Unknown'
            country_iso_code = country['ip_address__location__country_iso_code'] or 'Unknown'
            coords = country['ip_address__location__coords'] or 'Unknown'
            city = country['ip_address__location__city'] or 'Unknown'
            
            country_stats.append({
                "coordinates": coords,
                "city": city,
                "countryCode": country_iso_code,
                "countryName": country_name,
                "incidentsAmount": format(country.get('incidentsAmount', 0), ",")
            })

        return country_stats

