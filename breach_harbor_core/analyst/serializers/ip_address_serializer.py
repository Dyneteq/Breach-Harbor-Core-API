from rest_framework import serializers
from analyst.serializers.location_serializer import LocationSerializer
from collector.models import IPAddress
from django.db.models import Count

class IPAddressSerializer(serializers.ModelSerializer):
    location_address = serializers.SerializerMethodField()
    location = LocationSerializer(many=False, read_only=True)
    incident_count = serializers.SerializerMethodField() 
    
    class Meta:
        model = IPAddress
        fields = ['address', 'location', 'location_address', 'incident_count']
        
    def get_location_address(self, obj):
        if obj.location:
            return str(obj.location)
        return '-'
    
    def get_incident_count(self, obj):
        return obj.ip_addresses.count()
