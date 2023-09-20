from django.urls import path
from collector import views

urlpatterns = [
    path('/get_all', views.get_all, name='get_all'),
    path('/create_or_update', views.create_or_update, name='create_or_update'),
    
    path('/incident', views.handle_incident, name='handle_incident'),
    path('/incident/get_all', views.get_all_incidents, name='get_all_incidents'),
    path('/incident/<str:id>', views.get_incident, name='get_incident'),
    
    path('/<str:name>', views.get_by_name, name="get_by_name"),
    path('/<str:name>/incident/get_all', views.get_all_collector_incidents, name='get_all_collector_incidents'),
    
    path('/notification/get_all', views.get_all_notifications, name='get_all_notifications')
]
