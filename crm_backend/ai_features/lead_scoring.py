"""
AI Feature 1: Lead Scoring using simple ML algorithm.

This module calculates a lead score (0-100) based on various factors:
- Lead source quality (e.g., Referrals > Cold Calls)
- Status progression (e.g., Qualified > New)
- Company presence (Company name, website)
- Contact information completeness (Phone, Email)
- Engagement (Number of contacts, deals)

In a real application, this would use a trained ML model (Random Forest/Logistic Regression).
For simplicity, we use a weighted scoring system that's easy to understand and modify.
"""


def calculate_lead_score(lead):
    """
    Calculate lead score based on lead attributes.
    Returns a score from 0-100.
    
    Scoring Logic:
    1. Source Quality (0-25 pts): Where did the lead come from?
    2. Status (0-30 pts): How far along the pipeline are they?
    3. Data Completeness (0-25 pts): Do we have enough info?
    4. Engagement (0-20 pts): Are we interacting with them?
    
    Args:
        lead: Lead model instance
    
    Returns:
        int: Score from 0 to 100
    """
    score = 0
    
    # 1. Source quality (0-25 points)
    # Higher quality sources get more points
    source_scores = {
        'referral': 25,       # High trust
        'website': 20,        # Inbound interest
        'social_media': 15,   # Moderate interest
        'email_campaign': 15, # Outbound response
        'cold_call': 10,      # Low initial trust
        'other': 5,
    }
    score += source_scores.get(lead.source, 0)
    
    # 2. Status progression (0-30 points)
    # Further down the funnel = higher score
    status_scores = {
        'converted': 30,
        'qualified': 25,
        'contacted': 15,
        'new': 5,
        'lost': 0,
    }
    score += status_scores.get(lead.status, 0)
    
    # 3. Information completeness (0-25 points)
    # More info = better lead quality
    if lead.company:
        score += 10
    if lead.phone:
        score += 8
    if lead.website:
        score += 7
    
    # 4. Has contacts (0-10 points)
    # Indicates active engagement with people at the company
    contact_count = lead.contacts.count() if hasattr(lead, 'contacts') else 0
    score += min(contact_count * 5, 10) # Cap at 10 points (2 contacts)
    
    # 5. Activity engagement (0-10 points)
    # Check if lead has associated deals
    deal_count = lead.deals.count() if hasattr(lead, 'deals') else 0
    score += min(deal_count * 5, 10) # Cap at 10 points (2 deals)
    
    # Ensure score is strictly between 0 and 100
    return min(max(score, 0), 100)


# Example of how a trained ML model would work (commented out for simplicity):
"""
import pickle
from sklearn.ensemble import RandomForestClassifier

def train_lead_scoring_model(training_data):
    # This would be called periodically with historical data
    # Features: source, status, has_company, has_phone, has_website, days_old
    # Target: whether lead converted or not
    
    model = RandomForestClassifier(n_estimators=100)
    X = training_data[['source_encoded', 'status_encoded', 'has_company', 'has_phone', 'has_website', 'days_old']]
    y = training_data['converted']
    
    model.fit(X, y)
    
    # Save model
    with open('lead_score_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    return model

def calculate_lead_score_with_ml(lead):
    # Load trained model
    with open('lead_score_model.pkl', 'rb') as f:
        model = pickle.load(f)
    
    # Prepare features
    features = prepare_lead_features(lead)
    
    # Predict probability of conversion (0-1)
    probability = model.predict_proba([features])[0][1]
    
    # Convert to 0-100 score
    return int(probability * 100)
"""
