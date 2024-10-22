from rest_framework import serializers, viewsets, routers
from .models import Hotel, HotelImage, HotelReview, KhaltiValidation


class HotelImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelImage
        fields = ('id', 'image')

class HotelSerializer(serializers.ModelSerializer):
    images = HotelImageSerializer(many=True, read_only=True)
    owner_name = serializers.SerializerMethodField()

    def get_owner_name(self, obj):
        return f"{obj.owner.fname} {obj.owner.lname}"


    class Meta:
        model = Hotel
        fields = ('id', 'name', 'description', 'offering', 'latitude', 'longitude', 'location', 'category', 'c_review', 'price', 'slug', 'is_active', 'owner', 'rating', 'owner_name', 'images', "email")
        extra_kwargs = {
            'price': {'required': True}  # Set 'price' field as required
        }


class HotelReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.SerializerMethodField()
    class Meta:
        model = HotelReview
        fields = ('id', 'reviewer', 'rating', 'description', 'review_date')
        read_only_fields = ('id', 'review_date')

    def get_reviewer(self, obj):
        return obj.reviewer.fname if obj.reviewer else None

# class ActivateSubscriptionSerailizer(serializers.ModelSerializer):
#     class Meta:
#         model=ActivateSubscription
#         fields=('id', 'email')

class KhaltiValidationSerializer(serializers.ModelSerializer):
    subscribed_at = serializers.DateTimeField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = KhaltiValidation
        fields = ('id', 'amount', 'token', 'subscribed_at', 'is_active', 'email')

        
# class CurrentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model=Current
#         fields=('id', 'latitude', 'longitude')


