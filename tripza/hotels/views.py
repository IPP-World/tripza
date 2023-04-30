from django.shortcuts import render
from rest_framework.response import Response
from hotels.models import Hotels, HotelImage
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .serializers import *
from rest_framework import status
from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .serializers import *
from .models import *
from rest_framework import permissions
from .permissions import IsOwner

# Create your views here.
class HotelListAPIView(ListCreateAPIView):
    serializer_class = HotelsSerializer
    queryset = Hotels.objects.all()
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        return serializer.save(owner=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)


class HotelDetailAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = HotelsSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner,)
    queryset = Hotels.objects.all()
    lookup_field = "id"

    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)


# @api_view(['GET', 'POST'])
# def hotel_list(request):
#     if request.method=='GET':
#         hotels=Hotels.objects.all()
#         images=HotelImage.objects.all()
#         hotelsserializer=HotelsSerializer(hotels, many=True)
#         imageserializer=HotelImageSerializer(images, many=True)
#         return Response(hotelsserializer.data)
    
#     if request.method=='POST':
#         serializer=HotelsSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         else:
#             return Response(serializer.errors)

# @api_view(['GET', 'PUT', 'DELETE'])
# def detail(request, pk):
#     if request.method=='GET':        
#         hotel=Hotels.objects.get(pk=pk)
#         serializer=HotelsSerializer(hotel)
#         return Response(serializer.data)
    
#     if request.method=='PUT':
#         hotel=Hotels.objects.get(pk=pk)
#         serializer=HotelsSerializer(hotel, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)

#         else:
#             return Response(serializer.errors)

#     if request.method=='DELETE':
#         hotel=Hotels.objects.get(pk=pk)
#         hotels={}
#         # information=hotel.name + ' is deleted'
#         hotel.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
#         # return render(request, 'userhome.html', hotels, status=405)



