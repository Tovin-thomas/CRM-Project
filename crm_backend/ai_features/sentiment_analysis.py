"""
AI Feature 3: Sentiment Analysis for notes and communications.

Uses TextBlob for Natural Language Processing (NLP).
TextBlob provides:
- Polarity: -1.0 (Negative) to +1.0 (Positive)
- Subjectivity: 0.0 (Objective/Factual) to 1.0 (Subjective/Opinion)
"""

from textblob import TextBlob


def analyze_sentiment(text):
    """
    Analyze sentiment of text using TextBlob.
    
    Args:
        text: String to analyze
    
    Returns:
        tuple: (sentiment_label, sentiment_score)
            sentiment_label: 'positive', 'neutral', or 'negative'
            sentiment_score: float from -1 to 1
    """
    # Handle empty input
    if not text or not text.strip():
        return 'neutral', 0.0
    
    # Create TextBlob object for NLP processing
    blob = TextBlob(text)
    
    # Get polarity score (-1 to 1)
    polarity = blob.sentiment.polarity
    
    # Classify sentiment based on polarity thresholds
    # We use a small buffer around 0 (-0.1 to 0.1) for neutral to avoid noise
    if polarity > 0.1:
        sentiment = 'positive'
    elif polarity < -0.1:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
    
    # Round score to 3 decimal places for clean storage
    score = round(polarity, 3)
    
    return sentiment, score


def analyze_sentiment_detailed(text):
    """
    Get detailed sentiment analysis including subjectivity.
    
    Args:
        text: String to analyze
    
    Returns:
        dict: Detailed sentiment information
    """
    if not text or not text.strip():
        return {
            'sentiment': 'neutral',
            'polarity': 0.0,
            'subjectivity': 0.0,
            'classification': 'neutral'
        }
    
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    
    # Classify sentiment
    if polarity > 0.1:
        classification = 'positive'
    elif polarity < -0.1:
        classification = 'negative'
    else:
        classification = 'neutral'
    
    return {
        'sentiment': classification,
        'polarity': round(polarity, 3),
        'subjectivity': round(subjectivity, 3),
        'classification': classification,
        'interpretation': _interpret_sentiment(polarity, subjectivity)
    }


def _interpret_sentiment(polarity, subjectivity):
    """
    Provide human-readable interpretation of sentiment.
    """
    pol_desc = 'positive' if polarity > 0.1 else 'negative' if polarity < -0.1 else 'neutral'
    sub_desc = 'highly subjective' if subjectivity > 0.6 else 'somewhat subjective' if subjectivity > 0.3 else 'factual'
    
    return f"The text is {pol_desc} and {sub_desc}."


# Example usage:
# sentiment, score = analyze_sentiment("This product is amazing! I love it!")
# Returns: ('positive', 0.75)
#
# sentiment, score = analyze_sentiment("The meeting was okay, nothing special.")
# Returns: ('neutral', 0.1)
#
# sentiment, score = analyze_sentiment("Very disappointed with the service.")
# Returns: ('negative', -0.6)


# Alternative: Using HuggingFace transformers (commented for reference):
"""
from transformers import pipeline

# Load sentiment analysis pipeline
sentiment_analyzer = pipeline("sentiment-analysis")

def analyze_sentiment_with_transformers(text):
    result = sentiment_analyzer(text)[0]
    
    label = result['label'].lower()  # 'positive' or 'negative'
    score = result['score']  # confidence 0-1
    
    # Convert to our format
    if label == 'positive':
        sentiment_score = score
    else:
        sentiment_score = -score
    
    return label, round(sentiment_score, 3)
"""
