from django.test import TestCase
from django.contrib.auth.models import User
from collector.models import Collector, IPAddress
import jwt
from breach_harbor_core.settings import JWT_SECRET

class CollectorTokenGenerationTest(TestCase):

    def setUp(self):
        # Create a user for the Collector's foreign key
        self.user = User.objects.create_user(username='testuser', password='testpass')

        # Create an IPAddress instance for Collector's foreign key
        self.ip_address = IPAddress.objects.create(address='192.168.1.1')

    def test_token_generation_on_collector_creation(self):
        collector = Collector.objects.create(name="Test Collector", user=self.user, ip_address=self.ip_address)

        # Check if the token has been set
        self.assertIsNotNone(collector.token)

        # Decode the token to verify its content
        decoded_payload = jwt.decode(collector.token, JWT_SECRET, algorithms=["HS256"])

        # Check if token contains correct collector name
        self.assertEqual(decoded_payload['collector_name'], "Test Collector")

        # Check if token contains user_id
        self.assertEqual(decoded_payload['user_id'], self.user.id)
