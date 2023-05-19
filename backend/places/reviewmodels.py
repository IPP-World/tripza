from django.db import models
from accounts.models import User
from django.utils.text import slugify
from django.db.models import Avg
from .models import Place

class Review(models.Model):
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    description = models.TextField()
    review_date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.place.update_rating()

    def __str__(self):
        return f"Review by {self.reviewer.username} for {self.place.name}"