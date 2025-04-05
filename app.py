from main import get_gmail_service, list_recent_emails
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os

app = Flask(__name__)

# ========== Gemini API Setup ==========
genai.configure(api_key='AIzaSyBMssT7uIDYsChKffYE041CBXoDgTPrcgg')  # Make sure to hide this key in production!

# ========== Routes for HTML Pages ==========

@app.route('/')
def home():
    return render_template('dashboard.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

# ========== Gemini API Endpoint ==========

@app.route('/ask-gemini', methods=['POST'])
def ask_gemini():
    try:
        data = request.json
        prompt = data.get('prompt', '')

        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)

        return jsonify({'reply': response.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========== Gmail Emails Display ==========

@app.route('/emails')
def show_emails():
    try:
        service = get_gmail_service()
        tasks = list_recent_emails(service)
        return render_template("emails.html", tasks=tasks)
    except Exception as e:
        return f"Error: {e}"

# ========== Run the Flask App ==========

if __name__ == '__main__':
    app.run(debug=True)
