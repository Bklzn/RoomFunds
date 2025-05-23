# Generated by Django 5.2 on 2025-04-25 10:19

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="groupmembership",
            name="alias",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name="group",
            name="members",
            field=models.ManyToManyField(
                blank=True, related_name="expense_groups", to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AlterField(
            model_name="group",
            name="moderators",
            field=models.ManyToManyField(
                blank=True, related_name="moderated_groups", to=settings.AUTH_USER_MODEL
            ),
        ),
    ]
