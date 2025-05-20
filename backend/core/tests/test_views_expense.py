from rest_framework.test import APITestCase, APIRequestFactory
from django.contrib.auth.models import User
from django.utils import timezone
from decimal import Decimal
from core.models import Group, Expense
from datetime import date

class TestExpenseViews(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            password='testpass123'
        )
        self.group = Group.objects.create(
            name='Test Group',
            description='Test Description',
            owner=self.user
        )
        self.group.members.add(self.user)
        self.group.members.add(self.other_user)
        self.other_group = Group.objects.create(
            name='Other Test Group',
            description='Test Description',
            owner=self.other_user
        )
        self.other_group.members.add(self.other_user)
        self.expense = Expense.objects.create(
            user=self.user,
            group=self.group,
            amount=Decimal('50.00'),
            category_text='Food',
            description='Test expense',
            date=timezone.now().date()
        )
        self.expense2 = Expense.objects.create(
            user=self.other_user,
            group=self.group,
            amount=Decimal('123.00'),
            category_text='Food',
            description='Test expense',
            date=timezone.now().date()
        )
        self.other_expense = Expense.objects.create(
            user=self.other_user,
            group=self.other_group,
            amount=Decimal('30.00'),
            category_text='Transport',
            description='Other expense',
            date=timezone.now().date()
        )

    def test_expenses_list_view_returns_only_group_expenses(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/expenses',data={'groupName': 'Test Group'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['amount'], '123.00')

    def test_expense_creation_with_invalid_data(self):
        self.client.force_authenticate(user=self.user)
        invalid_data = {
            'group': 'Test Group',
            'amount': '-50.00',
            'category_obj': 'Food',
            'description': 'Invalid expense',
            'date': str(date.today())
        }
        response = self.client.post('/api/expenses', invalid_data)
        self.assertEqual(response.status_code, 400)

    def test_expense_detail_view_not_found(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/expense/99999')
        self.assertEqual(response.status_code, 404)

    def test_expense_update_with_valid_data(self):
        self.client.force_authenticate(user=self.user)
        updated_data = {
            'group': 'Test Group',
            'amount': '75.00',
            'category': 'Updated Food',
            'description': 'Updated expense',
            'date': str(date.today())
        }
        response = self.client.put(f'/api/expense/{self.expense.id}', updated_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['amount'], '75.00')
        self.assertEqual(response.data['category_display'], 'Updated Food')

    def test_expense_delete_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(f'/api/expense/{self.expense.id}')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Expense.objects.filter(id=self.expense.id).exists())

    def test_cannot_access_other_group_expense(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f'/api/expense/{self.other_expense.id}')
        self.assertEqual(response.status_code, 404)

    def test_unauthenticated_access_denied(self):
        response = self.client.get('/api/expenses')
        self.assertEqual(response.status_code, 401)
