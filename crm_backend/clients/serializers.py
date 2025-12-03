from rest_framework import serializers
from .models import Client, ClientProject, ClientInteraction
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class ClientProjectSerializer(serializers.ModelSerializer):
    project_manager_name = serializers.CharField(source='project_manager.get_full_name', read_only=True)
    
    class Meta:
        model = ClientProject
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ClientInteractionSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = ClientInteraction
        fields = '__all__'
        read_only_fields = ['created_at']


class ClientSerializer(serializers.ModelSerializer):
    account_manager_name = serializers.CharField(source='account_manager.get_full_name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    contract_duration_days = serializers.IntegerField(read_only=True)
    projects = ClientProjectSerializer(many=True, read_only=True)
    interactions = ClientInteractionSerializer(many=True, read_only=True)
    project_count = serializers.SerializerMethodField()
    total_project_value = serializers.SerializerMethodField()
    
    class Meta:
        model = Client
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'created_by']
    
    def get_project_count(self, obj):
        return obj.projects.count()
    
    def get_total_project_value(self, obj):
        total = sum(project.budget or 0 for project in obj.projects.all())
        return float(total)


class ClientListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    account_manager_name = serializers.CharField(source='account_manager.get_full_name', read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    project_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Client
        fields = [
            'id', 'company_name', 'contact_person', 'email', 'phone',
            'status', 'industry_type', 'contract_start_date', 'contract_end_date',
            'contract_value', 'account_manager', 'account_manager_name',
            'is_active', 'project_count', 'created_at', 'updated_at'
        ]
    
    def get_project_count(self, obj):
        return obj.projects.count()
