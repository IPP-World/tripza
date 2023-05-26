from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'user', 'hotel','h_name', 'check_in_date', 'check_out_date', 'guest_no', 'room_no']

    def create(self, validated_data):
        booking = Booking.objects.create(**validated_data)
        return booking
