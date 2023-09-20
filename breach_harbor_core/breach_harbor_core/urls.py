"""
URL configuration for breach_harbor_core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path

from breach_harbor_core import views

api_v1_urlpatterns = [
    path('/auth', include('authentication.urls')),
    path('/collector', include('collector.urls')),
    path('/analyst', include('analyst.urls')),
    path('/user', views.get_user, name="get_user")
]

urlpatterns = [
    path('admin', admin.site.urls),
    path('api/v1', include(api_v1_urlpatterns)),
]
