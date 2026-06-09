from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_resume, name='builder-create'),
    path('list/', views.list_resumes, name='builder-list'),
    path('<int:resume_id>/', views.manage_resume, name='builder-detail'),
    path('<int:resume_id>/export/<str:format>/', views.export_resume, name='builder-export'),
    path('generate-bullets/', views.generate_bullets, name='builder-bullets'),
    path('optimize/', views.optimize_content, name='builder-optimize'),
]
