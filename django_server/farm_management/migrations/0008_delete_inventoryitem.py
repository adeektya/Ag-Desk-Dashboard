# Generated by Django 5.0.4 on 2024-04-30 17:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("farm_management", "0007_delete_employee"),
    ]

    operations = [
        migrations.DeleteModel(
            name="InventoryItem",
        ),
    ]
