import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
class LoginCode(models.Model):
    code =  models.UUIDField(default=uuid.uuid4, unique=True)
    user =  models.ForeignKey(User, on_delete=models.CASCADE)
    refresh_token = models.TextField(default='', blank=True)
    access_token = models.TextField(default='', blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(default=timezone.now)
    user_agent = models.CharField(blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    
    def __str__(self):
        return str(self.code)
    
    def is_expired(self):
        return timezone.now() > self.expires_at