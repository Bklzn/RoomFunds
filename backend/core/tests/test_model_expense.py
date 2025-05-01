from rest_framework.test import APITestCase, APIRequestFactory
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from core.models import Expense, Group, Category

class ExpenseModelTest(APITestCase):
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
        self.group.members.add(self.user)
        self.category = Category.objects.create(name='Test Category', group=self.group)
        self.valid_expense_data = {
            'user': self.user,
            'group': self.group,
            'amount': Decimal('100.50'),
            'category_obj': self.category,
            'description': 'Lunch',
            'date': timezone.now().date()
        }
        self.factory = APIRequestFactory()

    def test_create_expense(self):
        expense = Expense.objects.create(**self.valid_expense_data)
        self.assertEqual(expense.amount, Decimal('100.50'))
        self.assertEqual(expense.category_obj, self.category)
        self.assertEqual(expense.description, 'Lunch')
        self.assertEqual(expense.user, self.user)
        self.assertEqual(expense.group, self.group) 
        self.assertEqual(str(expense), f'{expense.description} - {expense.amount}')

    def test_future_date_validation(self):
        future_date = timezone.now().date() + timedelta(days=1)
        expense_data = self.valid_expense_data.copy()
        expense_data['date'] = future_date
        
        expense = Expense(**expense_data)
        with self.assertRaises(ValidationError):
            expense.clean()

    def test_null_user_allowed(self):
        expense_data = self.valid_expense_data.copy()
        expense_data['user'] = None
        expense = Expense.objects.create(**expense_data)
        self.assertIsNone(expense.user)

    def test_blank_description_allowed(self):
        expense_data = self.valid_expense_data.copy()
        expense_data['description'] = ''
        expense = Expense.objects.create(**expense_data)
        self.assertEqual(expense.description, '')

    def test_decimal_amount_precision(self):
        expense_data = self.valid_expense_data.copy()
        expense_data['amount'] = Decimal('99999999.99')
        expense = Expense.objects.create(**expense_data)
        self.assertEqual(expense.amount, Decimal('99999999.99'))
        
    def test_blank_category_allowed(self):
        expense_data = self.valid_expense_data.copy()
        expense_data['category_obj'] = None
        expense_data['category_text'] = ''
        expense = Expense.objects.create(**expense_data)
        self.assertEqual(expense.category_text, '')
        self.assertEqual(expense.category_obj, None)
