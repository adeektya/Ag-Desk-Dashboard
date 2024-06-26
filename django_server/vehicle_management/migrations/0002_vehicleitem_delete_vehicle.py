# Generated by Django 4.2.11 on 2024-05-14 11:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("farm", "0001_initial"),
        ("vehicle_management", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="VehicleItem",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("vehicle_name", models.CharField(max_length=100)),
                ("vehicle_type", models.CharField(db_index=True, max_length=100)),
                ("vehicle_make", models.CharField(max_length=100)),
                ("vehicle_model", models.CharField(max_length=100)),
                ("vehicle_year", models.IntegerField(db_index=True)),
                ("service_status", models.CharField(max_length=100)),
                ("next_service_date", models.DateField(blank=True, null=True)),
                ("registration_renewal_date", models.DateField(blank=True, null=True)),
                (
                    "image",
                    models.ImageField(blank=True, null=True, upload_to="vehicles/"),
                ),
                (
                    "farm_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="vehicles",
                        to="farm.farm",
                    ),
                ),
            ],
        ),
        migrations.DeleteModel(name="Vehicle",),
    ]
