import os
import uuid
import json
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import ResumeAnalysis, SavedResume
from .serializers import ResumeAnalysisSerializer, ResumeAnalysisListSerializer, SavedResumeSerializer
from .parser import extract_text, extract_contact_info
from .services import analyze_resume, analyze_without_jd


@api_view(['POST'])
@permission_classes([AllowAny])
def upload_and_analyze(request):
    if 'resume' not in request.FILES:
        return Response({"error": "No resume file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

    file = request.FILES['resume']
    job_description = request.data.get('job_description', '').strip()
    job_title = request.data.get('job_title', '').strip()

    ext = os.path.splitext(file.name)[1].lower()
    if ext not in ('.pdf', '.docx'):
        return Response({"error": "Invalid format. Upload PDF or DOCX"}, status=status.HTTP_400_BAD_REQUEST)

    unique_name = f"{uuid.uuid4().hex}_{file.name}"
    file_path = os.path.join(settings.UPLOAD_FOLDER, unique_name)

    try:
        with open(file_path, 'wb+') as dest:
            for chunk in file.chunks():
                dest.write(chunk)

        resume_text = extract_text(file_path)

        if len(resume_text.strip()) < 50:
            return Response({"error": "Could not extract enough text"}, status=status.HTTP_400_BAD_REQUEST)

        if job_description and len(job_description) > 20:
            results = analyze_resume(resume_text, job_description)
        else:
            results = analyze_without_jd(resume_text, job_title)

        results['filename'] = file.name

        user = request.user if request.user.is_authenticated else None
        analysis = ResumeAnalysis.objects.create(
            user=user,
            filename=file.name,
            file=f"resumes/{unique_name}",
            job_description=job_description,
            overall_score=results['overall_score'],
            score_label=results['score_label'],
            score_color=results['score_color'],
            result_data=results,
        )

        return Response({
            'id': analysis.id,
            **results
        })

    except ValueError as ve:
        return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": f"Analysis failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_analysis(request, analysis_id):
    try:
        analysis = ResumeAnalysis.objects.get(id=analysis_id)
        serializer = ResumeAnalysisSerializer(analysis)
        return Response(serializer.data)
    except ResumeAnalysis.DoesNotExist:
        return Response({"error": "Analysis not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_analyses(request):
    analyses = ResumeAnalysis.objects.filter(user=request.user)
    serializer = ResumeAnalysisListSerializer(analyses, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_analysis(request, analysis_id):
    try:
        analysis = ResumeAnalysis.objects.get(id=analysis_id, user=request.user)
        analysis.delete()
        return Response({"message": "Analysis deleted"})
    except ResumeAnalysis.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_resume(request):
    serializer = SavedResumeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_saved_resume(request, resume_id):
    try:
        resume = SavedResume.objects.get(id=resume_id, user=request.user)
    except SavedResume.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(SavedResumeSerializer(resume).data)
    elif request.method == 'PATCH':
        serializer = SavedResumeSerializer(resume, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        resume.delete()
        return Response({"message": "Resume deleted"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_text(request):
    resume_text = request.data.get('resume_text', '').strip()
    job_description = request.data.get('job_description', '').strip()

    if not resume_text:
        return Response({"error": "Resume text is required"}, status=status.HTTP_400_BAD_REQUEST)

    if not job_description or len(job_description) < 20:
        job_title = request.data.get('job_title', '')
        results = analyze_without_jd(resume_text, job_title)
    else:
        results = analyze_resume(resume_text, job_description)

    return Response(results)
