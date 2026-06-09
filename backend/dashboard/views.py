from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Avg
from resume_analyzer.models import ResumeAnalysis, SavedResume
from resume_builder.models import GeneratedResume


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    user = request.user

    analyses = ResumeAnalysis.objects.filter(user=user)
    saved_resumes = SavedResume.objects.filter(user=user)
    generated_resumes = GeneratedResume.objects.filter(user=user)

    total_analyses = analyses.count()
    avg_score = analyses.aggregate(Avg('overall_score'))['overall_score__avg'] or 0
    total_saved = saved_resumes.count()
    total_generated = generated_resumes.count()

    recent_analyses = ResumeAnalysis.objects.filter(user=user).order_by('-created_at')[:5]

    score_history = [
        {
            'id': a.id,
            'filename': a.filename,
            'score': a.overall_score,
            'label': a.score_label,
            'date': a.created_at.isoformat(),
        }
        for a in reversed(list(ResumeAnalysis.objects.filter(user=user).order_by('-created_at')[:20]))
    ]

    return Response({
        'total_analyses': total_analyses,
        'avg_score': round(avg_score, 1),
        'total_saved': total_saved,
        'total_generated': total_generated,
        'credits_used': user.credits_used,
        'credits_limit': user.credits_limit,
        'is_premium': user.is_premium,
        'subscription_plan': user.subscription_plan,
        'recent_analyses': [
            {
                'id': a.id,
                'filename': a.filename,
                'score': a.overall_score,
                'label': a.score_label,
                'date': a.created_at.isoformat(),
            }
            for a in recent_analyses
        ],
        'score_history': score_history,
        'template_usage': [],
        'monthly_activity': [],
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_activity(request):
    recent = ResumeAnalysis.objects.filter(user=request.user)[:10]
    return Response([
        {
            'type': 'analysis',
            'title': a.filename,
            'description': f"Score: {a.overall_score}% - {a.score_label}",
            'date': a.created_at.isoformat(),
            'score': a.overall_score,
        }
        for a in recent
    ])
