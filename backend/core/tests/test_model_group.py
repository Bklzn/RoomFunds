from django.test import TestCase
from django.contrib.auth.models import User
from core.models import Group, GroupMembership

class TestGroupModel(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.moderator = User.objects.create_user(
            username='moduser',
            password='testpass123'
        )
        self.member = User.objects.create_user(
            username='memuser',
            password='testpass123'
        )
        self.group = Group.objects.create(
            name='Test Group',
            description='Test Description',
            owner=self.user
        )
        self.owner_membership = GroupMembership.objects.create(
            user=self.user,
            group=self.group,
            role=GroupMembership.ROLE_OWNER
        )
        self.mod_membership = GroupMembership.objects.create(
            user=self.moderator,
            group=self.group,
            role=GroupMembership.ROLE_MODERATOR
        )
        self.member_membership = GroupMembership.objects.create(
            user=self.member,
            group=self.group,
            role=GroupMembership.ROLE_MEMBER
        )

    def test_group_str_representation(self):
        self.assertEqual(str(self.group), 'Test Group')

    def test_get_owner(self):
        owner = self.group.get_owner()
        self.assertEqual(owner.user, self.user)

    def test_get_moderators(self):
        moderators = self.group.get_moderators()
        self.assertEqual(moderators.count(), 1)
        self.assertEqual(moderators.first().user, self.moderator)

    def test_get_members(self):
        members = self.group.get_members()
        self.assertEqual(members.count(), 3)

    def test_transfer_ownership_to_moderator(self):
        self.user.delete()
        self.mod_membership.refresh_from_db()
        self.assertEqual(self.mod_membership.role, GroupMembership.ROLE_OWNER)

    def test_transfer_ownership_to_member(self):
        self.moderator.delete()
        self.user.delete()
        self.member_membership.refresh_from_db()
        self.assertEqual(self.member_membership.role, GroupMembership.ROLE_OWNER)

    def test_delete_group_when_no_owner(self):
        self.moderator.delete()
        self.member.delete()
        self.user.delete()
        with self.assertRaises(Group.DoesNotExist):
            self.group.refresh_from_db()

    def test_group_membership_unique_constraint(self):
        with self.assertRaises(Exception):
            GroupMembership.objects.create(
                user=self.user,
                group=self.group,
                role=GroupMembership.ROLE_MEMBER
            )

    def test_group_membership_roles(self):
        membership = GroupMembership.objects.create(
            user=User.objects.create_user(username='newuser', password='test123'),
            group=self.group
        )
        self.assertEqual(membership.role, GroupMembership.ROLE_MEMBER)
        
    def test_group_membership_alias(self):
        membership = GroupMembership.objects.create(
            user=User.objects.create_user(username='aliasuser', password='test123'),
            group=self.group,
            alias='Test Alias'
        )
        self.assertEqual(membership.alias, 'Test Alias')
