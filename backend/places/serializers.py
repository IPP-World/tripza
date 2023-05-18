from rest_framework import serializers, viewsets, routers
from .models import Place, PlaceImage


class PlaceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceImage
        fields = ('id', 'image')

class PlaceSerializer(serializers.ModelSerializer):
    images = PlaceImageSerializer(many=True, read_only=True)
    contributor_name = serializers.SerializerMethodField()

    def get_contributor_name(self, obj):
        return f"{obj.contributor.fname} {obj.contributor.lname}"


    class Meta:
        model = Place
        fields = ('id', 'name', 'description', 'latitude', 'longitude', 'slug', 'is_verified', 'contributor', 'rating', 'contributor_name', 'images')