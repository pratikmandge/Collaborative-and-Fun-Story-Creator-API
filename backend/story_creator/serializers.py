from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Contribution, Story
from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.core.files.storage import default_storage


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "password",)
        
    def create(self, validated_data):
        user = User(username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user
    

class StorySerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    image = serializers.ImageField(required=False)

    class Meta:
        model = Story
        fields = '__all__'

    def validate_image(self, value):
        max_size = 2 * 1024 * 1024
        if value.size > max_size:
            raise ValidationError("Image size should not exceed 2MB.")
        valid_formats = ['image/jpeg', 'image/png', 'image/jpg']
        if value.content_type not in valid_formats:
            raise ValidationError("Only .jpg, .jpeg, and .png file formats are allowed.")

        return value

    def create(self, validated_data):
        image = validated_data.pop('image', None)
        story = Story.objects.create(**validated_data)

        if image:
            image_path = f'story_images/{image.name}'
            with default_storage.open(image_path, 'wb+') as destination:
                for chunk in image.chunks():
                    destination.write(chunk)
            story.image = image_path
            story.save()

        return story

class ContributionSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Contribution
        fields = "__all__"

    def validate_text(self, value):
        if len(value.split()) > 20:
            raise serializers.ValidationError("Contribution exceeds the word limit of 20 words.")
        
        if value.count(".") > 1:
            raise serializers.ValidationError("Please provide only one sentence.")
        return value

    def validate(self, data):
        story = data["story"]
        if story.completed:
            raise serializers.ValidationError("No further contribution can be made to the completed story.")
        
        if story.contributions.count() >= story.max_contributions:
            raise serializers.ValidationError("This story has reached the maximum number of contributions.")

        return data
