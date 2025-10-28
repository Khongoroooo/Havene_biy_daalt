from django.urls import path
from .views import register_user, list_users, verify_email
from .login_views import login
from .reset_password_views import reset_password

urlpatterns = [
    path("login/", login),
    path("register/", register_user),
    path("verify_email/", verify_email),
    path("reset_password/", reset_password),
    path("", list_users),           
]
