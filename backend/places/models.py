from django.db import models
from accounts.models import User
from django.utils.text import slugify
from django.db.models import Avg
from django.db.models import JSONField
from .verify import haversine_distance

    
class Place(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    latitude = models.DecimalField(max_digits=40, decimal_places=30)
    longitude = models.DecimalField(max_digits=40, decimal_places=30)
    location=models.CharField(max_length=500, default='Nepal')
    offering = JSONField(blank=True, null=True)

    metalatitude = models.CharField(max_length=50)
    metalongitude = models.CharField(max_length=50)
    c_review=models.CharField(null=True, max_length=500)

    slug = models.SlugField(unique=True, blank=True)
    is_verified = models.BooleanField(default=False)
    contributor = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    email=models.EmailField(max_length=255, null=True)


    def save(self, *args, **kwargs):
        if self.offering:
            self.offering = ','.join(self.offering)

        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1

            while True:
                try:
                    Place.objects.get(slug=slug)
                    slug = f"{base_slug}-{counter}"
                    counter += 1
                except Place.DoesNotExist:
                    break

            self.slug = slug
        
        if self.is_verified is False:
            distance = haversine_distance(self.latitude, self.longitude, self.metalatitude, self.metalongitude)
            if distance <= 1000:
                self.is_verified=True
                
        super().save(*args, **kwargs)

    def calculate_average_rating(self):
        average_rating = Review.objects.filter(place=self).aggregate(avg_rating=Avg('rating'))['avg_rating']
        self.rating = round(average_rating, 2) if average_rating else 0
        self.save()

    def __str__(self):
        return self.name
    
class PlaceImage(models.Model):
    place = models.ForeignKey(Place, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='place_images/', null=True)

    def __str__(self):
        return f"Image for {self.place.name}"
    

class Review(models.Model):
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    description = models.TextField()
    review_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.reviewer.username} for {self.place.name}"
    
