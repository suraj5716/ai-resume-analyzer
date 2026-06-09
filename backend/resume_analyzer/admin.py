from django.contrib import admin
from .models import ResumeAnalysis, SavedResume


@admin.register(ResumeAnalysis)
class ResumeAnalysisAdmin(admin.ModelAdmin):
    list_display = ('filename', 'user', 'overall_score', 'score_label', 'created_at')
    list_filter = ('score_label', 'created_at')
    search_fields = ('filename',)


@admin.register(SavedResume)
class SavedResumeAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'template', 'is_draft', 'created_at')
    list_filter = ('template', 'is_draft')
    search_fields = ('title',)
