from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from core.models import Group, Category
from core.serializers.category import CategorySerializer
from rest_framework.test import APIRequestFactory
from rest_framework.exceptions import ValidationError

class TestCategorySerializer(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.group = Group.objects.create(
            name='Test Group',
            description='Test Description',
            owner=self.user
        )
        self.group.members.add(self.user)
        self.category = Category.objects.create(
            name='Test Category',
            description='Test Description',
            group=self.group
        )
        self.request = self.factory.post('/api/categories')
        self.request.user = self.user

    def test_validate_group_name_success(self):
        serializer = CategorySerializer(context={'request': self.request})
        validated_name = serializer.validate_group_name('Test Group')
        self.assertEqual(validated_name, 'Test Group')
        self.assertEqual(serializer.group, self.group)

    def test_validate_group_name_nonexistent_group(self):
        serializer = CategorySerializer(context={'request': self.request})
        with self.assertRaises(ValidationError):
            serializer.validate_group_name('Nonexistent Group')

    def test_validate_name_duplicate(self):
        serializer = CategorySerializer(context={'request': self.request})
        serializer.group = self.group
        with self.assertRaises(ValidationError):
            serializer.validate_name(self.category.name)

    def test_validate_name_different_case(self):
        serializer = CategorySerializer(context={'request': self.request})
        serializer.group = self.group
        with self.assertRaises(ValidationError):
            serializer.validate_name('TEST CATEGORY')

    def test_create_category_success(self):
        serializer = CategorySerializer(context={'request': self.request})
        serializer.group = self.group
        validated_data = {
            'name': 'New Category',
            'description': 'New Description',
            'group_name': 'Test Group'
        }
        category = serializer.create(validated_data)
        self.assertEqual(category.name, 'New Category')
        self.assertEqual(category.description, 'New Description')
        self.assertEqual(category.group, self.group)

    def test_serializer_valid_data(self):
        data = {
            'name': 'New Category',
            'description': 'New Description',
            'group_name': 'Test Group'
        }
        serializer = CategorySerializer(data=data, context={'request': self.request})
        self.assertTrue(serializer.is_valid())

    def test_serializer_missing_group_name(self):
        data = {
            'name': 'New Category',
            'description': 'New Description'
        }
        serializer = CategorySerializer(data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
