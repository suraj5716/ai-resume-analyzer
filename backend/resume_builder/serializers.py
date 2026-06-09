from rest_framework import serializers
from .models import GeneratedResume


class GeneratedResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedResume
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')
