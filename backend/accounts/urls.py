from django.urls import path
from accounts.views import RegisterView,EditProfile, VerifyEmail, LoginView, UserDetail, UserChangePasswordView, UserPasswordResetView, SendPasswordResetEmailView
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('edit-profile/', EditProfile.as_view(), name='edit-profile'),
    path('email-verify/', VerifyEmail.as_view(), name='email_verify'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserDetail.as_view(), name='profile'),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),
]
