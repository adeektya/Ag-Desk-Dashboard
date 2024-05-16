from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from user_profile.views import UserProfileListCreate, UserProfileRetrieveUpdate

urlpatterns = [
    path('', UserProfileListCreate.as_view(), name='userprofile-list-create'),
    path('<int:pk>/', UserProfileRetrieveUpdate.as_view(), name='userprofile-retrieve-update'),
]


if settings.DEBUG:  # Only serve media files through Django in development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

