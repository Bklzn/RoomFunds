from decimal import Decimal
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory, APITestCase
from django.contrib.auth.models import User
from core.models import Group, Expense
from core.serializers import ExpenseSerializer, UserSerializer

class TestExpenseSerializer(APITestCase):
    def setUp(self):
        self.User = get_user_model()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.group = Group.objects.create(
            name='Test Group',
            description='Test Description',
            owner=self.user
        )
        self.group.members.add(self.user)
        self.factory = APIRequestFactory()
        self.request = self.factory.get('/')
        self.request.user = self.user
        self.valid_data = {
            'group': 'Test Group',
            'amount': '50.00',
            'category': 'Food',
            'description': 'Dinner',
            'date': '2023-01-01'
        }

    def test_expense_serializer_valid_data(self):
        serializer = ExpenseSerializer(data=self.valid_data, context={'request': self.request})
        self.assertTrue(serializer.is_valid())

    def test_expense_serializer_invalid_amount(self):
        data = self.valid_data
        data['amount'] = '0.00'
        serializer = ExpenseSerializer(data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn('amount', serializer.errors)

    def test_expense_serializer_invalid_group(self):
        self.unknown_user = User.objects.create_user(username='unnknownuser', password='testpass123')
        self.unknown_group = Group.objects.create(
            name='Other Group',
            description='Test Description',
            owner=self.unknown_user
        )
        data = self.valid_data
        data['group'] = 'Other Group'
        serializer = ExpenseSerializer(data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn('group', serializer.errors)

    def test_expense_serializer_get_user(self):
        serializer = ExpenseSerializer(data=self.valid_data, context={'request': self.request})
        serializer.is_valid()
        expense = serializer.save()
        serializer = ExpenseSerializer(expense, context={'request': self.request})
        self.assertEqual(
            serializer.data['user'], 
            UserSerializer(self.user).data['display']
        )

    def test_expense_serializer_read_only_fields(self):
        serializer = ExpenseSerializer(data=self.valid_data, context={'request': self.request})
        serializer.is_valid()
        expense = serializer.save()
        serializer = ExpenseSerializer(expense, context={'request': self.request})
        self.assertNotIn('id', serializer.data)
        self.assertTrue(serializer.fields['user'].read_only)
