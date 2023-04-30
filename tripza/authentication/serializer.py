from rest_framework import serializers
from .models import User
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
    
class RegisterViewSerializer(serializers.ModelSerializer):
    password=serializers.CharField(max_length=68, min_length=8, write_only=True)

    class Meta:
        model=User
        fields=['first_name', 'last_name', 'username', 'email', 'password']

    def validate(self, attrs):
        email=attrs.get('email', '')
        username=attrs.get('username', '')

        if not username.isalnum():
            raise serializers.ValidationError('Username should only contain alphanumeric characters.')
        return attrs
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    


class EmailVerificationSerializer(serializers.ModelSerializer):
    token=serializers.CharField(max_length=255)

    class Meta:
        model=User
        fields=['token']


        

class LoginViewSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255, min_length=3)
    password = serializers.CharField(
        max_length=68, min_length=6, write_only=True)
    username = serializers.CharField(
        max_length=255, min_length=3, read_only=True)
    first_name=serializers.CharField(max_length=255, read_only=True)
    last_name=serializers.CharField(max_length=255, read_only=True)
    tokens = serializers.SerializerMethodField(read_only=True)

    def get_tokens(self, obj):
        user = User.objects.get(email=obj['email'])

        return {
            'refresh': user.tokens()['refresh'],
            'access': user.tokens()['access']
        }

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username','email', 'password', 'tokens']

    def validate(self, attrs):
        email = attrs.get('email', '')
        password = attrs.get('password', '')
        filtered_user_by_email = User.objects.filter(email=email)
        user = auth.authenticate(email=email, password=password)
        first_name = attrs.get('first_name', '')
        last_name = attrs.get('last_name', '')

        if not user:
            raise AuthenticationFailed('Invalid credentials, try again')
        
        if not user.is_active:
            raise AuthenticationFailed('Account disabled, contact admin')
        
        if not user.is_verified:
            raise AuthenticationFailed('Email is not verified')

        return {
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'username': user.username,
            'tokens': user.tokens
        }

from rest_framework_jwt.settings import api_settings

class LogoutViewSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()

    def validate(self, attrs):
        refresh_token = attrs.get('refresh_token')
        jwt_decode_handler = api_settings.JWT_DECODE_HANDLER

        try:
            # decode the refresh token to get the user id
            payload = jwt_decode_handler(refresh_token)
            user_id = payload.get('user_id')
        except:
            raise serializers.ValidationError('Invalid token')

        attrs['user_id'] = user_id
        return attrs