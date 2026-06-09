from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/analyzer/', include('resume_analyzer.urls')),
    path('api/builder/', include('resume_builder.urls')),
    path('api/templates/', include('templates_app.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/contact/', include('contact.urls')),
    path('api/', include('api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
