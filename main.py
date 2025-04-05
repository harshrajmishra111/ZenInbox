import os.path
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import base64
from datetime import datetime, timedelta, UTC
import dateutil.parser as parser
import google.generativeai as genai
import re  # For basic URL extraction as a fallback

# Gmail API scopes
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

# Gemini API setup
GEMINI_API_KEY = "AIzaSyBMssT7uIDYsChKffYE041CBXoDgTPrcgg"  
genai.configure(api_key=GEMINI_API_KEY)

def get_gmail_service():
    """Set up Gmail API service with OAuth authentication."""
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    service = build('gmail', 'v1', credentials=creds)
    return service

def extract_info_with_gemini(email_content):
    """Use Gemini API (gemini-2.0-flash) to extract event type, subject, deadline, score, and registration link."""
    prompt = f"""
    Extract the following details from this email content:
    1. Type of event (e.g., assignment, registration, exam, workshop, etc.)
    2. Subject or title of the event
    3. Deadline (could be in formats like 'today', 'tomorrow', '13/03/2025', 'Friday 5 PM', etc.)
    4. Score/marks (if mentioned, e.g., '10 marks', 'worth 20 points')
    5. Registration link (any URL related to registration for an event or workshop, if present)
    
    Email content: "{email_content}"
    
    Return the result in this format:
    Event Type: <type>
    Subject: <subject>
    Deadline: <deadline>
    Score: <score or 'Not mentioned'>
    Registration Link: <link or 'Not mentioned'>
    """
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content(prompt)
    return response.text

def parse_deadline(deadline_str):
    """Convert deadline string into a UTC-aware datetime object."""
    now = datetime.now(UTC)  # UTC-aware
    deadline_str = deadline_str.lower().strip()

    # Handle relative terms
    if "today" in deadline_str:
        return now.replace(hour=23, minute=59, second=0, microsecond=0)
    elif "tomorrow" in deadline_str:
        return (now + timedelta(days=1)).replace(hour=23, minute=59, second=0, microsecond=0)

    # Enhanced parsing for complex formats
    try:
        # Remove extra text in parentheses or after 'by'
        cleaned_deadline = deadline_str.split('(')[0].split('by')[-1].strip()
        # Parse the cleaned deadline, assume UTC if no timezone specified
        parsed_date = parser.parse(cleaned_deadline, dayfirst=False, fuzzy=True)
        # Make it UTC-aware if it’s naive
        if parsed_date.tzinfo is None:
            parsed_date = parsed_date.replace(tzinfo=UTC)
        # If no time is specified, default to 23:59 UTC
        if parsed_date.hour == 0 and parsed_date.minute == 0:
            return parsed_date.replace(hour=23, minute=59, second=0, microsecond=0)
        return parsed_date
    except ValueError:
        print(f"Could not parse deadline '{deadline_str}', defaulting to tomorrow EOD (UTC).")
        return (now + timedelta(days=1)).replace(hour=23, minute=59, second=0, microsecond=0, tzinfo=UTC)

def categorize_by_time_left(deadline):
    """Categorize tasks based on time left until deadline."""
    now = datetime.now(UTC)  
    time_left = deadline - now
    
    if time_left <= timedelta(hours=24):
        return "🔴 Urgent"
    elif time_left <= timedelta(days=2):
        return "🟡 Important"
    else:
        return "⚪ Later"

def list_recent_emails(service, user_id='me', from_email='ziyafatima0705@gmail.com'):
    """Fetch recent emails and extract task details using Gemini."""
    # Fetch messages from the last 7 days
    now = datetime.now(UTC)  
    after_date = now - timedelta(days=7)
    query = f'after:{after_date.strftime("%Y/%m/%d")} from:{from_email}'

    results = service.users().messages().list(userId=user_id, q=query).execute()
    messages = results.get('messages', [])

    if not messages:
        print("No messages found.")
        return []

    email_tasks = []
    for message in messages:
        msg = service.users().messages().get(userId=user_id, id=message['id'], format='full').execute()
        headers = msg['payload']['headers']
        subject = next((header['value'] for header in headers if header['name'] == 'Subject'), "No Subject")
        date_received = next((header['value'] for header in headers if header['name'] == 'Date'), "No Date")
        
        # Get email body 
        snippet = msg.get('snippet', '')
        if 'parts' in msg['payload']:
            for part in msg['payload']['parts']:
                if part['mimeType'] == 'text/plain':
                    body = base64.urlsafe_b64decode(part['body']['data']).decode('utf-8')
                    break
            else:
                body = snippet
        else:
            body = snippet

        # Use Gemini to extract info
        gemini_result = extract_info_with_gemini(body)
        lines = gemini_result.split('\n')
        event_type = lines[0].replace("Event Type: ", "").strip()
        subject = lines[1].replace("Subject: ", "").strip()
        deadline_str = lines[2].replace("Deadline: ", "").strip()
        score = lines[3].replace("Score: ", "").strip()
        reg_link = lines[4].replace("Registration Link: ", "").strip() if len(lines) > 4 else "Not mentioned"

        # Parse deadline into datetime
        deadline = parse_deadline(deadline_str)
        priority = categorize_by_time_left(deadline)

        email_tasks.append({
            "event_type": event_type,
            "subject": subject,
            "deadline": deadline,
            "score": score,
            "priority": priority,
            "registration_link": reg_link
        })

    # Sort by deadline
    email_tasks.sort(key=lambda x: x["deadline"])
    return email_tasks

def display_tasks(tasks):
    """Display the prioritized task list with registration links."""
    print("\n=== Prioritized Task List ===")
    for task in tasks:
        print(f"{task['priority']} | {task['event_type']} | Subject: {task['subject']}")
        print(f"   Deadline: {task['deadline'].strftime('%Y-%m-%d %H:%M %Z')}")
        print(f"   Score: {task['score']}")
        print(f"   Registration Link: {task['registration_link']}\n")

#if __name__ == '__main__':

    #service = get_gmail_service()
    #tasks = list_recent_emails(service)
    #display_tasks(tasks)