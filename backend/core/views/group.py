from django.http import Http404
from rest_framework.generics import GenericAPIView
from core.serializers import GroupSerializer
from user_auth.serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from core.models import Group
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema

@extend_schema(responses=GroupSerializer(many=True))
class GroupsView(GenericAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = GroupSerializer
    queryset = Group.objects.all()
    
    def get(self, request):
        groups = self.get_queryset().filter(members=request.user)
        serializer = self.get_serializer(groups, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)
        
@extend_schema(responses=GroupSerializer)
class GroupView(GenericAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = GroupSerializer
    queryset = Group.objects.all()
    
    def get_object(self, name):
        group = get_object_or_404(Group, name=name)

        user = self.request.user
        if user in group.members.all():
            return group
        else:
            raise Http404    

    
    def get(self, request, name):
        group = self.get_object(name=name)
        serializer = self.get_serializer(group)
        return Response(serializer.data)
    
    def put(self, request, name):
        group = self.get_queryset().filter(members=request.user).get(name=name)
        if group.owner != request.user and not group.moderators.filter(id=request.user.id).exists():
            return Response({'error': 'You do not have permission to do this.'}, status=403)
        
        serializer = self.get_serializer(group, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)
        
    def delete(self, request, pk):
        group = self.get_queryset().filter(members=request.user).get(pk=pk)
        if group.owner != request.user:
            return Response({'error': 'You do not have permission to do this.'}, status=403)
        
        group.delete()
        return Response(status=204)
    
@extend_schema(responses=UserSerializer(many=True))
class GroupMemberView(GenericAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    
    def get(self, request, group_name):
        group = get_object_or_404(Group, name=group_name, members=request.user)
        users = group.members.all()
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)