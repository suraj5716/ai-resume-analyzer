from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_and_analyze, name='analyzer-upload'),
    path('analyze-text/', views.analyze_text, name='analyzer-text'),
    path('analyses/', views.list_analyses, name='analyzer-list'),
    path('analyses/<int:analysis_id>/', views.get_analysis, name='analyzer-detail'),
    path('analyses/<int:analysis_id>/delete/', views.delete_analysis, name='analyzer-delete'),
    path('save/', views.save_resume, name='analyzer-save'),
    path('saved/<int:resume_id>/', views.manage_saved_resume, name='analyzer-saved'),
]
