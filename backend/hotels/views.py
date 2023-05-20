
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.shortcuts import get_object_or_404
from django.http import Http404
from .models import Hotel, HotelReview, HotelImage, KhaltiValidation
from .serializers import HotelSerializer, HotelReviewSerializer, HotelImageSerializer, KhaltiValidationSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg

import requests

class HotelShowAPIView(APIView):
    def get(self, request):
        hotels = Hotel.objects.all()
        serializer = HotelSerializer(hotels, many=True)
        return Response(serializer.data)
    

class HotelListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        owner = request.user  # Get the authenticated user
        request.data['owner'] = owner.id  # Assign the user's ID as the owner
        # request.data['owner_name'] = f"{owner.fname} {owner.lname}"  # Assign the user's name separately
        serializer = HotelSerializer(data=request.data)
        
        if serializer.is_valid():
            images_data = request.FILES.getlist('images')
            hotel = serializer.save() 
            
            for image_data in images_data:
                image = HotelImage.objects.create(hotel=hotel, image=image_data)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


        
class HotelDetailAPIView(APIView):
    # permission_classes = [IsAuthenticated]
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


class KhaltiValidationView(APIView):
    # permission_classes=[IsAuthenticated]
    def post(self, request):
        
        print(request.data)
        data = {
            'amount': int(request.data['amount']),
            'token': request.data['token']
        }
        print(data)
        # email=request.user.email
        # print(email)

        headers = {
            'Authorization': 'Key test_secret_key_9125092c5640491aabc8d2b5b2a71ef5',
            "Content-Type": "application/json",
        }

        response = requests.post('https://khalti.com/api/v2/payment/verify/', json=data, headers=headers)
        print(response.status_code, response)
        if response.status_code == 200:
            
            # Save data in model
            serializer = KhaltiValidationSerializer(data=request.data)
            if serializer.is_valid():
                instance = serializer.save()
                serialized_data = KhaltiValidationSerializer(instance).data
                return Response(serialized_data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            # return Response('success', status=status.HTTP_200_OK)
        else:
            return Response('error', status=status.HTTP_402_PAYMENT_REQUIRED)
        # https://khalti.com/api/v2/payment/verify/ POST data = {amount, token}
        # success -> 
        # failed -> return Response(error, status = 400)

    def get(self, request):
        validations = KhaltiValidation.objects.all()
        serializer = KhaltiValidationSerializer(validations, many=True)
        return JsonResponse(serializer.data, safe=False)
    

from django.http import JsonResponse
from rest_framework.decorators import api_view
@api_view(['GET'])
def get_validation_data(request):
    validations = KhaltiValidation.objects.all()
    serializer = KhaltiValidationSerializer(validations, many=True)
    return JsonResponse(serializer.data, safe=False)
