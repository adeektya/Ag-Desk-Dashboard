# Generated by Django 5.0.4 on 2024-05-06 01:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("farm", "0001_initial"),
        ("farm_management", "0011_delete_userprofile"),
    ]

    operations = [
        migrations.AddField(
            model_name="task",
            name="farm",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="tasks",
                to="farm.farm",
            ),
            preserve_default=False,
        ),
    ]
