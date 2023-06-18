
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.http import Http404
from .models import Hotel, HotelReview, HotelImage, KhaltiValidation
from .serializers import HotelSerializer, HotelReviewSerializer, HotelImageSerializer, KhaltiValidationSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg
from places.verify import haversine_distance
from places.serializers import PlaceSerializer
from places.models import Place
from django.utils.text import slugify




import requests

class HotelShowAPIView(APIView):
    def get(self, request):
        hotels = Hotel.objects.all()
        serializer = HotelSerializer(hotels, many=True)
        return Response(serializer.data)
    
class NearbyPlacesView(APIView):

    def get(self, request, place_slug):

        hotel_slug = self.kwargs['hotel_slug']
        hotel = Hotel.objects.get(slug=hotel_slug)
        lat1=hotel.latitude
        lon1=hotel.longitude
        places=Place.objects.all()
        sorted_places = sorted(places, key=lambda place: haversine_distance(lat1, lon1, place.latitude, place.longitude))
        serializer=PlaceSerializer(sorted_places, many=True)
        return Response(serializer.data)
    
class TrendingPlacesView(APIView):
    def get(self, request):
        places = Place.objects.all().order_by('-rating')  # Sort by rating in descending order
        serializer = PlaceSerializer(places, many=True)
        return Response(serializer.data)
    

# from .desc import calculate_similarity
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
        try:
            hotel = Hotel.objects.get(slug=slug)
            name = request.data['name']
            if hotel.name==name:
                pass
            else:
                base_slug = slugify(name)
                print(name)
                counter = 1
                for existing_hotel in Hotel.objects.filter(name=name):
                    print(existing_hotel.name)
                    base_slug = slugify(existing_hotel.name)
                    counter += 1

                if counter==1:
                    hotel.slug = base_slug
                else:
                    try:
                        hotel.slug = f"{base_slug}-{counter}"
                    except Exception as e:
                        try:
                            hotel.slug = f"{base_slug}-{counter+1}"
                        except Exception as e:
                            try:
                                hotel.slug = f"{base_slug}-{counter+2}"
                            except Exception as e:
                                try:
                                    hotel.slug = f"{base_slug}-{counter+3}"
                                except Exception as e:
                                    try:
                                        hotel.slug = f"{base_slug}-{counter+4}"
                                    except Exception as e:
                                        hotel.slug = f"{base_slug}-{counter+5}"


                hotel.save()  # Save the updated hotel object

        except Hotel.DoesNotExist:
            return Response({"error": "Hotel not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = HotelSerializer(hotel, data=request.data, partial=True)

        if serializer.is_valid():
            images_data = request.FILES.getlist('images')
            serializer.save()
            existing_images = hotel.images.all()  # Retrieve existing images associated with the hotel
            for image in existing_images:
                image.delete()  # Delete existing images

            for image_data in images_data:
                image = HotelImage.objects.create(hotel=hotel, image=image_data)
                existing_images =HotelImage.objects.filter(id=image.id)  # Concatenate new image with existing images
            hotel.images.set(existing_images)

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, slug):
        try:
            hotel = self.get_object(slug)
            hotel.delete()
            return Response({"Success": "Hotel successfully deleted."}, status=status.HTTP_200_OK)
        except Hotel.DoesNotExist:
            return Response({"error": "Hotel not found"}, status=status.HTTP_404_NOT_FOUND)

    
    

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


# class KhaltiValidationView(APIView):
#     permission_classes=[IsAuthenticated]
#     def post(self, request):
        
#         data = {
#             'amount': int(request.data['amount']),
#             'token': request.data['token']
#         }
#         print(data)


#         headers = {
#             'Authorization': 'Key test_secret_key_9125092c5640491aabc8d2b5b2a71ef5',
#             "Content-Type": "application/json",
#         }

#         response = requests.post('https://khalti.com/api/v2/payment/verify/', json=data, headers=headers)
#         print(response.status_code, response)
#         if response.status_code == 200:
            
#             # Save data in model
#             serializer = KhaltiValidationSerializer(data=request.data)
#             if serializer.is_valid():
#                 instance = serializer.save()
#                 serialized_data = KhaltiValidationSerializer(instance).data
#                 return Response(serialized_data, status=status.HTTP_201_CREATED)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#             # return Response('success', status=status.HTTP_200_OK)
#         else:
#             return Response('error', status=status.HTTP_402_PAYMENT_REQUIRED)
#         # https://khalti.com/api/v2/payment/verify/ POST data = {amount, token}

#         # success -> 
#         # failed -> return Response(error, status = 400)

#     def get(self, request):
#         validations = KhaltiValidation.objects.all()
#         serializer = KhaltiValidationSerializer(validations, many=True)
#         return JsonResponse(serializer.data, safe=False)
    
class KhaltiValidationView(APIView):
    def post(self, request):
        serializer = KhaltiValidationSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            serialized_data = KhaltiValidationSerializer(instance).data
            return Response(serialized_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        validations = KhaltiValidation.objects.all()
        serializer = KhaltiValidationSerializer(validations, many=True)
        return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def get_validation_data(request):
    validations = KhaltiValidation.objects.all()
    serializer = KhaltiValidationSerializer(validations, many=True)
    return JsonResponse(serializer.data, safe=False)

# class SearchAPIView(generics.ListAPIView):
#     serializer_class = HotelSerializer

#     def get(self, request):
#         hotels = Hotel.objects.all()
#         name = self.request.data('name')
#         location = self.request.data('location')
#         searched_hotel=[]
#         if name:
#             for hotel in hotels:
#                 hotel=hotels.filter(name = hotel.name)
#                 searched_hotel.append(hotel)

#         if location:
#             for hotel in hotels:
#                 hotel=hotels.filter(location = hotel.location)
#                 searched_hotel.append(hotel)
#         print(searched_hotel)
#         serializer=HotelSerializer(searched_hotel, many=True)
#         return Response(serializer.data)

from rest_framework import generics
from .models import Hotel
from .serializers import HotelSerializer
class SearchAPIView(APIView):
    def get(self, request):
        name = request.data.get('name')
        location = request.data.get('location')
        category = request.data.get('category')
        if name:
            hotels = Hotel.objects.filter(name__iexact=name)
        elif location:
            location.upper()
            hotels = Hotel.objects.filter(location__iexact=location)
        else:
            category.upper()
            hotels = Hotel.objects.filter(category__iexact=category)
        serializer = HotelSerializer(hotels, many=True)
        return Response(serializer.data)

from accounts.models import User
from accounts.serializers import *

class Subscription(APIView):
    def post(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()  # Use .first() to get a single instance
        if user:
            user.is_subscribed = user.is_subscribed + 1
            print(user.is_subscribed)
            user.save()
            serializer = UserDetailSerializer(user)
            return Response(serializer.data)
        return Response({'error': 'User not found'}, status=404)
    
class ContributedAPIView(APIView):
    def get(self, request):
        user_id=request.user.id
        print(user_id)
        hotels = Hotel.objects.filter(owner=user_id)
        serializer = HotelSerializer(hotels, many=True)
        return Response(serializer.data)
