from django.db import models
from django.conf import settings


class ResumeAnalysis(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    filename = models.CharField(max_length=255)
    file = models.FileField(upload_to='resumes/')
    job_description = models.TextField(blank=True)
    overall_score = models.IntegerField(default=0)
    score_label = models.CharField(max_length=50, default='')
    score_color = models.CharField(max_length=20, default='')
    result_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.filename} - {self.overall_score}%"


class SavedResume(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    resume_data = models.JSONField(default=dict)
    template = models.CharField(max_length=100, default='modern-professional')
    is_draft = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.title
