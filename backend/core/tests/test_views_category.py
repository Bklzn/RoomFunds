from rest_framework.test import APITestCase, APIRequestFactory,  force_authenticate
from django.contrib.auth.models import User
from core.models import Group, Category
from core.views.category import CategoriesView
from rest_framework import status
import uuid

class CategoryViewTest(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.other_user = User.objects.create_user(username='otheruser', password='password123')
        self.group = Group.objects.create(name='Test Group', description='Test Description', owner=self.user)
        self.group.members.add(self.user)
        self.category = Category.objects.create(name='Test Category', group=self.group)
        self.url = lambda group_name: f'/api/groups/{group_name}/categories/'
        self.view = CategoriesView.as_view()

    def test_get_categories_success(self):
        request = self.factory.get(self.url(self.group.slug))
        force_authenticate(request, user=self.user)
        response = self.view(request, slug=self.group.slug)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Category')

    def test_get_categories_unauthorized_user(self):
        request = self.factory.get(self.url(self.group.slug))
        force_authenticate(request, user=self.other_user)
        response = self.view(request, slug=self.group.slug)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_categories_nonexistent_group(self):
        group_slug = str(uuid.uuid4())
        request = self.factory.get(self.url(group_slug))
        force_authenticate(request, user=self.user)
        response = self.view(request, slug=group_slug)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_category_success(self):
        data = {
            'name': 'New Category',
            'description': 'New Description'
        }
        request = self.factory.post(self.url(self.group.slug), data, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request, slug=self.group.slug)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'New Category')
        self.assertEqual(Category.objects.count(), 2)

    def test_create_category_invalid_data(self):
        data = {
            'description': 'New Description'
        }
        request = self.factory.post(self.url(self.group.slug), data, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request, slug=self.group.slug)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
