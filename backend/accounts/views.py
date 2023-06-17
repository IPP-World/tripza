from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import EmailVerificationSerializer
from .models import User
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.views import APIView
from accounts.serializers import UserRegistrationSerializer, EmailVerificationSerializer, LoginViewSerializer, UserDetailSerializer, SendPasswordResetEmailSerializer, UserPasswordResetSerializer, UserChangePasswordSerializer
from django.contrib.auth import authenticate
from accounts.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt  
import jwt 
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import User
from .utils import Util
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings

  
class RegisterView(generics.GenericAPIView):

    serializer_class = UserRegistrationSerializer
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
        email_body='Hi ' + user.fname + ' Use the link below to verify your account \n' + absurl
        subject="Verify Account !!"
        data={'email_body':email_body,'to_email': user.email, 'email_subject': subject}
        Util.send_email(data)

        return Response(user_data, status=status.HTTP_201_CREATED)
    
class EditProfile(generics.GenericAPIView):
    serializer_class= UserDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        user = request.user
        allowed_fields = ['photo', 'fname', 'lname', 'dob', 'number']  # Add the fields that users are allowed to edit

        data = {}
        for field in allowed_fields:
            if field in request.data:
                data[field] = request.data[field]

        serializer = UserDetailSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class VerifyEmail(generics.GenericAPIView):
    serializer_class = EmailVerificationSerializer

    def get(self, request):
        token = request.GET.get('token')
        try:
            user_id = self.validate_token(token)
            user = get_object_or_404(User, id=user_id)
            if not user.is_verified:
                user.is_verified = True
                user.save()
            return Response({'email': 'Successfully Verified'}, status=status.HTTP_200_OK)
        except TokenValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def validate_token(self, token):
      skey= 'django-insecure-e5gd$ncv8hn-b+y-vw^5(b*0fx_pbg1n^sm4352c)n-*llg_y='
      try:
          decoded_token = jwt.decode(token, skey, algorithms=['HS256'])
          user_id = decoded_token.get('user_id')
          if not user_id:
              raise TokenValidationError('Invalid token')
          return user_id
      except jwt.ExpiredSignatureError:
          raise TokenValidationError('Token has expired')
      except jwt.InvalidTokenError:
          raise TokenValidationError('Invalid token')

class TokenValidationError(Exception):
    pass

    
class LoginView(generics.GenericAPIView):
    serializer_class = LoginViewSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserDetail(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def get(self, request, format=None):
    serializer = UserDetailSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)
 
class UserChangePasswordView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def post(self, request, format=None):
    serializer = UserChangePasswordSerializer(data=request.data, context={'user':request.user})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Changed Successfully'}, status=status.HTTP_200_OK)

class SendPasswordResetEmailView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = SendPasswordResetEmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)

class UserPasswordResetView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, uid, token, format=None):
    serializer = UserPasswordResetSerializer(data=request.data, context={'uid':uid, 'token':token})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset Successfully'}, status=status.HTTP_200_OK)
