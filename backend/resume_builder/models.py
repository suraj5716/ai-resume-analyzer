from django.db import models
from django.conf import settings


class GeneratedResume(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, default='My Resume')
    template = models.CharField(max_length=100, default='modern-professional')
    primary_color = models.CharField(max_length=7, default='#2563eb')
    font_family = models.CharField(max_length=50, default='Inter')
    personal_info = models.JSONField(default=dict)
    summary = models.TextField(blank=True)
    experience = models.JSONField(default=list)
    education = models.JSONField(default=list)
    skills = models.JSONField(default=list)
    certifications = models.JSONField(default=list)
    projects = models.JSONField(default=list)
    languages = models.JSONField(default=list)
    custom_sections = models.JSONField(default=dict)
    is_draft = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.title} - {self.user.email}"
