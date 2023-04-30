from django.db import models
# from django_countries.fields import CountryField
# from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if username is None:
            raise TypeError('User should have username')
        if email is None:
            raise TypeError('User should have email.')
        
        user=self.model(username=username, email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        try:
            user.save(using=self._db)
        except:
            pass
        return user

    def create_superuser(self, username, email, password):
        if password is None:
            raise TypeError('Password should not be none.')

        return self.create_user(username, email, password, is_superuser=True, is_staff=True)


class User(AbstractBaseUser, PermissionsMixin):
    first_name=models.CharField(max_length=255)
    last_name=models.CharField(max_length=255)
    username=models.CharField(max_length=255, unique=True, db_index=True)
    email=models.EmailField(max_length=255, unique=True, db_index=True)



    is_verified=models.BooleanField(default=False)
    is_active=models.BooleanField(default=True)
    is_staff=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)    

    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['username']

    objects=UserManager()

    def __str__(self):
        return self.email
    
    
    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }
