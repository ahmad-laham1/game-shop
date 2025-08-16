from rest_framework import serializers
from .models import Product, Order
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password


## This file defines serializers for the Product and Order models, as well as a serializer for user signup.
## Serializers are used to convert complex data types, such as model instances, into JSON format
## and vice versa. They also handle validation of input data.
## The SignupSerializer is specifically designed for user registration, ensuring that passwords meet security requirements.





## Serializer for Product model
## It includes fields for product details and can be used to serialize product data for API responses.
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'price', 'location', 'created_at']
        # read_only_fields = ['created_at']



## Serializer for Order model
## It includes fields for order details and the related product, allowing for nested serialization.
class OrderSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    class Meta:
        model = Order
        fields = ['id','product', 'price_at_purchase', 'reference', 'created_at']
        read_only_fields = ['reference', 'created_at']


## Serializer for user signup
## It includes fields for username, email, and password, and validates the password using Django's
class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)

    class Meta:
        model = get_user_model()
        fields = ("username", "email", "password")

    def validate_password(self, value):
        # Use Django's password validators (length, similarity, common, numeric)
        validate_password(value)
        return value

    def create(self, validated_data):
        User = get_user_model()
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )