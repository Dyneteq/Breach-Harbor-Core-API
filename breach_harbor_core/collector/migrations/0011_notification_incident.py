# Generated by Django 4.2.4 on 2023-09-04 10:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('collector', '0010_rename_timestamp_notification_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='incident',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to='collector.incident'),
            preserve_default=False,
        ),
    ]