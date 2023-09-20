from rest_framework import serializers
from ..models import Incident, IPAddress, Collector 
from analyst.serializers.location_serializer import LocationSerializer 
from django.contrib.auth.models import User

class IncidentSerializer(serializers.ModelSerializer):
    ip_address = serializers.PrimaryKeyRelatedField(queryset=IPAddress.objects.all(), write_only=True)
    collector = serializers.PrimaryKeyRelatedField(queryset=Collector.objects.all(), write_only=True)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True) 

    # Fields for string representations
    ip_address_str = serializers.SerializerMethodField()
    collector_name = serializers.SerializerMethodField()

    location = LocationSerializer(source='ip_address.location', many=False, read_only=True)
    location_address = serializers.SerializerMethodField()
    
    class Meta:
        model = Incident
        fields = ['id', 'collector', 'collector_name', 'ip_address', 'ip_address_str', 'location', 'location_address',
                  'incident_type', 'metadata', 'happened_at', 'user']

    def get_ip_address_str(self, obj):
        return str(obj.ip_address)

    def get_collector_name(self, obj):
        return str(obj.collector)
    
    def get_location_address(self, obj):
        if not obj.ip_address.location:
            return "-"
        return str(obj.ip_address.location)
