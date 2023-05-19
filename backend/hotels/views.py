from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.shortcuts import get_object_or_404
from django.http import Http404
from .models import Hotel, HotelReview, HotelImage
from .serializers import HotelSerializer, HotelReviewSerializer, HotelImageSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg

class HotelListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        hotels = Hotel.objects.all()
        serializer = HotelSerializer(hotels, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        owner = request.user  # Get the authenticated user
        request.data['owner'] = owner.id  # Assign the user's ID as the owner
        # request.data['owner_name'] = f"{owner.fname} {owner.lname}"  # Assign the user's name separately
        serializer = HotelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HotelDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get_object(self, slug):
        try:
            return Hotel.objects.get(slug=slug)
        except Hotel.DoesNotExist:
            raise Http404
    
    def get(self, request, slug):
        hotel = self.get_object(slug)
        serializer = HotelSerializer(hotel)
        return Response(serializer.data)
    
    def put(self, request, slug):
        owner = request.user  # Get the authenticated user
        request.data['owner'] = owner.id
        hotel = self.get_object(slug)
        serializer = HotelSerializer(hotel, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, slug):
        hotel = self.get_object(slug)
        hotel.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class ReviewListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = HotelReviewSerializer

    def get_queryset(self):
        hotel_slug = self.kwargs['hotel_slug']
        hotel = Hotel.objects.get(slug=hotel_slug)
        queryset = HotelReview.objects.filter(hotel=hotel)
        return queryset

    def perform_create(self, serializer):
        hotel_slug = self.kwargs['hotel_slug']
        hotel = Hotel.objects.get(slug=hotel_slug)
        reviewer = self.request.user
        rating = serializer.validated_data['rating']

        # Calculate the average rating including the new rating
        average_rating = HotelReview.objects.filter(hotel=hotel).aggregate(avg_rating=Avg('rating'))['avg_rating']
        if average_rating is not None:
            new_rating_count = HotelReview.objects.filter(hotel=hotel).count() + 1
            average_rating = (average_rating * (new_rating_count - 1) + rating) / new_rating_count
        else:
            average_rating = rating

        hotel.rating = round(average_rating, 2)
        hotel.save()
        serializer.save(hotel=hotel, reviewer=reviewer)