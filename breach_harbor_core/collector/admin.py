from django.contrib import admin

from .models import Collector, Location, IPAddress, Incident, Notification, IncidentNotification

admin.site.register(Collector)
admin.site.register(Location)
admin.site.register(IPAddress)
admin.site.register(Incident)
admin.site.register(Notification)
admin.site.register(IncidentNotification)