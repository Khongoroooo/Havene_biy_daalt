from django.urls import path
from .views import TblUneguiAPIView

urlpatterns = [
    path('unegui/', TblUneguiAPIView.as_view(), name='unegui-api'),
]
