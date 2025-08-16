from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from .models import Product, Order
from .serializers import ProductSerializer, OrderSerializer
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .serializers import SignupSerializer
from rest_framework_simplejwt.tokens import RefreshToken



## ViewSets for Product and Order models
class ProductViewSet(viewsets.ReadOnlyModelViewSet): ## This viewset provides read-only (list & retrieve) access to the Product model.
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer

    # Optional filter: ?location=JO|SA
    def get_queryset(self):
        qs = super().get_queryset()
        loc = self.request.query_params.get("location")
        if loc in ("JO", "SA"):
            qs = qs.filter(location=loc)
        return qs


class OrderViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   viewsets.GenericViewSet): ## This viewset provides create and retrieve access to the Order model.
    permission_classes = [AllowAny]  # Allow any user to create and retrieve orders 
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")
    
    def create(self, request, *args, **kwargs):
        product_id = request.data.get("product_id")
        if not product_id:
            return Response({"detail": "product_id is required"}, status=400)

        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found"}, status=404)

        order = Order.objects.create(
            user=request.user,
            product=product,
            price_at_purchase=product.price,
        )
        data = OrderSerializer(order).data
        return Response(data, status=status.HTTP_201_CREATED)
    
class SignupView(APIView): ## This view handles user signup.
    permission_classes = [AllowAny] # Allow any user to sign up

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": {"id": user.id, "username": user.username, "email": user.email},
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )