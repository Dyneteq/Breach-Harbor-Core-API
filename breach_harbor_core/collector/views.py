from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from .serializers.notification_serializer import NotificationSerializer
from .serializers.incident_serializer import IncidentSerializer
from .serializers.collector_serializer import CollectorSerializer
from .models import Collector, Incident, Notification
from .services.ip_address_service import IPAddressService
from .services.incident_service import IncidentService


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def handle_incident(request):
    if request.method == "POST":
        auth_header = request.headers.get('Authorization')
        if not auth_header or 'Bearer ' not in auth_header:
            return Response({'errors': ['Authorization token missing or invalid']}, status=status.HTTP_400_BAD_REQUEST)

        token = auth_header.split('Bearer ')[1]

        verified = IncidentService.verify_user_collector(request.data, token)
        if not verified:
            return Response({'errors': ['Collector cannot be verified']}, status=status.HTTP_400_BAD_REQUEST)
        result = IncidentService.create_incident(request.data)

        if 'errors' in result:
            return Response(result['errors'], status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_201_CREATED)

    return Response({"message": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
def get_all(request):
    try:
        user_collectors = Collector.objects.filter(user=request.user)
        collector_serializer = CollectorSerializer(user_collectors, many=True)
        
        return Response(collector_serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'errors': [str(e)]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST', 'PATCH'])
def create_or_update(request):
    # Extract data
    data = request.data
    name = data.get('name')
    ipAddress = data.get('ipAddress')

    if not name or not ipAddress:
        return Response({'errors': ['Name and IP Address are required.']}, status=status.HTTP_400_BAD_REQUEST)

    # Check for existence of name and IP address in Collector database
    try:
        existing_collector_by_name = Collector.objects.filter(
            name=name).first()
        existing_collector_by_ip = Collector.objects.filter(
            ip_address__address=ipAddress).first()

        if existing_collector_by_name:
            return Response({'errors': ['Collector with this name already exists.']}, status=status.HTTP_400_BAD_REQUEST)

        if existing_collector_by_ip:
            return Response({'errors': ['Collector with this IP Address already exists.']}, status=status.HTTP_400_BAD_REQUEST)

        # If neither exists, first retrieve or create IPAddress, then create Collector
        ip_address_instance = IPAddressService.find_or_create(ipAddress)
        collector = Collector.objects.create(name=name, ip_address=ip_address_instance, user=request.user)
        collector_serializer = CollectorSerializer(collector)
        
        return Response(collector_serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'errors': [str(e)]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_all_incidents(request, limit=50):
    try:
        incidents = Incident.objects.filter(user=request.user).order_by('-happened_at')[:int(limit)]
        incident_serializer = IncidentSerializer(incidents, many=True).data
        
        return Response(incident_serializer, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'errors': [str(e)]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_incident(request, id):
    if request.method == "GET":
        incident_obj = Incident.objects.get(user=request.user, id=id)
        if incident_obj:
            incident_serialized = IncidentSerializer(incident_obj).data
            return Response(incident_serialized, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)
    return Response({"message": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
def get_by_name(request, name):
    if request.method == "GET":
        collector_obj = Collector.objects.get(user=request.user, name=name)
        if collector_obj:
            collector_serialized = CollectorSerializer(collector_obj).data
            return Response(collector_serialized, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)
    return Response({"message": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
def get_all_collector_incidents(request, name):
    try:
        collector_obj = Collector.objects.get(user=request.user, name=name)
        if collector_obj:
            # Extract the limit value from request's GET parameters
            limit = request.GET.get('limit', None)

            incidents = Incident.objects.filter(user=request.user, collector=collector_obj).order_by('-happened_at')

            # Apply the limit if it exists and is a valid integer
            if limit and limit.isdigit():
                incidents = incidents[:int(limit)]

            incident_serializer = IncidentSerializer(incidents, many=True).data

        return Response(incident_serializer, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'errors': [str(e)]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
@api_view(['GET'])
def get_all_notifications(request, limit=50):
    try:
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')[:int(limit)]
        notification_serializer = NotificationSerializer(notifications, many=True).data
        
        return Response(notification_serializer, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'errors': [str(e)]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
