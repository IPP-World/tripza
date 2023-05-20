from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.shortcuts import get_object_or_404
from django.http import Http404
from .models import Place, Review
from .serializers import PlaceSerializer, ReviewSerializer
from rest_framework import status, generics
from django.shortcuts import get_object_or_404
from django.http import Http404
from .models import Place, Review
from .serializers import PlaceSerializer, ReviewSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg

class PlaceListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        contributor = request.user  # Get the authenticated user
        request.data['contributor'] = contributor.id  # Assign the user's ID as the contributor
        # request.data['contributor_name'] = f"{contributor.fname} {contributor.lname}"  # Assign the user's name separately
        # request.data['images'] ma image axa tara database ma save vaxaina hola
        # Image data lai database ma kasari rakhne ho google and findout
        serializer = PlaceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        # def post(self, request):
        # user = request.data
        # serializer = self.serializer_class(data=user)
        # serializer.is_valid(raise_exception=True)
        # serializer.save()
        # user_data = serializer.data

        # user=User.objects.get(email=user_data['email'])
        # token=RefreshToken.for_user(user).access_token
        # current_site=get_current_site(request).domain
        # relativeLink=reverse('email_verify')
        # absurl='http://' + current_site + relativeLink + "?token="+ str(token)
        # email_body='Hi ' + user.fname + ' Use the link below to verify your account \n' + absurl
        # subject="Verify Account !!"
        # data={'email_body':email_body,'to_email': user.email, 'email_subject': subject}
        # Util.send_email(data)

class PlaceShowAPIView(APIView):
    def get(self, request):
        places = Place.objects.all()
        serializer = PlaceSerializer(places, many=True)
        return Response(serializer.data)
class PlaceDetailAPIView(APIView):
    # permission_classes = [IsAuthenticated]
    def get_object(self, slug):
        try:
            return Place.objects.get(slug=slug)
        except Place.DoesNotExist:
            raise Http404
        
    def get(self, request, slug):
        place = self.get_object(slug)
        serializer = PlaceSerializer(place)
        return Response(serializer.data)
    
    def put(self, request, slug):
        contributor = request.user  # Get the authenticated user
        request.data['contributor'] = contributor.id
        place = self.get_object(slug)
        serializer = PlaceSerializer(place, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, slug):
        place = self.get_object(slug)
        place.delete()
    

class ReviewListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        place_slug = self.kwargs['place_slug']
        place = Place.objects.get(slug=place_slug)
        queryset = Review.objects.filter(place=place)
        return queryset

    def perform_create(self, serializer):
        place_slug = self.kwargs['place_slug']
        place = Place.objects.get(slug=place_slug)
        reviewer = self.request.user
        rating = serializer.validated_data['rating']

        # Calculate the average rating including the new rating
        average_rating = Review.objects.filter(place=place).aggregate(avg_rating=Avg('rating'))['avg_rating']
        if average_rating is not None:
            new_rating_count = Review.objects.filter(place=place).count() + 1
            average_rating = (average_rating * (new_rating_count - 1) + rating) / new_rating_count
        else:
            average_rating = rating

        place.rating = round(average_rating, 2)
        place.save()
        serializer.save(place=place, reviewer=reviewer)
