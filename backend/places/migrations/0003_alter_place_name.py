# Generated by Django 4.2 on 2023-06-17 08:31

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("places", "0002_alter_place_latitude_alter_place_longitude"),
    ]

    operations = [
        migrations.AlterField(
            model_name="place",
            name="name",
            field=models.CharField(max_length=255),
        ),
    ]