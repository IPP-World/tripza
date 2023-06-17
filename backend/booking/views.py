from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Booking
from .serializers import BookingSerializer
from hotels.serializers import HotelSerializer
from hotels.models import Hotel
from rest_framework.permissions import IsAuthenticated

class BookingListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        bookings = Booking.objects.all()
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    
class BookingListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BookingSerializer

    # def get_queryset(self):
    #     hotel_slug = self.kwargs['hotel_slug']
    #     hotel = Hotel.objects.get(slug=hotel_slug)
    #     queryset = Booking.objects.filter(hotel=hotel)
    #     return queryset

    def get(self, request):
        bookings = Booking.objects.all()
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    
    def post(self, request, hotel_slug):
        data = request.data.copy()
        data['user'] = request.user.id
        data['hotel'] = Hotel.objects.get(slug=hotel_slug).id
        hotel=Hotel.objects.get(slug=hotel_slug)
        email=request.user.email
        print(hotel, email)

        serializer = BookingSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def post(self, request):
    #     serializer = BookingSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from accounts.models import User
class UserBookingsApiView(APIView):
    def get(self, request):
        user_id=request.user.id
        bookings=Booking.objects.filter(user_id=user_id)
        serializer=BookingSerializer(bookings, many=True)
        return Response(serializer.data)