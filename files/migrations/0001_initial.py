# Generated by Django 5.0.6 on 2024-07-09 06:08

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('size', models.PositiveIntegerField()),
                ('mime_type', models.CharField(default='text', max_length=255)),
                ('upload_date', models.DateTimeField(auto_now_add=True)),
                ('last_download_date', models.DateTimeField(auto_now=True)),
                ('comment', models.TextField(blank=True)),
                ('storage_path', models.CharField(max_length=255)),
                ('special_link', models.CharField(blank=True, max_length=255, null=True, unique=True)),
                ('user_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.userprofile')),
            ],
        ),
    ]