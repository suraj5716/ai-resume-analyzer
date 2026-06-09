from django.db import models


class ResumeTemplate(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100, default='professional')
    preview_image = models.ImageField(upload_to='templates/', blank=True, null=True)
    thumbnail = models.ImageField(upload_to='templates/thumbs/', blank=True, null=True)
    is_premium = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    layout_data = models.JSONField(default=dict)
    default_colors = models.JSONField(default=list)
    default_fonts = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class TemplateCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, default='📄')

    class Meta:
        verbose_name_plural = 'Template Categories'

    def __str__(self):
        return self.name
