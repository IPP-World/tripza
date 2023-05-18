from django.urls import path
from .views import PlaceListAPIView, PlaceDetailAPIView, ReviewListCreateAPIView

urlpatterns = [
    # Other URL patterns...
    path('', PlaceListAPIView.as_view(), name='place-list'),
    path('<slug:slug>/', PlaceDetailAPIView.as_view(), name='place-detail'),
    path('<slug:place_slug>/reviews/', ReviewListCreateAPIView.as_view(), name='place-review-list'),
]


