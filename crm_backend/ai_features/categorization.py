"""
AI Feature 4: Smart Lead Categorization (Hot/Warm/Cold).

Categorizes leads based on various signals:
- Lead Score (primary factor)
- Urgency (based on status)
- Engagement (interactions)

In production, this would use a Naive Bayes classifier or similar ML model.
For simplicity, we use a rule-based scoring system that aggregates these signals.
"""


def categorize_lead(lead):
    """
    Categorize a lead as Hot, Warm, or Cold.
    
    Categories:
    - Hot: High potential, immediate action needed (score >= 70)
    - Warm: Good potential, follow up soon (score >= 40)
    - Cold: Low potential, nurture over time (score < 40)
    
    Algorithm:
    Weighted average of:
    - Base Lead Score (50% weight)
    - Urgency Score (30% weight)
    - Engagement Score (20% weight)
    
    Args:
        lead: Lead model instance
    
    Returns:
        str: 'hot', 'warm', or 'cold'
    """
    # Use the lead score we already calculated (or 0 if missing)
    score = lead.score if hasattr(lead, 'score') and lead.score else 0
    
    # Additional factors for categorization
    urgency_score = _calculate_urgency(lead)
    engagement_score = _calculate_engagement(lead)
    
    # Weighted final score calculation
    # We prioritize the base score but boost it with urgency and engagement
    final_score = (score * 0.5) + (urgency_score * 0.3) + (engagement_score * 0.2)
    
    # Categorize based on final weighted score thresholds
    if final_score >= 70:
        return 'hot'
    elif final_score >= 40:
        return 'warm'
    else:
        return 'cold'


def _calculate_urgency(lead):
    """
    Calculate urgency score based on lead status and recent activity.
    Returns score from 0-100.
    """
    score = 0
    
    # Status-based urgency
    status_urgency = {
        'qualified': 100,
        'contacted': 70,
        'new': 40,
        'lost': 0,
        'converted': 0,
    }
    score += status_urgency.get(lead.status, 30)
    
    return score


def _calculate_engagement(lead):
    """
    Calculate engagement score based on interactions.
    Returns score from 0-100.
    """
    score = 0
    
    # Check for contacts
    if hasattr(lead, 'contacts'):
        contact_count = lead.contacts.count()
        score += min(contact_count * 20, 40)  # Up to 40 points
    
    # Check for deals
    if hasattr(lead, 'deals'):
        deal_count = lead.deals.count()
        score += min(deal_count * 30, 60)  # Up to 60 points
    
    return min(score, 100)


def get_category_details(category):
    """
    Get recommended actions for each category.
    
    Args:
        category: 'hot', 'warm', or 'cold'
    
    Returns:
        dict: Category details and recommendations
    """
    categories = {
        'hot': {
            'priority': 'High',
            'color': '#ff4444',
            'icon': '🔥',
            'description': 'High potential lead - immediate action required',
            'recommended_actions': [
                'Schedule a call within 24 hours',
                'Send personalized proposal',
                'Assign to senior sales rep',
                'Set up product demo'
            ]
        },
        'warm': {
            'priority': 'Medium',
            'color': '#ff9800',
            'icon': '☀️',
            'description': 'Good potential - follow up within a week',
            'recommended_actions': [
                'Send follow-up email',
                'Share case studies',
                'Schedule discovery call',
                'Add to nurture campaign'
            ]
        },
        'cold': {
            'priority': 'Low',
            'color': '#2196f3',
            'icon': '❄️',
            'description': 'Low immediate potential - long-term nurture',
            'recommended_actions': [
                'Add to email nurture sequence',
                'Share educational content',
                'Follow up in 2-4 weeks',
                'Monitor for engagement signals'
            ]
        }
    }
    
    return categories.get(category, categories['cold'])


# Example of Naive Bayes classification (commented for reference):
"""
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
import pickle

def train_categorization_model(training_data):
    # Features could include:
    # - Source type
    # - Industry keywords
    # - Company size indicators
    # - Engagement metrics
    
    # Prepare training data
    X = training_data[['source_encoded', 'has_company', 'contact_count', 'deal_count', 'days_since_contact']]
    y = training_data['category']  # 'hot', 'warm', 'cold'
    
    # Train Naive Bayes model
    model = MultinomialNB()
    model.fit(X, y)
    
    # Save model
    with open('category_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    return model

def categorize_lead_with_ml(lead):
    # Load model
    with open('category_model.pkl', 'rb') as f:
        model = pickle.load(f)
    
    # Prepare features
    features = prepare_category_features(lead)
    
    # Predict category
    category = model.predict([features])[0]
    
    return category
"""
