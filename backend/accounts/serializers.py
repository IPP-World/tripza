from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class meta(UserCreateSerializer.Meta):
        model=User
        fields=('id', 'email', 'fname', 'lname', 'number', 'dob', 'password')

