# Generated by Django 4.2.11 on 2024-05-14 12:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("vehicle_management", "0002_vehicleitem_delete_vehicle"),
    ]

    operations = [
        migrations.RenameField(
            model_name="vehicleitem", old_name="farm_id", new_name="farm",
        ),
    ]
