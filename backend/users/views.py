"""
Users app views for authentication and user management.
"""
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login view that returns user info with JWT tokens."""
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """User registration endpoint."""
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                'message': 'Account created successfully. Please log in.',
                'username': user.username,
            },
            status=status.HTTP_201_CREATED
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout by blacklisting the refresh token."""
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)
    except Exception:
        return Response({'message': 'Logged out.'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """Get current authenticated user's details."""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
