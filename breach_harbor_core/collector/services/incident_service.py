import logging

from ..services.incident.creator import IncidentCreator
from ..models import Collector, Incident
from ..serializers.incident_serializer import IncidentSerializer
from .location_service import LocationService
from .collector_service import CollectorService
from .ip_address_service import IPAddressService

logger = logging.getLogger(__name__)

class IncidentService:
    @staticmethod 
    def get_all_by_user(user, limit): 
        return Incident.objects.filter(user=user).order_by('-happened_at')[:int(limit)]
        
    @staticmethod
    def verify_user_collector(data, token) -> bool:
        user_id = CollectorService.decode_token(token)
        if not user_id:
            return False
    
        if 'collector_name' in data and isinstance(data['collector_name'], str):
            collector = Collector.objects.filter(
                name=data['collector_name'],
                user_id=user_id
            ).exists()
            if collector:
                return True
        return False
    
    @staticmethod
    def create_incident(data):
        creator = IncidentCreator(data)
        return creator.create()