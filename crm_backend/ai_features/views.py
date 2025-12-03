"""
API views for AI features.
Exposes endpoints for all 4 AI capabilities:
1. Lead Scoring
2. Email Generation
3. Sentiment Analysis
4. Lead Categorization
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .lead_scoring import calculate_lead_score
from .email_generator import generate_email
from .sentiment_analysis import analyze_sentiment, analyze_sentiment_detailed
from .categorization import categorize_lead, get_category_details


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def score_lead_view(request):
    """
    Calculate AI score for a lead.
    
    Endpoint: POST /api/ai/score-lead/
    Payload: { "lead_id": 123 }
    """
    from leads.models import Lead
    
    lead_id = request.data.get('lead_id')
    if not lead_id:
        return Response({'error': 'lead_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        lead = Lead.objects.get(id=lead_id)
    except Lead.DoesNotExist:
        return Response({'error': 'Lead not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Calculate score
    score = calculate_lead_score(lead)
    
    # Update lead
    lead.score = score
    lead.save()
    
    return Response({
        'lead_id': lead.id,
        'lead_name': lead.name,
        'score': score,
        'message': 'Lead score calculated successfully'
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_email_view(request):
    """
    Generate AI email based on template.
    
    Endpoint: POST /api/ai/generate-email/
    Payload: {
        "email_type": "cold_outreach",
        "context": {
            "contact_name": "John",
            "company_name": "Acme",
            ...
        }
    }
    """
    email_type = request.data.get('email_type')
    context = request.data.get('context', {})
    
    if not email_type:
        return Response({'error': 'email_type is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Generate email
    result = generate_email(email_type, context)
    
    if 'error' in result:
        return Response(result, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(result)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_sentiment_view(request):
    """
    Analyze sentiment of text.
    
    Endpoint: POST /api/ai/analyze-sentiment/
    Payload: { "text": "I love this product", "detailed": true }
    """
    text = request.data.get('text', '')
    detailed = request.data.get('detailed', False)
    
    if not text.strip():
        return Response({'error': 'text is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if detailed:
        result = analyze_sentiment_detailed(text)
    else:
        sentiment, score = analyze_sentiment(text)
        result = {
            'sentiment': sentiment,
            'score': score
        }
    
    return Response(result)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def categorize_lead_view(request):
    """
    Categorize a lead as Hot/Warm/Cold.
    
    Endpoint: POST /api/ai/categorize-lead/
    Payload: { "lead_id": 123 }
    """
    from leads.models import Lead
    
    lead_id = request.data.get('lead_id')
    if not lead_id:
        return Response({'error': 'lead_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        lead = Lead.objects.get(id=lead_id)
    except Lead.DoesNotExist:
        return Response({'error': 'Lead not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Calculate category
    category = categorize_lead(lead)
    category_details = get_category_details(category)
    
    # Update lead
    lead.category = category
    lead.save()
    
    return Response({
        'lead_id': lead.id,
        'lead_name': lead.name,
        'category': category,
        'details': category_details,
        'message': 'Lead categorized successfully'
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_all_ai_fields(request):
    """
    Update both score and category for a lead.
    Useful when lead details change significantly.
    
    Endpoint: POST /api/ai/update-all/
    Payload: { "lead_id": 123 }
    """
    from leads.models import Lead
    
    lead_id = request.data.get('lead_id')
    if not lead_id:
        return Response({'error': 'lead_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        lead = Lead.objects.get(id=lead_id)
    except Lead.DoesNotExist:
        return Response({'error': 'Lead not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Calculate both score and category
    score = calculate_lead_score(lead)
    category = categorize_lead(lead)
    
    # Update lead
    lead.score = score
    lead.category = category
    lead.save()
    
    return Response({
        'lead_id': lead.id,
        'lead_name': lead.name,
        'score': score,
        'category': category,
        'category_details': get_category_details(category),
        'message': 'All AI fields updated successfully'
    })
