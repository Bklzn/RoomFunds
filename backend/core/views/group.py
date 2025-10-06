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
import logging

logger = logging.getLogger(__name__)

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
    
    @extend_schema(responses=GroupSerializer)
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
    
    def get_object(self, slug):
        group = get_object_or_404(Group, slug=slug)

        user = self.request.user
        if user in group.members.all():
            return group
        else:
            raise Http404    

    
    def get(self, request, slug):
        group = self.get_object(slug=slug)
        serializer = self.get_serializer(group)
        return Response(serializer.data)
    
    def put(self, request, slug):
        group = self.get_queryset().filter(members=request.user).get(slug=slug)
        if group.owner != request.user and not group.get_moderators().filter(user=request.user).exists():
            return Response({'error': 'You do not have permission to do this.'}, status=403)
        
        serializer = self.get_serializer(group, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)
        
    def delete(self, request, slug):
        try:
            group = self.get_queryset().filter(members=request.user).get(slug=slug)
        except Group.DoesNotExist:
            return Response({'error': 'You do not have permission to do this.'}, status=403)
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
    
    def get(self, request, slug):
        group = get_object_or_404(Group, slug=slug, members=request.user)
        users = group.members.all()
        serializer = self.get_serializer(users, many=True, context={"group": group})
        return Response(serializer.data)