# Generated by Django 5.0.4 on 2024-05-02 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("farm_management", "0009_task_assigned_employee"),
    ]

    operations = [
        migrations.AddField(
            model_name="task",
            name="due_date",
            field=models.DateField(blank=True, null=True),
        ),
    ]
