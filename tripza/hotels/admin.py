from django.contrib import admin
from .models import *

# Register your models here.

class HotelImage(admin.StackedInline):
    model=HotelImage

class HotelAdmin(admin.ModelAdmin):
    list_display=['name', 'price']
    inlines=[HotelImage]


admin.site.register(Hotels, HotelAdmin)