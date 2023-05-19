from django.urls import path
from .views import HotelListAPIView, HotelDetailAPIView, ReviewListCreateAPIView, KhaltiValidationView

urlpatterns = [
    # Other URL patterns...
    path('', HotelListAPIView.as_view(), name='hotel-list'),
    path('<slug:slug>/', HotelDetailAPIView.as_view(), name='hotel-detail'),
    path('<slug:hotel_slug>/reviews/', ReviewListCreateAPIView.as_view(), name='hotel-review-list'),
    path('subscribe/', KhaltiValidationView.as_view(), name='khalti-validation'),
]


