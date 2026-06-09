from django.contrib import admin
from .models import SubscriptionPlan, Payment

admin.site.register(SubscriptionPlan)
admin.site.register(Payment)
