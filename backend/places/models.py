from django.db import models
from accounts.models import User
from django.utils.text import slugify
from django.db.models import Avg
from .verify import haversine_distance

    
class Place(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    latitude = models.DecimalField(max_digits=20, decimal_places=16)
    longitude = models.DecimalField(max_digits=20, decimal_places=16)
    
    # metalatitude = models.DecimalField(max_digits=20, decimal_places=16,null=True,default=0)
    # metalongitude = models.DecimalField(max_digits=20, decimal_places=16,null=True,default=0)
    metalatitude = models.CharField(max_length=50)
    metalongitude = models.CharField(max_length=50)

    slug = models.SlugField(unique=True, blank=True)
    is_verified = models.BooleanField(default=False)
    contributor = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1

            while True:
                try:
                    Place.objects.get(slug=slug)
                    # Slug already exists, append a counter to make it unique
                    slug = f"{base_slug}-{counter}"
                    counter += 1
                except Place.DoesNotExist:
                    # Unique slug found, exit the loop
                    break

            self.slug = slug

        if self.is_verified is False:
            distance = haversine_distance(self.latitude, self.longitude, self.metalatitude, self.metalongitude)
            if distance <= 300:
                self.is_verified=True
                
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Review(models.Model):
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    description = models.TextField()
    review_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.reviewer.username} for {self.place.name}"
    
class PlaceImage(models.Model):
    place = models.ForeignKey(Place, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='place_images/', null=True)

    def __str__(self):
        return f"Image for {self.place.name}"
