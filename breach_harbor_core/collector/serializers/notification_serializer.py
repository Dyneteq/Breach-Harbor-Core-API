from rest_framework import serializers

from ..serializers.incident_serializer import IncidentSerializer
from ..models import Notification  # Assuming you've defined Notification in the models.

class NotificationSerializer(serializers.ModelSerializer):
    incident_detail = IncidentSerializer(source='incident', read_only=True)  # nested serializer

    class Meta:
        model = Notification
        fields = ['id', 'message', 'created_at', 'severity', 'is_read', 'channel_read_status', 'incident_detail']
