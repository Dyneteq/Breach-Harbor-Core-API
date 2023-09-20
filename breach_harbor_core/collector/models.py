from django.db import models
import jwt
from datetime import datetime, timedelta
from django.utils import timezone
from breach_harbor_core.settings import JWT_SECRET


class Location(models.Model):
    country_name = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    timezone = models.CharField(max_length=50)
    city = models.CharField(max_length=100)
    coords = models.CharField(max_length=255)
    is_in_european_union = models.BooleanField(null=True, blank=True)
    accuracy_radius = models.IntegerField(null=True, blank=True)
    continent = models.CharField(max_length=100, null=True, blank=True)
    city_confidence = models.IntegerField(null=True, blank=True)
    country_confidence = models.IntegerField(null=True, blank=True)
    country_iso_code = models.CharField(max_length=5, null=True, blank=True)
    autonomous_system_number = models.IntegerField(null=True, blank=True)
    autonomous_system_organization = models.TextField(null=True, blank=True)
    connection_type = models.CharField(max_length=50, null=True, blank=True)
    domain = models.CharField(max_length=255, null=True, blank=True)
    is_anonymous = models.BooleanField(null=True, blank=True)
    is_anonymous_proxy = models.BooleanField(null=True, blank=True)
    is_anonymous_vpn = models.BooleanField(null=True, blank=True)
    is_hosting_provider = models.BooleanField(null=True, blank=True)
    is_legitimate_proxy = models.BooleanField(null=True, blank=True)
    is_public_proxy = models.BooleanField(null=True, blank=True)
    is_residential_proxy = models.BooleanField(null=True, blank=True)
    is_satellite_provider = models.BooleanField(null=True, blank=True)
    is_tor_exit_node = models.BooleanField(null=True, blank=True)
    isp = models.CharField(max_length=255, null=True, blank=True)
    organization = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        fullname = ''
        if self.country_name and self.city:
            fullname = self.country_name + ', ' + self.city
        elif self.country_name:
            fullname = self.country_name
        elif self.city:
            fullname = self.city
        return fullname



class IPAddress(models.Model):
    address = models.CharField(max_length=255, unique=True)
    location = models.ForeignKey(
        Location, on_delete=models.SET_NULL, null=True, related_name="ip_addresses")

    def __str__(self):
        return self.address


class Collector(models.Model):
    name = models.CharField(max_length=255, unique=True)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    ip_address = models.ForeignKey(
        IPAddress, on_delete=models.CASCADE, related_name="collectors")
    token = models.CharField(max_length=255, unique=True, blank=True)
    last_online_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.token:
            payload = {
                'id': self.pk,
                'collector_name': self.name,
                'user_id': self.user.id,
                'exp': datetime.utcnow() + timedelta(days=3650)
            }

            token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
            self.token = token

        super(Collector, self).save(*args, **kwargs)

    def update_last_online(self):
        self.last_online_at = timezone.now()
        self.save(update_fields=['last_online_at'])

class Incident(models.Model):
    collector = models.ForeignKey(
        Collector, on_delete=models.CASCADE, related_name="incidents")
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    happened_at = models.DateTimeField()
    metadata = models.JSONField()
    incident_type = models.CharField(max_length=100)
    ip_address = models.ForeignKey(
        IPAddress, on_delete=models.CASCADE, related_name="ip_addresses")

    def __str__(self):
        return f"Incident occured by IP: {self.ip_address.address} at {self.happened_at}"

class Notification(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    NOTIFICATION_TYPE_CHOICES = [
        ('single', 'Single'),
        ('batch', 'Batch'),
    ]
    
    notification_type = models.CharField(max_length=6, choices=NOTIFICATION_TYPE_CHOICES, default='single')
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name="notifications")
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    severity = models.CharField(max_length=8, choices=SEVERITY_CHOICES, default='low')
    channel_read_status = models.JSONField(default=dict)  # example: {"email": True, "sms": False, "client": True}

    @property
    def is_read(self):
        """ Property to check if the notification has been read on any channel """
        return any(self.channel_read_status.values())

    def mark_as_read(self, channel):
        """ Marks the notification as read for a given channel """
        self.channel_read_status[channel] = True
        self.save()

    def __str__(self):
        return f"[{self.severity.upper()}] Notification for {self.user.username} - {'Read' if self.is_read else 'Unread'}"
    

class IncidentNotification(models.Model):
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE)
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('incident', 'notification')
        
