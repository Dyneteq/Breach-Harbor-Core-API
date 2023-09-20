from ..models import IPAddress

class IPAddressService():
    @staticmethod
    def find_or_create(ip_address):
        ip_address_instance, _created = IPAddress.objects.get_or_create(address=ip_address)
        return ip_address_instance
