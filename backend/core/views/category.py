from django.http import Http404
from rest_framework.generics import GenericAPIView
from core.serializers import CategorySerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from core.models import Category, Group
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema

@extend_schema(responses=CategorySerializer(many=True))
class CategoriesView(GenericAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    
    def get(self, request, slug):
        group = get_object_or_404(Group, slug=slug, members=request.user)
        categories = self.get_queryset().filter(group=group)
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)
    
    def post(self, request, slug):
        group = get_object_or_404(Group, slug=slug, members=request.user)
        serializer = self.get_serializer(data=request.data, context={'request': request, 'group': group})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)
        