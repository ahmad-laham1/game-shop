from rest_framework.pagination import PageNumberPagination


## This file defines a custom pagination class for the Django REST Framework.
## It sets the default page size and allows clients to specify a different page size via query parameters.
## The maximum page size is also defined to prevent excessively large responses.
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 100
