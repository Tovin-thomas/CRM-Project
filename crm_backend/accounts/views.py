"""
Views for user authentication and registration.
Handles login (JWT tokens) and user registration.
"""
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer, UserProfileSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user.
    
    Endpoint: POST /api/auth/register/
    Access: Public (AllowAny)
    
    Payload:
    {
        "username": "jdoe",
        "email": "jdoe@example.com",
        "password": "securepassword123",
        "first_name": "John",
        "last_name": "Doe",
        "role": "sales_manager" (optional, default: sales_rep)
    }
    """
    # Validate input data using serializer
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate JWT tokens for the new user immediately
        refresh = RefreshToken.for_user(user)
        
        # Logic: Admin users are trusted and can login immediately.
        # Regular users must be approved by an admin first.
        if user.role == 'admin':
            return Response({
                'message': 'Registration successful!',
                'user': UserProfileSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        else:
            # For non-admins, return success but indicate approval is needed
            return Response({
                'message': 'Registration successful! Your account is pending admin approval.',
                'user': UserProfileSerializer(user).data,
                'requiresApproval': True
            }, status=status.HTTP_201_CREATED)
    
    # Return validation errors (e.g., duplicate email, weak password)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Login user and return JWT tokens.
    
    Endpoint: POST /api/auth/login/
    Access: Public
    
    Payload:
    {
        "email": "jdoe@example.com",
        "password": "securepassword123"
    }
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    # Basic validation
    if not email or not password:
        return Response({
            'error': 'Please provide both email and password'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Authenticate user using Django's built-in auth system
    # This checks the email/password against the database
    user = authenticate(username=email, password=password)
    
    if user is not None:
        # Check if user account is active (admin approved)
        if not user.is_active:
            return Response({
                'error': 'Your account is pending admin approval. Please wait for activation.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Generate fresh JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Login successful',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
    
    # Authentication failed
    return Response({
        'error': 'Invalid credentials'
    }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """
    Get current user's profile.
    GET /api/auth/profile/
    """
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update current user's profile (first_name, last_name, email).
    PUT/PATCH /api/profile/
    Body: {first_name, last_name, email}
    """
    user = request.user
    serializer = UserProfileSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Profile updated successfully',
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    Change user password.
    POST /api/profile/change-password/
    Body: {old_password, new_password, confirm_password}
    """
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')
    
    # Validate required fields
    if not all([old_password, new_password, confirm_password]):
        return Response({
            'error': 'Please provide old password, new password, and confirm password'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if old password is correct
    if not user.check_password(old_password):
        return Response({
            'error': 'Current password is incorrect'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if new passwords match
    if new_password != confirm_password:
        return Response({
            'error': 'New passwords do not match'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate password strength (minimum 8 characters)
    if len(new_password) < 8:
        return Response({
            'error': 'Password must be at least 8 characters long'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Set new password
    user.set_password(new_password)
    user.save()
    
    return Response({
        'message': 'Password changed successfully'
    }, status=status.HTTP_200_OK)


# ============================================
#  ADMIN-ONLY ENDPOINTS
# ============================================

from .permissions import IsAdminUser
from django.contrib.auth import get_user_model
from django.db.models import Count
from leads.models import Lead
from contacts.models import Contact
from deals.models import Deal
from tasks.models import Task

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_get_all_users(request):
    """
    Get all users (admin only).
    GET /api/admin/users/
    """
    users = User.objects.all().order_by('-created_at')
    serializer = UserProfileSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_update_user(request, user_id):
    """
    Update user role or active status (admin only).
    PATCH /api/admin/users/<id>/
    Body: {role, is_active}
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Update role if provided
    if 'role' in request.data:
        user.role = request.data['role']
    
    # Update is_active if provided
    if 'is_active' in request.data:
        user.is_active = request.data['is_active']
    
    user.save()
    
    serializer = UserProfileSerializer(user)
    return Response({
        'message': 'User updated successfully',
        'user': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def admin_delete_user(request, user_id):
    """
    Delete a user (admin only).
    DELETE /api/admin/users/<id>/
    """
    try:
        user = User.objects.get(id=user_id)
        
        # Prevent deleting yourself
        if user.id == request.user.id:
            return Response({
                'error': 'You cannot delete your own account'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user.delete()
        return Response({
            'message': 'User deleted successfully'
        }, status=status.HTTP_200_OK)
    
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_get_stats(request):
    """
    Get system statistics (admin only).
    GET /api/admin/stats/
    """
    stats = {
        'total_users': User.objects.count(),
        'active_users': User.objects.filter(is_active=True).count(),
        'total_leads': Lead.objects.count(),
        'total_contacts': Contact.objects.count(),
        'total_deals': Deal.objects.count(),
        'total_tasks': Task.objects.count(),
        'recent_users': UserProfileSerializer(
            User.objects.order_by('-created_at')[:5], 
            many=True
        ).data,
        'users_by_role': list(
            User.objects.values('role').annotate(count=Count('role'))
        ),
    }
    
    return Response(stats, status=status.HTTP_200_OK)
