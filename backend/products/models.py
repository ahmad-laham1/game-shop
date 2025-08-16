from django.db import models
from django.conf import settings
import uuid
# Create your models here.

## This file defines the Product and Order models for the e-commerce application.
class Product(models.Model):
    
    JO = "JO" 
    SA = "SA"
    ## Define choices for product location
    COUNTRY_CHOICES = [
        (JO, "Jordan"),
        (SA, "Saudi Arabia"),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=2, choices=COUNTRY_CHOICES, default=JO)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
## Order model to handle purchases of products
## Each order is linked to a user and a product, with a unique reference ID.
class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
    reference = models.UUIDField(unique=True, editable=False,default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f'Order {self.reference} by {self.user.username} for {self.product.title}'