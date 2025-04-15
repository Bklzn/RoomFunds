from django.db import models
from django.contrib.auth.models import User

class Group(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    members = models.ManyToManyField(User, related_name="expense_groups", blank=True)
    owner = models.ForeignKey(User, on_delete=models.PROTECT, related_name='owned_groups')
    moderators = models.ManyToManyField(User, related_name="moderated_groups", blank=True)
        
    def __str__(self):
        return f"{self.name}"
    
    def get_owner(self):
        return self.memberships.filter(role=self.ROLE_OWNER).first().user
    
    def get_moderators(self):
        return self.memberships.filter(role=self.ROLE_MODERATOR)
    
    def get_members(self):
        return self.memberships.all()
    
    def transfer_ownership(self):
        members = self.memberships.exclude(role=self.ROLE_OWNER).order_by('joined_at')
        
        for m in members:
            if m.role == self.ROLE_MODERATOR:
                m.role = self.ROLE_OWNER
                m.save()
                return
        if members.count() > 0:
            members[0].role = self.ROLE_OWNER
            members[0].save()
            return
    
class GroupMembership(models.Model):
    ROLE_MEMBER = 'member'
    ROLE_MODERATOR = 'moderator'
    ROLE_OWNER = 'owner'
    ROLE_CHOICES = [
        (ROLE_MEMBER, 'Member'),
        (ROLE_MODERATOR, 'Moderator'),
        (ROLE_OWNER, 'Owner'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='memberships')
    joined_at = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=ROLE_MEMBER)
    alias = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ('user', 'group')
