from django.urls import path
from .views import HotelListAPIView,Subscription, HotelDetailAPIView,ContributedAPIView, ReviewListCreateAPIView, TrendingPlacesView,  NearbyPlacesView, KhaltiValidationView, HotelShowAPIView, SearchAPIView


urlpatterns = [
    path('', HotelListAPIView.as_view(), name='hotel-list'),
    path('sub/', Subscription.as_view(), name='sub'),
    path('show/', HotelShowAPIView.as_view(), name='hotel-show'),
    path('subscribe', KhaltiValidationView.as_view(), name='khalti-validation'),
    path('trending-places/', TrendingPlacesView.as_view(), name='place-trending-list'),
    path('search/', SearchAPIView.as_view(), name='search-list'),
    path('my-hotels/', ContributedAPIView.as_view(), name='owned-list'),
    path('<slug:slug>/', HotelDetailAPIView.as_view(), name='hotel-detail'),
    path('<slug:hotel_slug>/reviews/', ReviewListCreateAPIView.as_view(), name='hotel-review-list'),
    path('<slug:hotel_slug>/nearby-places/', NearbyPlacesView.as_view(), name='place-nearby-list'),
    
    # path('subscription/', ActivateSubscriptionView.as_view(), name='activate'),
    ]


