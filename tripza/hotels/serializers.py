from rest_framework import serializers
from .models import Hotels, HotelImage

class HotelImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelImage
        fields = ('image',)

class HotelsSerializer(serializers.ModelSerializer):
    # hotels_image = HotelImageSerializer(many=True, read_only=True)
    owner=serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = Hotels
        fields = ('id', 'name', 'description', 'price', 'latitude', 'longitude', 'public', 'owner', 'created_at', 'updated_at', 'hotels_image')
