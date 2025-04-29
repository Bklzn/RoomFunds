from django.db import models
from .group import Group

class Category(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    class Meta:
        unique_together = ('group', 'name')
    
    def __str__(self):
        return self.name