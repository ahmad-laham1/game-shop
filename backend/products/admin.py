from django.contrib import admin
from .models import Product, Order

# Register your models here.


## Admin configuration for Product and Order models
## This allows the admin interface to manage products and orders effectively.
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'location', 'created_at')
    search_fields = ('title', 'description')
    list_filter = ('location', 'created_at')
    
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'price_at_purchase', 'reference', 'created_at')
    search_fields = ('user__username', 'product__title', 'reference')
    list_filter = ('created_at',)