from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.dashboard_stats, name='dashboard-stats'),
    path('activity/', views.user_activity, name='dashboard-activity'),
]
