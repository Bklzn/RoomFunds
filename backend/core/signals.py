from django.db.models.signals import pre_delete
from django.dispatch import receiver
from .models import Group
from django.contrib.auth.models import User

@receiver(pre_delete, sender=User)
def handle_user_deletion(sender, instance, **kwargs):
    for group in Group.objects.filter(owner=instance):
        if group.memberships.count() == 1:
            group.delete()
        else:
            group.transfer_ownership()
