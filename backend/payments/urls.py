from django.urls import path
from . import views

urlpatterns = [
    path('plans/', views.list_plans, name='payments-plans'),
    path('subscribe/', views.create_subscription, name='payments-subscribe'),
    path('history/', views.payment_history, name='payments-history'),
]
