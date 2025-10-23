from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    supabase_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="User ID from Supabase authentication"
    )

    def __str__(self):
        return self.username
