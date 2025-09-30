# core/migrations/0012_convert_slug_to_uuid.py
import uuid
from django.db import migrations, models

def copy_slug_to_uuid(apps, schema_editor):
    Group = apps.get_model("core", "Group")
    for group in Group.objects.all():
        try:
            group.slug_uuid = uuid.UUID(group.slug)
        except ValueError:
            group.slug_uuid = uuid.uuid4()
        group.save()

class Migration(migrations.Migration):

    dependencies = [
        ("core", "0011_alter_group_slug"),
    ]

    operations = [
        migrations.AddField(
            model_name="group",
            name="slug_uuid",
            field=models.UUIDField(default=uuid.uuid4, editable=False, null=True),
        ),
        migrations.RunPython(copy_slug_to_uuid),
        migrations.RemoveField(
            model_name="group",
            name="slug",
        ),
        migrations.RenameField(
            model_name="group",
            old_name="slug_uuid",
            new_name="slug",
        ),
        migrations.AlterField(
            model_name="group",
            name="slug",
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
