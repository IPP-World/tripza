from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser
from rest_framework_simplejwt.tokens import RefreshToken


class UserManager(BaseUserManager):
  def create_user(self, email, fname, lname, number, dob, password=None, password2=None):
      if not email:
          raise ValueError('User must have an email address')

      user = self.model(
          email=self.normalize_email(email),
          fname=fname,
          lname=lname,
          number=number,
          dob=dob,
      )

      user.set_password(password)
      user.save(using=self._db)
      return user

  def create_superuser(self, email, fname, lname, number, dob, password=None):
      user = self.create_user(
          email,
          password=password,
          fname=fname,
          lname=lname,
          number=number,
          dob=dob
      )
      user.is_admin = True
      user.save(using=self._db)
      return user

class User(AbstractBaseUser):
    email=models.EmailField(max_length=255, unique=True)
    fname=models.CharField(max_length=255)
    lname=models.CharField(max_length=255)
    number=models.CharField(max_length=20)
    dob=models.DateField()
    photo = models.ImageField(upload_to='photos', null=True, blank=True, verbose_name="photoo")
    is_verified=models.BooleanField(default=False)
    is_subscribed=models.BooleanField(default=False)
    
    is_subscribed=models.BooleanField(default=False)
    
    is_active=models.BooleanField(default=True)
    is_staff=models.BooleanField(default=False)

    objects=UserManager()

    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['fname', 'lname', 'number', 'dob']

    def __str__(self):
        return self.email
    
    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }
