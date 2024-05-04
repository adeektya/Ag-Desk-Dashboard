from django.urls import path
from .views import UserRegistrationView, UserLoginView, UserApprovalView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('approve/<int:pk>/', UserApprovalView.as_view(), name='approve-user'),
]
