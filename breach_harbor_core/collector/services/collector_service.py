import jwt
from ..models import Collector
from breach_harbor_core.settings import JWT_SECRET


class CollectorService:
    @staticmethod
    def get_by_name(name):
        return Collector.objects.get(name=name)
      
    @staticmethod
    def decode_token(token: str):
      try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get('user_id')
        return user_id
      except jwt.ExpiredSignatureError:
        # Token has expired, handle as needed
        return None
      except jwt.DecodeError as e:
        print("Decode Error:", e)
        return None

