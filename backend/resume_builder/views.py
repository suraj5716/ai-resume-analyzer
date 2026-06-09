from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import GeneratedResume
from .serializers import GeneratedResumeSerializer
from .services import generate_bullet_points, optimize_resume_content


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_resume(request):
    serializer = GeneratedResumeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_resumes(request):
    resumes = GeneratedResume.objects.filter(user=request.user)
    serializer = GeneratedResumeSerializer(resumes, many=True)
    return Response(serializer.data)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_resume(request, resume_id):
    try:
        resume = GeneratedResume.objects.get(id=resume_id, user=request.user)
    except GeneratedResume.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(GeneratedResumeSerializer(resume).data)
    elif request.method == 'PATCH':
        serializer = GeneratedResumeSerializer(resume, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        resume.delete()
        return Response({"message": "Resume deleted"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_bullets(request):
    experience_text = request.data.get('experience_text', '')
    if not experience_text:
        return Response({"error": "Experience text required"}, status=status.HTTP_400_BAD_REQUEST)
    bullets = generate_bullet_points(experience_text)
    return Response({"bullets": bullets})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def optimize_content(request):
    content = request.data.get('content', '')
    context = request.data.get('context', '')
    if not content:
        return Response({"error": "Content required"}, status=status.HTTP_400_BAD_REQUEST)
    optimized = optimize_resume_content(content, context)
    return Response({"optimized": optimized})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_resume(request, resume_id, format='pdf'):
    try:
        resume = GeneratedResume.objects.get(id=resume_id, user=request.user)
    except GeneratedResume.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    export_data = GeneratedResumeSerializer(resume).data
    return Response({
        "message": f"Export ready in {format} format",
        "data": export_data,
        "format": format,
    })
