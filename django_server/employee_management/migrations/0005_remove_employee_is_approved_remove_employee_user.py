# Generated by Django 5.0.4 on 2024-05-04 14:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("employee_management", "0004_employee_is_approved_employee_user"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="employee",
            name="is_approved",
        ),
        migrations.RemoveField(
            model_name="employee",
            name="user",
        ),
    ]