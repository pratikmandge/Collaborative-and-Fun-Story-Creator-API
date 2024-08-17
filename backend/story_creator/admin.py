from django.contrib import admin
from .models import Story, Contribution

@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at', 'completed')
    search_fields = ('title', 'author__username')
    list_filter = ('completed', 'created_at')
    ordering = ('-created_at',)

@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
    list_display = ('story', 'author', 'created_at')
    search_fields = ('story__title', 'author__username')
    list_filter = ('created_at',)
    ordering = ('-created_at',)
