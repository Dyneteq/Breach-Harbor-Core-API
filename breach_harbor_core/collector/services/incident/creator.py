import logging

from ...services.collector_service import CollectorService
from ...services.location_service import LocationService
from ...services.notification.creator import NotificationCreator
from ...serializers.incident_serializer import IncidentSerializer
from ...models import Collector
from ...services.ip_address_service import IPAddressService

logger = logging.getLogger(__name__)


class IncidentCreator:

    def __init__(self, data):
        self.data = data
        self.ip_address_instance = None
        self.collector_instance = None

    def _get_or_create_ip_address(self):
        ip_address_str = self.data.pop('ip_address', None)
        if not ip_address_str:
            return None
        return IPAddressService.find_or_create(ip_address_str)

    def _get_collector(self):
        collector_name = self.data.pop('collector_name', None)
        if not collector_name:
            return None
        collector_instance = CollectorService.get_by_name(collector_name)
        collector_instance.update_last_online()
        return collector_instance
    
    def _set_ip_address_location(self):
        location = LocationService.find_or_create_location(
            self.ip_address_instance.address)
        self.ip_address_instance.location = location
        self.ip_address_instance.save()

    def _prepare_data(self):
        self.ip_address_instance = self._get_or_create_ip_address()
        if not self.ip_address_instance:
            raise ValueError('IP Address is invalid')
        self.data['ip_address'] = self.ip_address_instance.id

        self.collector_instance = self._get_collector()
        if not self.collector_instance:
            raise ValueError('Collector name is invalid')
        self.data["collector"] = self.collector_instance.id
        self.data["user"] = self.collector_instance.user.id

    def _validate_and_create_incident(self):
        serializer = IncidentSerializer(data=self.data)
        if not serializer.is_valid():
            logger.warning(serializer.errors)
            raise ValueError(serializer.errors)
        serializer.save()
        return serializer.instance
      
    def _handle_notification(self, incident_instance):
        notification_creator = NotificationCreator(self.collector_instance.user, incident_instance)
        notification_creator.create()

    def _finalize_creation(self, incident_instance):
        self._set_ip_address_location()
        return IncidentSerializer(incident_instance).data

    def create(self):
        try:
            self._prepare_data()
            incident_instance = self._validate_and_create_incident()
            self._handle_notification(incident_instance)
            return self._finalize_creation(incident_instance)
        except ValueError as e:
            return {'errors': str(e)}
