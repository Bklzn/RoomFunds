from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from core.serializers import GroupSerializer
from core.models import Group
from user_auth.serializers import UserSerializer
from rest_framework.test import APIRequestFactory

class GroupSerializerTest(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.moderator = User.objects.create_user(username='moderator', password='password123')
        self.member = User.objects.create_user(username='member', password='password123')
        self.group = Group.objects.create(name='Test Group', description='Test Description', owner=self.user)
        self.group.members.add(self.user)
        self.group.moderators.add(self.moderator)
        self.group.members.add(self.member)
        self.requestGET = self.factory.get('/')
        self.requestPOST = self.factory.post('/')
        self.requestGET.user = self.user
        self.requestPOST.user = self.user

    def test_group_serializer_read(self):
        serializer = GroupSerializer(self.group, context={'request': self.requestGET})
        data = serializer.data
        userS = UserSerializer(self.user).data
        moderatorS = UserSerializer(self.moderator).data
        memberS = UserSerializer(self.member).data
        
        self.assertEqual(data['name'], 'Test Group')
        self.assertEqual(data['description'], 'Test Description')
        self.assertEqual(userS['display'], data['owner'])
        self.assertIn(moderatorS['display'], data['moderators'])
        self.assertIn(memberS['display'], data['members'])

    def test_group_serializer_create(self):
        data = {
            'name': 'New Group',
            'description': 'New Description'
        }
        serializer = GroupSerializer(data=data, context={'request': self.requestPOST})
        self.assertTrue(serializer.is_valid())
        group = serializer.save()
        
        self.assertEqual(group.name, 'New Group')
        self.assertEqual(group.description, 'New Description')
        self.assertEqual(group.owner, self.user)
        self.assertIn(self.user, group.members.all())

    def test_group_serializer_validate_duplicate_name(self):
        data = {
            'name': 'Test Group',
            'description': 'Another Description'
        }
        serializer = GroupSerializer(data=data, context={'request': self.requestGET})
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)

    def test_group_serializer_members_field_removed_on_post(self):
        serializer = GroupSerializer(data={}, context={'request': self.requestPOST})
        self.assertNotIn('members', serializer.fields)

    def test_group_serializer_members_field_present_on_get(self):
        serializer = GroupSerializer(context={'request': self.requestGET})
        self.assertIn('members', serializer.fields)
