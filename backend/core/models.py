from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    date = models.DateField(null=False)
    
    def __str__(self):
        return f"{self.amount} - {self.category}"

    def clean(self):
        if self.date > timezone.now().date():
            raise ValidationError("Date cannot be in the future")