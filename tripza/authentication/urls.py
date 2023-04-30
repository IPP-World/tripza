from django.urls import path
from .views import *

urlpatterns=[
    path('register/', RegisterView.as_view(), name='Register'),
    path('email-verify/', VerifyEmail.as_view(), name='email_verify'),
    path('login/', LoginView.as_view(), name='Login'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    # path('logout/', LogoutView.as_view(), name='Logout'),
    # path('email-verify/', VerifyEmail.as_view(), name="email-verify"),
]