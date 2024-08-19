from django.http import JsonResponse
from rest_framework.exceptions import NotFound
from rest_framework import generics, status, permissions, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import ContributionSerializer, StorySerializer, UserSerializer
from .models import Contribution, Story
# from django.shortcuts import get_object_or_404
# from rest_framework.decorators import action
from rest_framework.decorators import api_view

# Create your views here.

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserSerializer
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
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
            return JsonResponse({'error': 'Missing refresh token in cookie'}, status=400)

        request.data['refresh'] = refresh_token
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            if access_token:
                response.set_cookie('access', access_token, httponly=True, samesite='Lax')
            if refresh_token:
                response.set_cookie('refresh', refresh_token, httponly=True, samesite='Lax')

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

@api_view(['GET'])
def story_contributions(request, pk):
    """
    Get contributions for a specific story.
    """
    try:
        story = Story.objects.get(pk=pk)
    except Story.DoesNotExist:
        raise NotFound("Story not found")

    contributions = Contribution.objects.filter(story=story)
    serializer = ContributionSerializer(contributions, many=True)
    return Response(serializer.data)
