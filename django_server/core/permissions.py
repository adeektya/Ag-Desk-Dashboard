from rest_framework import permissions

class IsOwnerUser(permissions.BasePermission):
    """
    Custom permission to only allow owners of the object to edit it.
    """

    def has_permission(self, request, view):
        # Check that user is authenticated and is an owner
        return request.user.is_authenticated and request.user.is_owner