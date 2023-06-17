from django.urls import path
from .views import BookingListCreateAPIView, BookingListAPIView, UserBookingsApiView, BookingResponseApiView

urlpatterns = [
    path('list/', BookingListAPIView.as_view()),
    path('my-bookings/', UserBookingsApiView.as_view()),
    path('<slug:hotel_slug>/', BookingListCreateAPIView.as_view()),
    path('<int:id>/response/', BookingResponseApiView.as_view()),
]
