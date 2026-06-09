from django.contrib import admin
from .models import ResumeTemplate, TemplateCategory


@admin.register(ResumeTemplate)
class ResumeTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'is_premium', 'is_active')
    list_filter = ('category', 'is_premium', 'is_active')
    prepopulated_fields = {'slug': ('name',)}


admin.site.register(TemplateCategory)
