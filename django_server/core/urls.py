from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    EmployeeApprovalView,
    UnapprovedUsersView,
    GenerateInvitationCodeView,
    UserDetailView,
)

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="register"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("approve/<int:pk>/", EmployeeApprovalView.as_view(), name="approve-employee"),
    path("unapproved/", UnapprovedUsersView.as_view(), name="unapproved-users"),
    path(
        "generate-code/",
        GenerateInvitationCodeView.as_view(),
        name="generate-invitation-code",
    ),
    path("user-detail/", UserDetailView.as_view(), name="user-detail"),
]
