# Generated by Django 5.2 on 2025-04-29 11:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0003_alter_group_owner"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="expense",
            name="category",
        ),
        migrations.AddField(
            model_name="expense",
            name="category_text",
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.CreateModel(
            name="Category",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True)),
                (
                    "group",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="categories",
                        to="core.group",
                    ),
                ),
            ],
            options={
                "unique_together": {("group", "name")},
            },
        ),
        migrations.AddField(
            model_name="expense",
            name="category_obj",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="expenses",
                to="core.category",
            ),
        ),
    ]
