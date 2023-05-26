from rest_framework import serializers
from accounts.models import User
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from accounts.utils import Util
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed

class UserRegistrationSerializer(serializers.ModelSerializer):
  password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
  class Meta:
    model = User
    fields=['email', 'fname', 'lname', 'number', 'dob', 'password', 'password2']
    extra_kwargs={
      'password':{'write_only':True}
    }

  # Validating Password and Confirm Password while Registration
  def validate(self, attrs):
    password = attrs.get('password')
    password2 = attrs.get('password2')
    if password != password2:
      raise serializers.ValidationError("Password and Confirm Password doesn't match")
    return attrs

  def create(self, validate_data):
    return User.objects.create_user(**validate_data)
  

class EmailVerificationSerializer(serializers.ModelSerializer):
    token=serializers.CharField(max_length=255)

    class Meta:
        model=User
        fields=['token']

class LoginViewSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255, min_length=3)
    fname=serializers.CharField(max_length=255, read_only=True)
    lname=serializers.CharField(max_length=255, read_only=True)
    number=serializers.CharField(max_length=20, read_only=True)
    dob=serializers.DateField(read_only=True)
    photo = serializers.ImageField(required=False, allow_null=True)
    password = serializers.CharField(
        max_length=68, min_length=6, write_only=True)
    tokens = serializers.SerializerMethodField(read_only=True)

    def get_tokens(self, obj):
        user = User.objects.get(email=obj['email'])

        return {
            'refresh': user.tokens()['refresh'],
            'access': user.tokens()['access']
        }

    class Meta:
        model = User
        fields = ['email', 'fname', 'lname','number', 'dob', 'photo', 'password', 'tokens']

    def validate(self, attrs):
        email = attrs.get('email', '')
        password = attrs.get('password', '')
        filtered_user_by_email = User.objects.filter(email=email)
        user = auth.authenticate(email=email, password=password)


        if not user:
            raise AuthenticationFailed('Invalid credentials, try again')
        
        if not user.is_active:
            raise AuthenticationFailed('Account disabled, contact admin')
        
        if not user.is_verified:
            raise AuthenticationFailed('Email is not verified')

        return {
            'email': user.email,
            'fname': user.fname,
            'lname': user.lname,
            'number': user.number,
            'dob':user.dob,
            'tokens': user.tokens
        }
    
class UserDetailSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['email', 'fname', 'lname', 'number', 'dob', 'is_subscribed']


class UserChangePasswordSerializer(serializers.Serializer):
  password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  class Meta:
    fields = ['password', 'password2']

  def validate(self, attrs):
    password = attrs.get('password')
    password2 = attrs.get('password2')
    user = self.context.get('user')
    if password != password2:
      raise serializers.ValidationError("Password and Confirm Password doesn't match")
    user.set_password(password)
    user.save()
    return attrs

class SendPasswordResetEmailSerializer(serializers.Serializer):
  email = serializers.EmailField(max_length=255)
  class Meta:
    fields = ['email']

  def validate(self, attrs):
    email = attrs.get('email')
    if User.objects.filter(email=email).exists():
      user = User.objects.get(email = email)
      uid = urlsafe_base64_encode(force_bytes(user.id))
      token = PasswordResetTokenGenerator().make_token(user)
      link = 'http://localhost:5173/api/user/reset/'+uid+'/'+token
      # Send EMail
      body = 'Click Following Link to Reset Your Password '+link
      data = {
        'email_subject':'Reset Your Password',
        'email_body':body,
        'to_email':user.email
      }
      Util.send_email(data)
      return attrs
    else:
      raise serializers.ValidationError('You are not a Registered User')
    
from django.shortcuts import get_object_or_404
import jwt
class UserPasswordResetSerializer(serializers.Serializer):
  password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  class Meta:
    fields = ['password', 'password2']

    def validate(self, attrs):
        try:
            token = attrs.get('token')
            user_id = self.validate_token(token)
            user = get_object_or_404(User, id=user_id)
            email=attrs.get('password')
            password = attrs.get('password')
            password2 = attrs.get('password2')
            uid = self.context.get('uid')
            token = self.context.get('token')
            if password != password2:
                raise serializers.ValidationError("Password and Confirm Password doesn't match")
            id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(token=token)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError('Token is not Valid or Expired')
            user.set_password(password)
            user.save()
            return attrs
        except DjangoUnicodeDecodeError as identifier:
            PasswordResetTokenGenerator().check_token(user, token)
            raise serializers.ValidationError('Token is not Valid or Expired')
    
    def validate_token(self, token):
        skey= 'django-insecure-e5gd$ncv8hn-b+y-vw^5(b*0fx_pbg1n^sm4352c)n-*llg_y='
        try:
            decoded_token = jwt.decode(token, skey, algorithms=['HS256'])
            user_id = decoded_token.get('user_id')
            return user_id
        except :
           pass

    class TokenValidationError(Exception):
        pass