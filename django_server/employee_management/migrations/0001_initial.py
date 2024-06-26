# Generated by Django 5.0.4 on 2024-04-30 10:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Employee",
            fields=[
                ("employee_id", models.AutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=255)),
                (
                    "role",
                    models.CharField(
                        choices=[("manager", "Manager"), ("employee", "Employee")],
                        default="employee",
                        max_length=50,
                    ),
                ),
                ("phone_number", models.CharField(max_length=50)),
                ("email", models.EmailField(max_length=254, unique=True)),
                (
                    "section",
                    models.CharField(
                        choices=[
                            ("A", "Section A"),
                            ("B", "Section B"),
                            ("C", "Section C"),
                        ],
                        default="A",
                        max_length=1,
                    ),
                ),
                ("start_date", models.DateField()),
                ("salary", models.DecimalField(decimal_places=2, max_digits=10)),
                (
                    "status",
                    models.CharField(
                        choices=[("active", "Active"), ("inactive", "Inactive")],
                        default="active",
                        max_length=10,
                    ),
                ),
                (
                    "photo",
                    models.ImageField(
                        blank=True, null=True, upload_to="employee_photos/"
                    ),
                ),
            ],
        ),
    ]
