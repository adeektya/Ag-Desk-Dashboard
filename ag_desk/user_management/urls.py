from django.urls import path
from .views import UserRegistrationView, UserLoginView, UserView, EmployeeRegistrationView, EmployeeApprovalView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user_registration'),
    path('login/', UserLoginView.as_view(), name='user_login'),
    path('user/', UserView.as_view(), name='user'),
    path('employee-register/', EmployeeRegistrationView.as_view(), name='employee_registration'),
    path('employee-approve/<int:pk>/', EmployeeApprovalView.as_view(), name='employee_approval'),
]