from rest_framework import serializers, viewsets, routers
from .models import Place, PlaceImage, Review


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
        fields = ('id', 'name', 'description', 'latitude', 'longitude', 'metalatitude', 'metalongitude', 'c_review', 'slug', 'is_verified', 'contributor', 'rating', 'contributor_name', 'images')

class ReviewSerializer(serializers.ModelSerializer):
    # place = PlaceSerializer(read_only=True)
    reviewer = serializers.SerializerMethodField()
    class Meta:
        model = Review
        fields = ('id', 'reviewer', 'rating', 'description', 'review_date')
        read_only_fields = ('id', 'review_date')

    def get_reviewer(self, obj):
        return obj.reviewer.fname if obj.reviewer else None