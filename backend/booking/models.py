from django.db import models
from accounts.models import User
from hotels.models import Hotel

# Create your models here.
class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    guest_no=models.IntegerField(default=1)
    room_no=models.IntegerField(default=1)
    status=models.CharField(max_length=50, default="pending")
    h_name=models.CharField(max_length=255, default="Hotel Pokhara")
    def save(self, *args, **kwargs):
        self.h_name=self.hotel.name
        super().save(*args, **kwargs)
    
    # ...

    def __str__(self):
        return f"{self.user.fname} - {self.hotel.name}"
