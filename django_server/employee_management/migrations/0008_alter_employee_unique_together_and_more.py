# Generated by Django 5.0.4 on 2024-05-27 12:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee_management', '0007_alter_employee_email_alter_employee_unique_together'),
        ('farm', '0002_setup_default_farm'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='employee',
            unique_together={('email', 'farm')},
        ),
        migrations.AlterField(
            model_name='employee',
            name='section',
            field=models.CharField(max_length=255),
        ),
    ]
