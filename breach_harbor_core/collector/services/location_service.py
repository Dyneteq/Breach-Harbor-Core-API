import logging 
import geoip2.database
from geoip2.errors import AddressNotFoundError
from django.db.models import Q
from ..models import Location

logger = logging.getLogger(__name__)

class LocationService:
    @staticmethod
    def find_or_create_location(ip_address: str):
        try:
            with geoip2.database.Reader('data/GeoLite2-City.mmdb') as reader:
                geo = reader.city(ip_address)

                location_data = {
                    'country_name': geo.country.names['en'] if geo.country and 'en' in geo.country.names else '',
                    'region': geo.subdivisions[0].names['en'] if geo.subdivisions and 'en' in geo.subdivisions[0].names else '',
                    'timezone': geo.location.time_zone if geo.location and hasattr(geo.location, 'time_zone') else '',
                    'city': geo.city.names['en'] if geo.city and 'en' in geo.city.names else '',
                    'coords': f"{geo.location.latitude},{geo.location.longitude}" if geo.location and hasattr(geo.location, 'latitude') and hasattr(geo.location, 'longitude') else '',
                    'is_in_european_union': geo.country.is_in_european_union,
                    'accuracy_radius': geo.location.accuracy_radius if geo.location and hasattr(geo.location, 'accuracy_radius') else None,
                    'continent': geo.continent.names['en'] if geo.continent and 'en' in geo.continent.names else '',
                    'city_confidence': geo.city.confidence if hasattr(geo.city, 'confidence') else None,
                    'country_confidence': geo.country.confidence if hasattr(geo.country, 'confidence') else None,
                    'country_iso_code': geo.country.iso_code if hasattr(geo.country, 'iso_code') else '',
                    'autonomous_system_number': geo.traits.autonomous_system_number if hasattr(geo.traits, 'autonomous_system_number') else None,
                    'autonomous_system_organization': geo.traits.autonomous_system_organization if hasattr(geo.traits, 'autonomous_system_organization') else '',
                    'connection_type': geo.traits.connection_type if hasattr(geo.traits, 'connection_type') else None,
                    'domain': geo.traits.domain if hasattr(geo.traits, 'domain') else None,
                    'is_anonymous': geo.traits.is_anonymous if hasattr(geo.traits, 'is_anonymous') else None,
                    'is_anonymous_proxy': geo.traits.is_anonymous_proxy if hasattr(geo.traits, 'is_anonymous_proxy') else None,
                    'is_anonymous_vpn': geo.traits.is_anonymous_vpn if hasattr(geo.traits, 'is_anonymous_vpn') else None,
                    'is_hosting_provider': geo.traits.is_hosting_provider if hasattr(geo.traits, 'is_hosting_provider') else None,
                    'is_legitimate_proxy': geo.traits.is_legitimate_proxy if hasattr(geo.traits, 'is_legitimate_proxy') else None,
                    'is_public_proxy': geo.traits.is_public_proxy if hasattr(geo.traits, 'is_public_proxy') else None,
                    'is_residential_proxy': geo.traits.is_residential_proxy if hasattr(geo.traits, 'is_residential_proxy') else None,
                    'is_satellite_provider': geo.traits.is_satellite_provider if hasattr(geo.traits, 'is_satellite_provider') else None,
                    'is_tor_exit_node': geo.traits.is_tor_exit_node if hasattr(geo.traits, 'is_tor_exit_node') else None,
                    'isp': geo.traits.isp if hasattr(geo.traits, 'isp') else None,
                    'organization': geo.traits.organization if hasattr(geo.traits, 'organization') else None,
                }

                location_instance = Location.objects.filter(
                    Q(country_name=location_data['country_name'], city=location_data['city']) | Q(
                        coords=location_data['coords'])
                ).first()
            
        except AddressNotFoundError:
            logger.warning(f"No data found for IP address {ip_address}")
            return None

        if location_instance:
            for key, value in location_data.items():
                setattr(location_instance, key, value)
            location_instance.save()
        else:
            location_instance = Location.objects.create(**location_data)

        return location_instance


