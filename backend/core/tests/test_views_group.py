from rest_framework.test import APITestCase, APIRequestFactory
from django.contrib.auth.models import User
from core.models import Group
from core.views.group import GroupsView, GroupView
from rest_framework.test import force_authenticate

class TestGroupsView(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.group = Group.objects.create(
            name='Test Group',
            description='Test Description',
            owner=self.user,
        )
        self.group.members.add(self.user)
        self.view = GroupsView.as_view()
        self.groupsLink = '/api/groups'

    def test_get_groups_list(self):
        request = self.factory.get(self.groupsLink)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Group')

    def test_create_group(self):
        data = {
            'name': 'New Group',
            'description': 'New Description'
        }
        request = self.factory.post(self.groupsLink, data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['name'], 'New Group')

    def test_create_group_invalid_data(self):
        data = {
            'name': '',
            'description': 'New Description'
        }
        request = self.factory.post(self.groupsLink, data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

class TestGroupView(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.moderator = User.objects.create_user(username='testuser2', password='testpass123')
        self.member = User.objects.create_user(username='testuser3', password='testpass123')
        self.group = Group.objects.create(
            name='Test Group',
            description='Test Description',
            owner=self.user
        )
        self.group.moderators.add(self.moderator)
        self.group.members.add(self.user, self.moderator, self.member)
        self.view = GroupView.as_view()
        self.groupLink = '/api/group'

    def test_get_single_group(self):
        request = self.factory.get(f'{self.groupLink}/{self.group.name}')
        force_authenticate(request, user=self.user)
        response = self.view(request, name=self.group.name)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], 'Test Group')

    def test_update_group_by_owner(self):
        data = {
            'name': 'Updated Group',
            'description': 'Updated Description',
        }
        request = self.factory.put(f'{self.groupLink}/{self.group.name}', data)
        force_authenticate(request, user=self.user)
        response = self.view(request, name=self.group.name)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], 'Updated Group')
        
    def test_update_group_by_moderator(self):
        data = {
            'name': 'Updated Group',
            'description': 'Updated Description',
        }
        request = self.factory.put(f'{self.groupLink}/{self.group.name}', data)
        force_authenticate(request, user=self.moderator)
        response = self.view(request, name=self.group.name)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], 'Updated Group')
        
    def test_update_group_by_member(self):
        data = {
            'name': 'Updated Group',
            'description': 'Updated Description',
        }
        request = self.factory.put(f'{self.groupLink}/{self.group.name}', data)
        force_authenticate(request, user=self.member)
        response = self.view(request, name=self.group.name)
        self.assertEqual(response.status_code, 403)
        self.assertIn('error', response.data)

    def test_delete_group_by_owner(self):
        request = self.factory.delete(f'{self.groupLink}/{self.group.pk}')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.group.pk)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Group.objects.filter(pk=self.group.pk).exists())
        
    def test_delete_group_by_moderator(self):
        request = self.factory.delete(f'{self.groupLink}/{self.group.pk}')
        force_authenticate(request, user=self.moderator)
        response = self.view(request, pk=self.group.pk)
        self.assertEqual(response.status_code, 403)
        self.assertTrue(Group.objects.filter(pk=self.group.pk).exists())
        
    def test_delete_group_by_member(self):
        request = self.factory.delete(f'{self.groupLink}/{self.group.pk}')
        force_authenticate(request, user=self.member)
        response = self.view(request, pk=self.group.pk)
        self.assertEqual(response.status_code, 403)
        self.assertTrue(Group.objects.filter(pk=self.group.pk).exists())

    def test_get_nonexistent_group(self):
        request = self.factory.get(f'{self.groupLink}/nonexistent')
        force_authenticate(request, user=self.user)
        response = self.view(request, name='nonexistent')
        self.assertEqual(response.status_code, 404)

    def test_unauthorized_access(self):
        other_user = User.objects.create_user(username='other', password='testpass123')
        request = self.factory.get(f'{self.groupLink}/{self.group.name}')
        force_authenticate(request, user=other_user)
        response = self.view(request, name=self.group.name)
        self.assertEqual(response.status_code, 404)
