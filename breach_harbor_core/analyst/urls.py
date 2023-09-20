from django.urls import path
from analyst import views

urlpatterns = [
    path('/get_amount', views.get_amount, name='get_amount'),
    path('/get_all_incidents', views.get_all_incidents, name='get_all_incidents'),
    path('/get_stats', views.get_stats, name='get_stats'),
    path('/get_all_ip_addresses', views.get_all_ip_addresses, name="get_all_ip_addresses"),
    path('/get_by_ip_address/<str:ip_address>', views.get_by_ip_address, name="get_by_ip_address")
]