from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from products.views import ProductViewSet, OrderViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.permissions import AllowAny
from products.views import SignupView

## This file defines the URL routing for the backend application, including admin routes, API endpoints, and JWT authentication.

## The router is used to automatically generate URL patterns for the Product and Order viewsets.

router = DefaultRouter() ## This creates a router instance to handle the API endpoints.
router.register(r"products", ProductViewSet, basename="products") ## here we register the ProductViewSet with the router.
router.register(r"orders", OrderViewSet, basename="orders") ## here we register the OrderViewSet with the router.

urlpatterns = [
    path("admin/", admin.site.urls),

    # JWT auth (public)
    ## These paths handle JWT token creation and refreshing.
    ## The TokenObtainPairView is used to obtain a token pair (access and refresh tokens).
    ## The TokenRefreshView is used to refresh the access token using the refresh token.

    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('api/signup/', SignupView.as_view(), name='signup'),

    # Protected API
    ## This includes the API endpoints for products and orders, which are protected by JWT authentication.
    path("api/", include(router.urls)),

    # API schema & Swagger UI
    ## These paths provide the API schema and Swagger UI for documentation.
    ## The SpectacularAPIView generates the OpenAPI schema, and the SpectacularSwaggerView provides a Swagger UI interface.
    path("api/schema/", SpectacularAPIView.as_view(permission_classes=[AllowAny]), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema", permission_classes=[AllowAny]), name="swagger-ui"),
]
