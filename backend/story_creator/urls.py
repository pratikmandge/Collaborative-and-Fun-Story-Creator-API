from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StoryViewSet, ContributionViewSet, UserRegistrationView, CurrentUserView, ExpiredTokenRefreshView, LogoutView, UserLoginView

router = DefaultRouter()
router.register(r'stories', StoryViewSet)
router.register(r'contributions', ContributionViewSet)

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="register"),
    path("login/", UserLoginView.as_view(), name="login"),
    path('refresh/', ExpiredTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path("current-user/", CurrentUserView.as_view(), name="current_user"),
    path("api/", include(router.urls)),
]