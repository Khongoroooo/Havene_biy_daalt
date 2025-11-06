from django.urls import path
from .views import register_user, list_users
from .login_views import login
from .token_views import reset_password, verify_email
from .confirm_reset_password_views import confirm_reset_password
from .profile_views import get_profile

urlpatterns = [
    path("login/", login),
    path("register/", register_user),
    path("verify_email/", verify_email),
    path("reset_password/", reset_password),
    path("confirm_reset_password/", confirm_reset_password),
    path("profile/", get_profile),
    path("", list_users),
]
