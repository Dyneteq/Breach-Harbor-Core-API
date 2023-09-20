import logging 

from django.utils import timezone
from datetime import timedelta
from ...models import Notification, IncidentNotification

logger = logging.getLogger(__name__)

class NotificationCreator:
    def __init__(self, user, incident_instance):
        self.user = user
        self.incident_instance = incident_instance

    def _create_or_find_notification(self):
      # Check if there's an existing notification for the user in the past X minutes
      existing_notification = Notification.objects.filter(
          user=self.user,
          created_at__gte=timezone.now() - timedelta(minutes=10)
      ).first()

      if not existing_notification:
          message = f"Incident occurred by IP: {self.incident_instance.ip_address.address} at {self.incident_instance.happened_at}"
          existing_notification = Notification.objects.create(
              incident=self.incident_instance,
              user=self.user,
              message=message,
              severity='high',
              channel_read_status={"email": False, "client": False}
          )
          
          # Log the creation of a new notification
          logger.info(f"New notification created for user {self.user.id} regarding incident {self.incident_instance.id}")

      else:
          linked_incidents = IncidentNotification.objects.filter(notification=existing_notification).count()

          if linked_incidents == 1:
              existing_notification.notification_type = 'batch'
              message = f"{linked_incidents + 1} incidents detected in the last 10 minutes."
          elif linked_incidents > 1:
              message = f"{linked_incidents + 1} incidents detected in the last 10 minutes."
          else:
              # In case you want to handle a scenario with just one incident.
              message = f"Incident detected at {self.incident_instance.happened_at}"

          existing_notification.message = message
          existing_notification.save()

          logger.info(f"Existing notification found for user {self.user.id} within last 10 minutes. Reusing for incident {self.incident_instance.id}")

      return existing_notification


    def _link_incident_with_notification(self, notification_instance):
        IncidentNotification.objects.create(
            incident=self.incident_instance,
            notification=notification_instance
        )

        # Log the linking of the incident with the notification
        logger.info(f"Incident {self.incident_instance.id} linked with notification {notification_instance.id}")

    def create(self):
        notification_instance = self._create_or_find_notification()
        self._link_incident_with_notification(notification_instance)
        return notification_instance
