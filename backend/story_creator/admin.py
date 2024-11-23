from django.contrib import admin
from .models import Story, Contribution


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author", "created_at", "completed")
    search_fields = ("title", "author__username")
    list_filter = ("completed", "created_at")
    ordering = ("-created_at",)
    actions = ['duplicate_story']

    def duplicate_story(self, request, queryset):
        for story in queryset:
            story.pk = None
            story.save()
            self.message_user(request, f'Story "{story.title}" duplicated successfully.')

    duplicate_story.short_description = "Duplicate selected stories"



@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
    list_display = ("id", "get_story_title", "author", "text", "created_at")
    search_fields = ("story__title", "author__username", "text")
    list_filter = ("created_at",)
    list_editable = ("author",)
    ordering = ("-created_at",)
    actions = ['duplicate_contribution']

    def duplicate_contribution(self, request, queryset):
        for contribution in queryset:
            contribution.pk = None
            contribution.save()
            self.message_user(request, f'Contribution for story "{contribution.story.title}" duplicated successfully.')

    duplicate_contribution.short_description = "Duplicate selected contributions"

    def get_story_title(self, obj):
        return obj.story.title
    get_story_title.short_description = 'Story Title'