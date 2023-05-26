from django.urls import path
from .views import PlaceListAPIView, PlaceDetailAPIView, ReviewListCreateAPIView, PlaceShowAPIView, NearbyHotelsView,  ContributedAPIView, SearchAPIView

urlpatterns = [
    # Other URL patterns...
    path('', PlaceListAPIView.as_view(), name='place-list'),
    path('show/', PlaceShowAPIView.as_view(), name='place-list'),
    path('search/', SearchAPIView.as_view(), name='search-list'),
    path('my-contributions/', ContributedAPIView.as_view(), name='contributed-list'),
    path('<slug:slug>/', PlaceDetailAPIView.as_view(), name='place-detail'),
    path('<slug:place_slug>/reviews/', ReviewListCreateAPIView.as_view(), name='place-review-list'),
    path('<slug:place_slug>/nearby-hotels/', NearbyHotelsView.as_view(), name='hotel-nearby-list')

]


