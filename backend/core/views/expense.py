from django.shortcuts import render
from django.conf import settings
from rest_framework.generics import GenericAPIView
from core.serializers import ExpenseSerializer
from user_auth.views import CookieJWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from core.models import Expense

def login_view(request):
    redirect_uri = settings.LOGIN_REDIRECT_URL
    return render(request, 'login.html', {'redirect_uri': redirect_uri})

class ExpensesView(GenericAPIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseSerializer
    queryset = Expense.objects.all()
    
    def get(self, request):
        expenses = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(expenses, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)
        
class ExpenseView(GenericAPIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseSerializer
    queryset = Expense.objects.all()
    
    def get(self, request, pk):
        expense = self.get_queryset().filter(user=request.user).get(pk=pk)
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
        
    def delete(self, request, pk):
        expense = self.get_queryset().filter(user=request.user).get(pk=pk)
        expense.delete()
        return Response(status=204)
