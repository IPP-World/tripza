from django.core.mail import EmailMessage
import os
from jwt.exceptions import ExpiredSignatureError
from jwt import decode as jwt_decode
from rest_framework.response import Response
from rest_framework import generics, status

class Util:
  @staticmethod
  def send_email(data):
    email = EmailMessage(
      subject=data['email_subject'],
      body=data['email_body'],
      from_email=os.environ.get('EMAIL_FROM'),
      to=[data['to_email']]
    )
    email.send()

from jwt.exceptions import ExpiredSignatureError
from jwt import decode as jwt_decode

def jwt_decode_handler(token):
    # Add your own implementation of token decoding based on the JWT library you are using
    # Here's an example using the `jwt` library
    # Replace 'your_secret_key' with your actual secret key used for JWT encoding/decoding
    try:
        decoded_token = jwt_decode(token, 'your_secret_key', algorithms=['HS256'])
        return decoded_token
    except Exception as e:
        # Handle any specific exceptions that may occur during token decoding
        # You can raise custom exceptions or return appropriate responses based on your requirements
        raise e

def jwt_expired_handler():
    # Handle the case when the JWT token has expired
    # You can return a custom response or raise an appropriate exception based on your requirements
    return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
