from rest_framework import serializers
from .models import ResumeAnalysis, SavedResume


class ResumeAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeAnalysis
        fields = '__all__'
        read_only_fields = ('id', 'user', 'overall_score', 'score_label', 'score_color', 'result_data', 'created_at')


class ResumeAnalysisListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeAnalysis
        fields = ('id', 'filename', 'overall_score', 'score_label', 'score_color', 'created_at')


class SavedResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedResume
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')
