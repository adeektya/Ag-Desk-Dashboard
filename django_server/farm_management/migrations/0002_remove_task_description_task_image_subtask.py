# Generated by Django 5.0.4 on 2024-04-29 10:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("farm_management", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="task",
            name="description",
        ),
        migrations.AddField(
            model_name="task",
            name="image",
            field=models.ImageField(blank=True, null=True, upload_to="task_images/"),
        ),
        migrations.CreateModel(
            name="Subtask",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("description", models.CharField(max_length=255)),
                ("completed", models.BooleanField(default=False)),
                (
                    "task",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="subtasks",
                        to="farm_management.task",
                    ),
                ),
            ],
        ),
    ]
