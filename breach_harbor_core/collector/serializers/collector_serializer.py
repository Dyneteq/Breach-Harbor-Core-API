from rest_framework import serializers
from ..models import Collector

class CollectorSerializer(serializers.ModelSerializer):
    ip_address = serializers.SerializerMethodField()

    class Meta:
        model = Collector
        fields = ['id', 'name', 'ip_address', 'token', 'last_online_at']

    def get_ip_address(self, obj):
        return obj.ip_address.address
