from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import SubscriptionPlan, Payment
from .serializers import SubscriptionPlanSerializer, PaymentSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def list_plans(request):
    plans = SubscriptionPlan.objects.filter(is_active=True)
    serializer = SubscriptionPlanSerializer(plans, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_subscription(request):
    plan_id = request.data.get('plan_id')
    interval = request.data.get('interval', 'monthly')

    try:
        plan = SubscriptionPlan.objects.get(id=plan_id, is_active=True)
    except SubscriptionPlan.DoesNotExist:
        return Response({"error": "Plan not found"}, status=404)

    price = plan.price_yearly if interval == 'yearly' else plan.price_monthly

    payment = Payment.objects.create(
        user=request.user,
        amount=price,
        plan=plan,
        status='pending',
    )

    request.user.credits_limit = plan.credits_monthly
    request.user.is_premium = True
    request.user.subscription_plan = plan.slug
    request.user.save()

    payment.status = 'completed'
    payment.save()

    return Response({
        "message": f"Subscribed to {plan.name}",
        "payment": PaymentSerializer(payment).data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_history(request):
    payments = Payment.objects.filter(user=request.user)
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)
