from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.shortcuts import get_object_or_404
from django.http import Http404
from .models import Place, Review
from .serializers import PlaceSerializer, ReviewSerializer
from rest_framework.permissions import IsAuthenticated

class PlaceListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        places = Place.objects.all()
        serializer = PlaceSerializer(places, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        contributor = request.user  # Get the authenticated user
        request.data['contributor'] = contributor.id  # Assign the user's ID as the contributor
        # request.data['contributor_name'] = f"{contributor.fname} {contributor.lname}"  # Assign the user's name separately
        serializer = PlaceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PlaceDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
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
        return Response(status=status.HTTP_204_NO_CONTENT)
    

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
        serializer.save(place=place, reviewer=self.request.user)