from django.http import Http404
from rest_framework.generics import GenericAPIView
from core.serializers import CategorySerializer
from user_auth.views import CookieJWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from core.models import Category, Group
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema

@extend_schema(responses=CategorySerializer(many=True))
class CategoriesView(GenericAPIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    
    def get(self, request, group_name):
        group = get_object_or_404(Group, name=group_name, members=request.user)
        categories = self.get_queryset().filter(group=group)
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)
    
    def post(self, request, group_name):
        data = request.data.copy()
        if 'group_name' not in data:
            data['group_name'] = group_name

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)
        