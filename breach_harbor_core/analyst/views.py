from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from analyst.serializers.ip_address_serializer import IPAddressSerializer
from analyst.services.dashboard_service import DashboardService
from collector.serializers.incident_serializer import IncidentSerializer
from collector.services.incident_service import IncidentService
from collector.models import IPAddress
from analyst.services.ip_address_service import IPAddressService

@api_view(['GET'])
def get_all_ip_addresses(request):
    if request.method == "GET":
        ip_serialized = IPAddressService.get_all()
        return Response(ip_serialized, status=status.HTTP_200_OK)
    return Response()

@api_view(['GET'])
def get_by_ip_address(request, ip_address):
    if request.method == "GET":
        data = IPAddressService.get_summary(ip_address)
        return Response(data, status=status.HTTP_200_OK)
    return Response({"message": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
def get_all_incidents(request, limit=10):
    if request.method == "GET":
        data = IncidentService.get_all_by_user(request.user, limit)
        data_serialized = IncidentSerializer(data, many=True).data
        return Response(data_serialized, status=status.HTTP_200_OK)
    return Response({"message": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
def get_amount(request):
    if request.method == "GET":
        return Response([], status=status.HTTP_200_OK)
    return Response({"message": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
def get_stats(request):
    if request.method == "GET":
        data = DashboardService.get_stats(request.user)
        return Response(data, status=status.HTTP_200_OK)
    return Response({"message": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)