# Generated by Django 4.2.11 on 2024-05-07 14:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("vehicle_management", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="vehicleitem", old_name="vehicle_mark", new_name="vehicle_make",
        ),
    ]