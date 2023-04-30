from django.db import models
import uuid
from authentication.models import User

# Create your models here.

class BaseModel(models.Model):
    uid = models.UUIDField(primary_key=True , editable=False , default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now= True)
    updated_at = models.DateTimeField(auto_now_add= True)

    class Meta:
        abstract = True 


class Hotels(models.Model):

    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, max_length=255)
    latitude = models.DecimalField(max_digits=15, decimal_places=10)
    longitude = models.DecimalField(max_digits=15, decimal_places=10)
    public=models.BooleanField(default=True)
    owner = models.ForeignKey(to=User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering= ['-updated_at']

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.id:
            # Only set owner if the house is being created for the first time
            self.owner = self._request_user
        super(Hotels, self).save(*args, **kwargs)

    @property
    def _request_user(self):
        """
        Get the user associated with the current request.
        """
        # TODO: Replace with your own method of getting the request user
        # For example, you could use Django's request middleware or a custom decorator
        return User.objects.first()
     

class HotelImage(BaseModel):
    product = models.ForeignKey(Hotels , on_delete=models.CASCADE , related_name="hotels_image")
    image =  models.ImageField(upload_to="hotel")