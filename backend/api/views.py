from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    return Response({
        "name": "AI Resume Analyzer API",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/api/auth/",
            "analyzer": "/api/analyzer/",
            "builder": "/api/builder/",
            "templates": "/api/templates/",
            "dashboard": "/api/dashboard/",
            "payments": "/api/payments/",
            "contact": "/api/contact/",
        }
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({"status": "ok", "message": "AI Resume Analyzer API is running"})
