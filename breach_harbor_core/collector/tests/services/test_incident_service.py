from unittest.mock import patch, Mock
from django.test import TestCase
from ...services.incident_service import IncidentService

class IncidentServiceTestCase(TestCase):
    @patch('collector.models.Collector.objects.get')
    @patch('collector.models.IPAddress.objects.get_or_create')
    @patch('collector.services.location_service.LocationService.find_or_create_location')
    @patch('collector.services.incident_service.IncidentSerializer')
    @patch('collector.services.incident_service.IncidentService.verify_user_collector')
    def test_create_incident(self, mock_verify_user_collector, MockIncidentSerializer, mock_find_or_create_location, mock_get_or_create_ip, mock_get_collector):
        mock_ip_instance = Mock()
        mock_ip_instance.id = 1
        mock_get_or_create_ip.return_value = (mock_ip_instance, True)

        mock_location_instance = Mock()
        mock_find_or_create_location.return_value = mock_location_instance

        mock_serializer_instance = Mock()
        mock_serializer_instance.is_valid.return_value = True
        MockIncidentSerializer.return_value = mock_serializer_instance

        mock_verify_user_collector.return_value = True
        
        mock_collector_instance = Mock()
        mock_collector_instance.id = 1
        mock_get_collector.return_value = mock_collector_instance
        
        data = {
            'collector_name': 'ABCDEF-12-34',
            'ip_address': '192.168.1.1',
            'incident_type': 'test_type',
            'metadata': 'test_metadata',
            'happened_at': 'test_timestamp',
        }

        response = IncidentService.create_incident(data)

        mock_get_or_create_ip.assert_called_once_with(address='192.168.1.1')
        mock_find_or_create_location.assert_called_once_with('192.168.1.1')
        MockIncidentSerializer.assert_called_once_with(data={
            'collector': 1,
            'ip_address': 1, 
            'incident_type': 'test_type',
            'metadata': 'test_metadata',
            'happened_at': 'test_timestamp',
        })
        self.assertEqual(response, mock_serializer_instance.data)
        
    @patch('collector.models.IPAddress.objects.get_or_create')
    @patch('collector.services.location_service.LocationService.find_or_create_location')
    @patch('collector.services.incident_service.IncidentSerializer')
    @patch('collector.services.incident_service.IncidentService.verify_user_collector')
    def test_create_incident_with_invalid_ip(self, MockIncidentSerializer, mock_find_or_create_location, mock_get_or_create_ip, mock_verify_user_collector):
        mock_get_or_create_ip.side_effect = Exception("Some error due to invalid IP")  # Raise an exception when trying to get or create an invalid IP
        mock_verify_user_collector.return_value = True
        
        data = {
            'collector_name': 'ABCDEF-12-32',
            'ip_address': '',
            'incident_type': 'test_type',
            'metadata': 'test_metadata',
            'happened_at': 'test_timestamp',
        }

        response = IncidentService.create_incident(data)

        mock_get_or_create_ip.assert_not_called()
        mock_find_or_create_location.assert_not_called()
        MockIncidentSerializer.assert_not_called()
        
        self.assertEqual(response, {'errors': 'IP Address is invalid'})

