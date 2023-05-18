from django.urls import path
from .views import PlaceListAPIView, PlaceDetailAPIView

urlpatterns = [
    # Other URL patterns...
    path('', PlaceListAPIView.as_view(), name='place-list'),
    path('<slug:slug>/', PlaceDetailAPIView.as_view(), name='place-detail'),
]
