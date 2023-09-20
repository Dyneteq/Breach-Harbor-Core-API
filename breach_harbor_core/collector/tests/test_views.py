import pytz
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.test import TestCase
from django.conf import settings
from collector.models import Incident, IPAddress, Collector

class IncidentViewTestCase(TestCase):
    def setUp(self):
      self.client = APIClient()

      # Create a test user
      User = get_user_model()
      self.user = User.objects.create_user(username='testuser', password='testpassword')

      # Obtain JWT for the test user
      response = self.client.post('/api/v1/auth/login', {'username': 'testuser', 'password': 'testpassword'}, format='json')
      token = response.data['access']

      # Attach the JWT to the test client
      self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
      
      IPAddress.objects.create(address="180.101.88.219")
      collector_ip = IPAddress.objects.create(address="145.121.82.29")
      self.collector = Collector.objects.create(name="ABCD12-34", user=self.user, ip_address=collector_ip)

    def tearDown(self):
      self.client.credentials() 
    
    def test_handle_incident_with_valid_data(self):
      timestamp = timezone.now()
      tz = pytz.timezone(settings.TIME_ZONE)
      
      valid_payload = {
          "collector_name": self.collector.name,
          "ip_address": "180.101.88.219",
          "incident_type": "some_valid_type",
          "metadata": "sample metadata",
          "happened_at": timestamp
      }

      response = self.client.post('/api/v1/collector/incident', data=valid_payload, format='json')

      # Check response
      self.assertEqual(response.status_code, status.HTTP_201_CREATED)
      
      # Fetch the incident from the database
      ip_address_obj = IPAddress.objects.get(address="180.101.88.219")
      incident_in_db = Incident.objects.get(ip_address=ip_address_obj)
      
      # Create expected data dictionary
      expected_data = {
          'collector': incident_in_db.collector.id,
          'ip_address': incident_in_db.ip_address.id,
          'incident_type': incident_in_db.incident_type,
          'metadata': incident_in_db.metadata,
          'happened_at': incident_in_db.happened_at.astimezone(tz).isoformat()
      }

      # Compare the expected data with the response
      for key, value in expected_data.items():
          self.assertEqual(response.data[key], value)

  
    def test_handle_incident_with_invalid_data(self):
        invalid_payload = {
            "ip_address": "invalid_ip",
        }

        response = self.client.post('/api/v1/collector/incident', data=invalid_payload, format='json')

        # Check response
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_handle_incident_wrong_method(self):
        # Test for methods other than POST
        response = self.client.get('/api/v1/collector/incident')
        
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.data, {'detail': 'Method "GET" not allowed.'})

