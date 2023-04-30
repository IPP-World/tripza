from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.response import Response
from rest_framework import generics, status
from django.views.decorators.csrf import csrf_exempt  
import jwt 
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.conf import settings
from .serializer import RegisterViewSerializer, LoginViewSerializer, LogoutViewSerializer, EmailVerificationSerializer, ForgotPasswordSerializer
from .models import User
from .utils import Util
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse

class RegisterView(generics.GenericAPIView):

    serializer_class = RegisterViewSerializer
    # renderer_classes = (UserRenderer,)

    @csrf_exempt
    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data

        user=User.objects.get(email=user_data['email'])
        token=RefreshToken.for_user(user).access_token
        current_site=get_current_site(request).domain
        relativeLink=reverse('email_verify')
        absurl='http://' + current_site + relativeLink + "?token="+ str(token)
        email_body='Hi ' + user.first_name + ' Use the link below to verify your account \n' + absurl
        data={'email_body':email_body,'to_email': user.email, 'email_subject': 'Verify your email !!'}
        Util.send_email(data)

        return Response(user_data, status=status.HTTP_201_CREATED)
    
    
class VerifyEmail(generics.GenericAPIView):
    serializer_class= EmailVerificationSerializer
    token_param_config = openapi.Parameter(
        'token', in_=openapi.IN_QUERY, description='Description', type=openapi.TYPE_STRING)

    @swagger_auto_schema(manual_parameters=[token_param_config])
    def get(self, request):
        token=request.GET.get('token')
        try:
            payload=jwt.decode(token, settings.SECRET_KEY)
            user=User.objects.get(id=payload['user_id'])
            if not user.is_verified:
                user.is_verified=True
                user.save()
            return Response({'email': 'Successfully Verified'}, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError as identifier:
            return Response({'error': 'Activation expired'}, status=status.HTTP_400_BAD_REQUEST)
            
        except jwt.exceptions.DecodeError as identifier:
            return Response({'error': 'Invalid Link'}, status=status.HTTP_400_BAD_REQUEST)
            
    
class LoginView(generics.GenericAPIView):
    serializer_class = LoginViewSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
 
 

class LogoutView(APIView):
    # permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        

class ForgotPasswordView(APIView):
    serializer_class= ForgotPasswordSerializer
    token_param_config = openapi.Parameter('token', in_=openapi.IN_QUERY, description='Description', type=openapi.TYPE_STRING)

    @swagger_auto_schema(manual_parameters=[token_param_config])
    def get(self, request):
        token=request.GET.get('token')
        email=request.GET.get('email')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'success': False, 'message': 'User with this email does not exist.'})

        current_site=get_current_site(request).domain
        relativeLink=reverse('Reset Password')
        absurl='http://' + current_site + relativeLink + "?token="+ str(token)
        email_body='Hi ' + user.first_name + ' Use the link below to reset password \n' + absurl
        data={'email_body':email_body,'to_email': user.email, 'email_subject': 'Verify your email !!'}
        Util.send_email(data)
        
        return Response({'success': True, 'message': 'Password reset email has been sent.'})
        
        

