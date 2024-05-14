# Generated by Django 5.0.4 on 2024-05-06 01:31

from django.db import migrations

def add_default_farm(apps, schema_editor):
    Farm = apps.get_model("farm", "Farm")
    CustomUser = apps.get_model("core", "CustomUser")
    owner = CustomUser.objects.get(pk=23)  # Replace 23 with the actual owner_id if different

    Farm.objects.get_or_create(
        id=1,
        defaults={
            "name": "Main Farm",
            "address": "Default Address",
            "owner": owner
        }
    )

class Migration(migrations.Migration):

    dependencies = [
        ('farm', '0001_initial'),  # Make sure this is the correct dependency
    ]

    operations = [
        migrations.RunPython(add_default_farm),
    ]