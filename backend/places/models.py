from django.db import models
from accounts.models import User
from django.utils.text import slugify
class Place(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    latitude = models.DecimalField(max_digits=50, decimal_places=10)
    longitude = models.DecimalField(max_digits=50, decimal_places=10)
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

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class PlaceImage(models.Model):
    place = models.ForeignKey(Place, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='place_images/', null=True)

    def __str__(self):
        return f"Image for {self.place.name}"
