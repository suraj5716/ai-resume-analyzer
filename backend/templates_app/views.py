from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import ResumeTemplate, TemplateCategory
from .serializers import ResumeTemplateSerializer, TemplateCategorySerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def list_templates(request):
    templates = ResumeTemplate.objects.filter(is_active=True)
    category = request.query_params.get('category', '')
    if category:
        templates = templates.filter(category=category)
    serializer = ResumeTemplateSerializer(templates, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_template(request, slug):
    try:
        template = ResumeTemplate.objects.get(slug=slug, is_active=True)
        serializer = ResumeTemplateSerializer(template)
        return Response(serializer.data)
    except ResumeTemplate.DoesNotExist:
        return Response({"error": "Template not found"}, status=404)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_categories(request):
    categories = TemplateCategory.objects.all()
    serializer = TemplateCategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_preview(request, template_id):
    try:
        template = ResumeTemplate.objects.get(id=template_id)
        return Response({
            "preview_url": template.preview_image.url if template.preview_image else None,
            "layout": template.layout_data,
        })
    except ResumeTemplate.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
