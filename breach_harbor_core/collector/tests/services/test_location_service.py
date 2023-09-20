from unittest import mock
from django.test import TestCase
from ...models import Location
from ...services.location_service import LocationService

def create_mock_location_payload():
    """Create a mock location payload with fake but realistic data."""

    payload = {
        'country': mock.MagicMock(names={'en': 'USA'}, iso_code='US', is_in_european_union=False, confidence=90),
        'subdivisions': [mock.MagicMock(names={'en': 'California'})],
        'location': mock.MagicMock(latitude=34.05, longitude=-118.25, time_zone='America/Los_Angeles', accuracy_radius=50),
        'city': mock.MagicMock(names={'en': 'Los Angeles'}, confidence=80),
        'continent': mock.MagicMock(names={'en': 'North America'}),
        'traits': mock.MagicMock(
            autonomous_system_number=12345,
            autonomous_system_organization='Some ISP Org',
            connection_type='cable',
            domain='isp-domain.com',
            is_anonymous=False,
            is_anonymous_proxy=False,
            is_anonymous_vpn=False,
            is_hosting_provider=False,
            is_legitimate_proxy=False,
            is_public_proxy=False,
            is_residential_proxy=False,
            is_satellite_provider=False,
            is_tor_exit_node=False,
            isp='Some ISP',
            organization='Some Organization'
        )
    }

    return payload

class LocationServiceTestCase(TestCase):

    @mock.patch('collector.services.location_service.geoip2.database.Reader')
    def test_find_or_create_location_new(self, MockReader):
        # Use the mock location payload
        mock_location_payload = create_mock_location_payload()

        # Convert the payload into a MagicMock object for mocking
        mock_geo = mock.MagicMock(**mock_location_payload)

        MockReader.return_value.__enter__.return_value.city.return_value = mock_geo

        ip_address = "152.12.11.12"

        location = LocationService.find_or_create_location(ip_address)

        self.assertEqual(location.country_name, 'USA')
        self.assertEqual(location.region, 'California')
        self.assertEqual(location.city, 'Los Angeles')

    @mock.patch('collector.services.location_service.geoip2.database.Reader')
    def test_find_or_create_location_existing(self, MockReader):
        # Creating a location instance
        Location.objects.create(
            country_name="USA",
            region="California",
            city="Los Angeles",
            coords="34.05,-118.25"
        )

        # Use the mock location payload
        mock_location_payload = create_mock_location_payload()

        # Convert the payload into a MagicMock object for mocking
        mock_geo = mock.MagicMock(**mock_location_payload)

        MockReader.return_value.__enter__.return_value.city.return_value = mock_geo

        ip_address = "152.12.11.12"

        location = LocationService.find_or_create_location(ip_address)

        self.assertEqual(location.country_name, 'USA')
        self.assertEqual(location.region, 'California')
        self.assertEqual(location.city, 'Los Angeles')
