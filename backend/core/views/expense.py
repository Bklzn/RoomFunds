from django.http import Http404
from django.shortcuts import get_object_or_404, render
from django.conf import settings
from rest_framework.generics import GenericAPIView
from core.serializers import ExpenseSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from core.models import Expense, Group
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiParameter

def login_view(request):
    redirect_uri = settings.LOGIN_REDIRECT_URL
    return render(request, 'login.html', {'redirect_uri': redirect_uri})

@extend_schema(
    request=ExpenseSerializer,
    responses=ExpenseSerializer(many=True))
class ExpensesView(GenericAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseSerializer
    queryset = Expense.objects.all()
    
    @extend_schema(parameters=[
            OpenApiParameter(name='groupName', description='Group name', required=True, type=str)
    ])
    def get(self, request):
        try:
            group_name = request.GET['groupName']
        except KeyError:
            raise Http404('No groupName provided')
        group = get_object_or_404(Group, name=group_name, members=request.user)
        expenses = self.get_queryset().filter(group=group.id)
        serializer = self.get_serializer(expenses, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)    
@extend_schema(responses=ExpenseSerializer)    
class ExpenseView(GenericAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseSerializer
    queryset = Expense.objects.all()
    
    def get_object(self, pk):
        expense = get_object_or_404(Expense, pk=pk)

        user = self.request.user
        if expense.user == user or user in expense.group.members.all():
            return expense
        else:
            raise Http404    

    def get(self, request, pk):
        expense = self.get_object(pk)
        serializer = self.get_serializer(expense)
        return Response(serializer.data)
    
    def put(self, request, pk):
        expense = self.get_queryset().filter(user=request.user).get(pk=pk)
        serializer = self.get_serializer(expense, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)
        
    @extend_schema(responses={204: OpenApiResponse(description="Successfully deleted")})
    def delete(self, request, pk):
        expense = self.get_queryset().filter(user=request.user).get(pk=pk)
        expense.delete()
        return Response(status=204)
