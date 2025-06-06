from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from .category import Category
from .group import Group
from django.utils import timezone

class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="expenses")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category_text = models.CharField(max_length=50, blank=True)
    category =  models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="expenses")
    description = models.TextField(blank=True)
    date = models.DateField(null=False)
    
    def __str__(self):
        return f"{self.description} - {self.amount}"

    
    def clean(self):
        if self.date > timezone.now().date():
            raise ValidationError("Date cannot be in the future")  