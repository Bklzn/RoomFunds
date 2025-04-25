from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from core.models.expense import Expense
from core.models.group import Group

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
        self.valid_expense_data = {
            'user': self.user,
            'group': self.group,
            'amount': Decimal('100.50'),
            'category': 'Food',
            'description': 'Lunch',
            'date': timezone.now().date()
        }

    def test_create_expense(self):
        expense = Expense.objects.create(**self.valid_expense_data)
        self.assertEqual(expense.amount, Decimal('100.50'))
        self.assertEqual(expense.category, 'Food')
        self.assertEqual(expense.description, 'Lunch')
        self.assertEqual(expense.user, self.user)
        self.assertEqual(expense.group, self.group)

    def test_expense_string_representation(self):
        expense = Expense.objects.create(**self.valid_expense_data)
        expected_string = f"{expense.amount} - {expense.category}"
        self.assertEqual(str(expense), expected_string)

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

    def test_blank_category_allowed(self):
        expense_data = self.valid_expense_data.copy()
        expense_data['category'] = ''
        expense = Expense.objects.create(**expense_data)
        self.assertEqual(expense.category, '')

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
