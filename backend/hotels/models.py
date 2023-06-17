from django.db import models
from accounts.models import User
from django.utils.text import slugify
from django.db.models import Avg
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.postgres.fields import ArrayField
import json
from django.db.models import JSONField

    
class Hotel(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(unique=True)
    latitude = models.DecimalField(max_digits=20, decimal_places=17)
    longitude = models.DecimalField(max_digits=20, decimal_places=17)
    location=models.CharField(max_length=500, default='Nepal')
    category=models.CharField(max_length=100, default='Hotel')
    offering = JSONField(blank=True, null=True)
    email=models.EmailField(max_length=255, null=True)
    # services=JSONField()



    slug = models.SlugField(unique=True, blank=True)
    c_review=models.CharField(null=True, max_length=500)

    is_active = models.BooleanField(default=False)

    price=models.DecimalField(max_digits=10, decimal_places=2)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1

            while True:
                try:
                    Hotel.objects.get(slug=slug)
                    # Slug already exists, append a counter to make it unique
                    slug = f"{base_slug}-{counter}"
                    counter += 1
                except Hotel.DoesNotExist:
                    # Unique slug found, exit the loop
                    break

            self.slug = slug


        super().save(*args, **kwargs)
    

    def calculate_average_rating(self):
        average_rating = HotelReview.objects.filter(place=self).aggregate(avg_rating=Avg('rating'))['avg_rating']
        self.rating = round(average_rating, 2) if average_rating else 0
        self.save()

    def __str__(self):
        return self.name
    
# class Current(models.Model):
#     latitude = models.DecimalField(max_digits=9, decimal_places=6)
#     longitude = models.DecimalField(max_digits=9, decimal_places=6)


    


class HotelReview(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    description = models.TextField()
    review_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.reviewer.username} for {self.place.name}"
    
class HotelImage(models.Model):
    hotel = models.ForeignKey(Hotel, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='hotel_images/', null=True)

    def __str__(self):
        return f"Image for {self.hotel.name}"
    
# class KhaltiValidation(models.Model):
#     amount=models.IntegerField(default=0)
#     token= models.CharField(max_length=255)
#     def __str__(self):
#         return self.token

from django.utils import timezone
import datetime
import pytz
from django.contrib.auth.models import AnonymousUser

class ActivateSubscription(models.Model):
    email=models.EmailField(max_length=255, null=True)
    def save(self, *args, **kwargs):
        try:
            user=User.objects.get(email=self.email)
        except:
            user= None
        if user :
            user.is_subscribed=True
            user.save()
        super().save(*args, **kwargs)

class KhaltiValidation(models.Model):
    email = models.EmailField(max_length=255, null=True)
    amount = models.IntegerField(default=200)
    token = models.CharField(max_length=255)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField(null=True)
    is_active = models.BooleanField(default=True)


    def save(self, *args, **kwargs):
        self.subscribed_at = datetime.datetime.now(pytz.utc)
        # Calculate the expiration date (30 days from the subscribed_at)
        expiry_date = self.subscribed_at + timezone.timedelta(days=30)
        self.expiry_date=expiry_date
        # Update the is_active attribute based on the current date
        if timezone.now() > expiry_date:
            self.is_active = False

        
        try:
            user=User.objects.get(email=self.email)
        except:
            user= None
        if user :
            user.is_subscribed=True
            user.save()



        super().save(*args, **kwargs)
    
