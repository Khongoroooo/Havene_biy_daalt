from django.urls import path
from .views import register_user, list_users

urlpatterns = [
    path("register/", register_user),
    path("", list_users),           
]
