from django.http import JsonResponse
from rest_framework import generics, status, permissions, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import ContributionSerializer, StorySerializer, UserSerializer
from .models import Contribution, Story

# Create your views here.

class UserRegistrationView(generics.CreateAPIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            response = Response(serializer.data, status=status.HTTP_201_CREATED)
            response.set_cookie('access', str(refresh.access_token), httponly=True, samesite='Lax')
            response.set_cookie('token', str(refresh), httponly=True, samesite='Lax')
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserLoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        refresh = RefreshToken(response.data['refresh'])
        access_token = str(refresh.access_token)

        response.set_cookie('refresh', str(refresh), httponly=True, samesite='Lax')
        response.set_cookie('access', access_token, httponly=True, samesite='Lax')

        return response
    
class ExpiredTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')

        if not refresh_token:
            response = JsonResponse({'error': 'Missing refresh token in cookie'}, status=400)
            return response
        
        request.data['refresh'] = refresh_token
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_201_CREATED:
            access_token = str(response.data['access'])

            # For Production (HTTPS)
            # response.set_cookie('access', access_token, httponly=True, samesite=None, secure=True)
            # response.set_cookie('refresh', str(refresh), httponly=True, samesite=None, secure=True)

            # For Local Dev
            response.set_cookie('access', access_token, httponly=True, samesite='Lax')

        return response

class LogoutView(APIView):
    def post(self, request):
        response = JsonResponse({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        return response

class CurrentUserView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class ContributionViewSet(viewsets.ModelViewSet):
    queryset = Contribution.objects.all()
    serializer_class = ContributionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
