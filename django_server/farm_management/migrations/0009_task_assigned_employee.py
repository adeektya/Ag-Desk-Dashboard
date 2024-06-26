# Generated by Django 5.0.4 on 2024-05-02 06:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("employee_management", "0003_alter_employee_status"),
        ("farm_management", "0008_delete_inventoryitem"),
    ]

    operations = [
        migrations.AddField(
            model_name="task",
            name="assigned_employee",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="assigned_tasks",
                to="employee_management.employee",
            ),
        ),
    ]
