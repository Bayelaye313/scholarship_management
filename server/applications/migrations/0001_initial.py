# Generated by Django 5.1.7 on 2025-03-11 12:01

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ScholarshipApplication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('date_of_birth', models.DateField()),
                ('scholarship_type', models.CharField(max_length=50)),
                ('motivation', models.TextField()),
                ('average_grade', models.DecimalField(decimal_places=2, max_digits=4)),
                ('family_income', models.PositiveIntegerField()),
                ('attachment', models.FileField(upload_to='documents/')),
                ('status', models.CharField(choices=[('pending', 'En attente'), ('accepted', 'Acceptée'), ('rejected', 'Rejetée')], default='pending', max_length=20)),
                ('score', models.PositiveIntegerField(blank=True, null=True)),
                ('recommendations', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
