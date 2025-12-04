# properties/models.py
from django.db import models

class Property(models.Model):
    url = models.URLField(max_length=500, blank=True, null=True)
    title = models.CharField(max_length=255)
    price = models.IntegerField(default=0)
    place = models.CharField(max_length=255, blank=True)
    date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True)
    floor_type = models.CharField(max_length=255, blank=True)
    balcony = models.IntegerField(default=0)
    built_year = models.IntegerField(blank=True, null=True)
    garage = models.BooleanField(default=False)
    window_type = models.CharField(max_length=255, blank=True)
    building_floors = models.IntegerField(blank=True, null=True)
    door_type = models.CharField(max_length=255, blank=True)
    area = models.FloatField(blank=True, null=True)
    floor_number = models.IntegerField(blank=True, null=True)
    payment_method = models.CharField(max_length=255, blank=True)
    window_count = models.IntegerField(default=0)
    building_status = models.BooleanField(default=False)  # Ашиглалтад орсон=1
    elevator = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
