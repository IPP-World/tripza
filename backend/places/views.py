from places.verify import haversine_distance
from hotels.models import Hotel
from django.utils.text import slugify
from hotels.serializers import HotelSerializer
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
from .models import Place, Review, PlaceImage
from .serializers import PlaceSerializer, ReviewSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg


from django.core.files.uploadedfile import InMemoryUploadedFile

class PlaceListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        contributor = request.user
        request.data['contributor'] = contributor.id
        serializer = PlaceSerializer(data=request.data)
        
        if serializer.is_valid():
            images_data = request.FILES.getlist('images')
            place = serializer.save()  # Save the place object and get the instance
            
            for image_data in images_data:
                image = PlaceImage.objects.create(place=place, image=image_data)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        try:
            place = Place.objects.get(slug=slug)
            name = request.data['name']
            if place.name==name:
                pass
            else:
                base_slug = slugify(name)
                print(name)
                counter = 1
                for existing_place in Place.objects.filter(name=name):
                    print(existing_place.name)
                    base_slug = slugify(existing_place.name)
                    counter += 1

                if counter==1:
                    place.slug = base_slug
                else:
                    try:
                        place.slug = f"{base_slug}-{counter}"
                    except Exception as e:
                        try:
                            place.slug = f"{base_slug}-{counter+1}"
                        except Exception as e:
                            try:
                                place.slug = f"{base_slug}-{counter+2}"
                            except Exception as e:
                                try:
                                    place.slug = f"{base_slug}-{counter+3}"
                                except Exception as e:
                                    try:
                                        place.slug = f"{base_slug}-{counter+4}"
                                    except Exception as e:
                                        place.slug = f"{base_slug}-{counter+5}" 
                
                place.save()# Save the updated place object

        except Place.DoesNotExist:
            return Response({"error": "Place not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PlaceSerializer(place, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, slug):
        try:
            place = self.get_object(slug)
            place.delete()
            return Response({"Success": "Place successfully deleted."}, status=status.HTTP_200_OK)
        except Place.DoesNotExist:
            return Response({"error": "Place not found"}, status=status.HTTP_404_NOT_FOUND)


class NearbyHotelsView(APIView):

    def get(self, request, place_slug):

        place_slug = self.kwargs['place_slug']
        place = Place.objects.get(slug=place_slug)
        lat1=place.latitude
        lon1=place.longitude
        hotels=Hotel.objects.all()

        for hotel in hotels :
            lat2=hotel.latitude
            lon2=hotel.longitude
            distance=haversine_distance(lat1, lon1, lat2, lon2)
            print(distance)

        sorted_hotels = sorted(hotels, key=lambda hotel: haversine_distance(lat1, lon1, hotel.latitude, hotel.longitude))
        for hotel in sorted_hotels :
            lat2=hotel.latitude
            lon2=hotel.longitude
            distance=haversine_distance(lat1, lon1, lat2, lon2)
            print(distance)
        serializer=HotelSerializer(sorted_hotels, many=True)
        return Response(serializer.data)
    

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

class ContributedAPIView(APIView):
    def get(self, request):
        email = request.data.get('email')
        places = Place.objects.filter(email=email)
        serializer = PlaceSerializer(places, many=True)
        return Response(serializer.data)
    
class SearchAPIView(APIView):
    def get(self, request):
        name = request.data.get('name')
        location = request.data.get('location')
        if name:
            places = Place.objects.filter(name__iexact=name)
        else:
            location.upper()
            places = Place.objects.filter(location__iexact=location)
        serializer = PlaceSerializer(places, many=True)
        return Response(serializer.data)
