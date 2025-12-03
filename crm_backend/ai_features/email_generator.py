"""
AI Feature 2: AI Email Generator.

This module generates professional emails for sales communication.
It uses a template-based system with variable substitution to ensure high-quality,
safe output without the unpredictability of raw LLM generation.

Future Enhancement:
In production, this could be connected to OpenAI/Anthropic APIs for more dynamic generation,
but templates are often preferred in regulated industries for compliance.
"""


# Email templates for different purposes
# These serve as the base for generation
EMAIL_TEMPLATES = {
    'cold_outreach': {
        'subject': 'Quick question about {company_name}',
        'body': '''Hi {contact_name},

I hope this email finds you well. I came across {company_name} and was impressed by your work in the industry.

I wanted to reach out because I believe we could help you {value_proposition}. Many companies similar to yours have seen significant improvements in {benefit_area}.

Would you be open to a brief 15-minute call next week to explore if this could be valuable for {company_name}?

Looking forward to hearing from you.

Best regards,
{sender_name}'''
    },
    
    'follow_up': {
        'subject': 'Following up on our conversation',
        'body': '''Hi {contact_name},

I wanted to follow up on our recent conversation about {topic}.

I've prepared some additional information that I think you'll find valuable. {additional_info}

When would be a good time for a quick call to discuss the next steps?

Best regards,
{sender_name}'''
    },
    
    'proposal': {
        'subject': 'Proposal for {company_name}',
        'body': '''Hi {contact_name},

Thank you for your interest in our services. I'm excited to share how we can help {company_name} achieve {goals}.

Based on our discussion, I've outlined a customized proposal that addresses your specific needs:

{proposal_points}

I'd love to schedule a call to walk through this proposal and answer any questions you might have.

Best regards,
{sender_name}'''
    },
    
    'thank_you': {
        'subject': 'Thank you for your time',
        'body': '''Hi {contact_name},

Thank you for taking the time to speak with me today. I really enjoyed learning more about {company_name} and your goals for {area}.

As discussed, I'll {next_steps}.

Please don't hesitate to reach out if you have any questions in the meantime.

Best regards,
{sender_name}'''
    },
}


def generate_email(email_type, context):
    """
    Generate a professional email based on type and context.
    
    Args:
        email_type: Type of email ('cold_outreach', 'follow_up', 'proposal', 'thank_you')
        context: Dictionary with variables for template substitution.
                 Must include keys required by the specific template.
                 e.g., {'contact_name': 'John', 'company_name': 'Acme Inc', ...}
    
    Returns:
        dict: {'subject': str, 'body': str, 'email_type': str}
              OR {'error': str, ...} if validation fails
    """
    # Validate email type
    if email_type not in EMAIL_TEMPLATES:
        return {
            'error': f'Unknown email type: {email_type}',
            'available_types': list(EMAIL_TEMPLATES.keys())
        }
    
    template = EMAIL_TEMPLATES[email_type]
    
    try:
        # Perform variable substitution safely
        subject = template['subject'].format(**context)
        body = template['body'].format(**context)
        
        return {
            'subject': subject,
            'body': body,
            'email_type': email_type
        }
    except KeyError as e:
        # Handle missing variables gracefully
        return {
            'error': f'Missing required context variable: {str(e)}',
            'required_variables': _extract_variables(template['subject'] + template['body'])
        }


def _extract_variables(template_string):
    """
    Helper to extract variable names from template string for error reporting.
    Finds all {variable_name} patterns.
    """
    import re
    return list(set(re.findall(r'\{(\w+)\}', template_string)))


# Example of how to use with OpenAI GPT API (commented for reference):
"""
import openai

def generate_email_with_gpt(email_type, context):
    # Set your API key
    openai.api_key = 'your-api-key-here'
    
    prompt = f'''
    Generate a professional {email_type} email with the following context:
    
    Contact Name: {context.get('contact_name', 'N/A')}
    Company: {context.get('company_name', 'N/A')}
    Purpose: {context.get('purpose', 'N/A')}
    
    The email should be concise, professional, and personalized.
    '''
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a professional sales email writer."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500,
        temperature=0.7,
    )
    
    generated_email = response.choices[0].message.content
    
    # Parse subject and body
    lines = generated_email.split('\n')
    subject = lines[0].replace('Subject:', '').strip()
    body = '\n'.join(lines[2:]).strip()
    
    return {
        'subject': subject,
        'body': body,
        'email_type': email_type
    }
"""
