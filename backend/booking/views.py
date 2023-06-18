from accounts.models import User
from accounts.utils import Util
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Booking
from .serializers import BookingSerializer
from hotels.serializers import HotelSerializer
from hotels.models import Hotel
from rest_framework.permissions import IsAuthenticated
from .sms_api import send_sms_via_api

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

    def get(self, request, hotel_slug):
        hotel = Hotel.objects.filter(slug=hotel_slug).first()  # Retrieve the hotel with the given slug
        if not hotel:
            return Response({"message": "Hotel not found"}, status=status.HTTP_404_NOT_FOUND)
        
        bookings = Booking.objects.filter(hotel=hotel)  # Retrieve all bookings related to the hotel
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

    
    def post(self, request, hotel_slug):
        data = request.data.copy()
        data['user'] = request.user.id
        data['hotel'] = Hotel.objects.get(slug=hotel_slug).id

        #hotel owner number
        hotel=Hotel.objects.get(slug=hotel_slug)
        hotel_name=hotel.name
        # print(hotel_name)
        user=User.objects.get(email=hotel.owner)
        # print(user.number)
        # print(user.email)
        to=user.number
        owner_email=user.email



        #booker detail
        booker_email=request.user.email
        booker_fname=request.user.fname
        booker_lname=request.user.lname
        booker_number= request.user.number
        booker_name= f"{booker_fname} {booker_lname}"
        # print(booker_name, booker_email)

        owner_data={'email_body':f"You have received a booking in {hotel_name} from {booker_name}. \n Please respond to the booking as soon as possible",'to_email': owner_email, 'email_subject': "Booking received..."}
        Util.send_email(owner_data)
        message= f"You have received a booking in {hotel_name} from {booker_name}.\nContact.no: {booker_number}.\nConfirm via call or tripza.\nThank you"
        send_sms_via_api(to=to, text=message)

        booker_data={'email_body':f"You have a pending booking for {hotel_name}. \n We will update you soon with the response from hotel owner.", 'to_email': booker_email, 'email_subject': "Booking made..."}
        Util.send_email(booker_data)

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

class UserBookingsApiView(APIView):
    def get(self, request):
        user_id=request.user.id
        bookings=Booking.objects.filter(user_id=user_id)
        serializer=BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    
class BookingResponseApiView(APIView):
    def put(self, request, id):
        try:
            booking=Booking.objects.get(id=id)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = BookingSerializer(booking, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            status=booking.status
            hotel_name=booking.h_name
            book_id=booking.id
            user=User.objects.get(email=booking.user)
            booker_name= user.fname + " " + user.lname
            booker_email=user
            # booker_name=booking.h_name
            # booker_email=booking.h_name
            check_in=booking.check_in_date
            check_out=booking.check_out_date
            status=booking.h_name
            if status=="reject":
                subject="Booking rejected..."
                mail=f"Your booking for {hotel_name} has been rejected.\nWe are really sorry for the inconvenience.\n\tTHANK YOU"
            else:
                subject="Booking approved..."
                mail=f"Your booking for {hotel_name} has been approved.\n\n Booking Detail:\n -> Booking ID: {book_id}\n -> Name: {booker_name}\n -> Check in Date: {check_in}\n -> Check out Date: {check_out}\n -> Booking Status: {status}\n\n THANK YOU"

            booker_data={'email_body':mail, 'to_email': booker_email, 'email_subject': subject}
            Util.send_email(booker_data)

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    

