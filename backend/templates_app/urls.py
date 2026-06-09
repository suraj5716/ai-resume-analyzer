from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_templates, name='templates-list'),
    path('categories/', views.list_categories, name='templates-categories'),
    path('<slug:slug>/', views.get_template, name='templates-detail'),
    path('<int:template_id>/preview/', views.get_preview, name='templates-preview'),
]
