from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from core.models import Group, Category
from django.db import IntegrityError

class TestCategoryModel(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.group = Group.objects.create(
            name='Test Group',
            description='Test Description',
            owner=self.user
        )
        self.category = Category.objects.create(
            group=self.group,
            name='Test Category',
            description='Test Category Description'
        )

    def test_category_creation(self):
        self.assertEqual(self.category.name, 'Test Category')
        self.assertEqual(self.category.description, 'Test Category Description')
        self.assertEqual(self.category.group, self.group)

    def test_category_string_representation(self):
        self.assertEqual(str(self.category), 'Test Category')

    def test_unique_category_name_per_group(self):
        with self.assertRaises(IntegrityError):
            Category.objects.create(
                group=self.group,
                name='Test Category',
                description='Duplicate Category'
            )

    def test_multiple_categories_different_groups(self):
        other_group = Group.objects.create(
            name='Other Group',
            description='Other Description',
            owner=self.user
        )
        other_category = Category.objects.create(
            group=other_group,
            name='Test Category',
            description='Same name, different group'
        )
        self.assertEqual(other_category.name, self.category.name)
        self.assertNotEqual(other_category.group, self.category.group)

    def test_category_with_empty_description(self):
        empty_desc_category = Category.objects.create(
            group=self.group,
            name='Empty Description Category',
            description=''
        )
        self.assertEqual(empty_desc_category.description, '')

    def test_category_deletion_on_group_delete(self):
        category_id = self.category.id
        self.group.delete()
        self.assertFalse(Category.objects.filter(id=category_id).exists())
