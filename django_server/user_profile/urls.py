from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import UserProfileDetail

urlpatterns = [
    path('', UserProfileDetail.as_view(), name='userprofile-detail'),
]



if settings.DEBUG:  # Only serve media files through Django in development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

