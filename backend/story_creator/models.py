from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Story(models.Model):
    title = models.CharField(max_length=255)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    image = models.ImageField(upload_to="story_images/", null=True, blank=True)
    max_contributions = models.IntegerField(default=10) 

    def check_completion(self):
        if self.contributions.count() >= self.max_contributions:
            self.completed = True
            self.save()


class Contribution(models.Model):
    story = models.ForeignKey(Story, related_name="contributions", on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.story.completed:
            raise ValueError("No further contribution can be made to the completed story.")
        super().save(*args, **kwargs)
        self.story.check_completion()
