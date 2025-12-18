from django.urls import path
from . import views

urlpatterns = [
    path("create_or_update/", views.create_or_update_property, name="create_or_update_property"),
    path('detail/<int:property_id>', views.property_detail, name='property_detail'),
    path('favorite', views.toggle_favorite, name='toggle_favorite'),
    path('list', views.ul_hudluh_list, name='ul_hudluh_list'),
    path('create', views.create_or_update_property, name='create_property'),
]
