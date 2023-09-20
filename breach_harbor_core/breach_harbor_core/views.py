from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from breach_harbor_core.serializers.user_serializer import UserSerializer

@api_view(['GET'])
def get_user(request):
    try:
        user = request.user
        serializer = UserSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'errors': [str(e)]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)