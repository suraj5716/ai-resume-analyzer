from rest_framework import serializers
from .models import ResumeTemplate, TemplateCategory


class ResumeTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeTemplate
        fields = '__all__'


class TemplateCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateCategory
        fields = '__all__'
