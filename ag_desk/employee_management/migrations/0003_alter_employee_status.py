# Generated by Django 5.0.4 on 2024-04-30 15:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("employee_management", "0002_rename_phone_number_employee_contactnumber"),
    ]

    operations = [
        migrations.AlterField(
            model_name="employee",
            name="status",
            field=models.CharField(
                choices=[("Active", "Active"), ("Inactive", "Inactive")],
                default="active",
                max_length=10,
            ),
        ),
    ]