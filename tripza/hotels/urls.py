from django.urls import path
from hotels.views import HotelDetailAPIView, HotelListAPIView

urlpatterns = [
    path('', HotelListAPIView.as_view(), name="hotels"),
    path('<int:id>', HotelDetailAPIView.as_view(), name="hotel_detail"),
]