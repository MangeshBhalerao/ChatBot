from flask import Flask, request
from flask_cors import CORS
from models.db import db, Conversation, Message
import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

CORS(app)  # Enable CORS for all routes

# Initialize Groq client
groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))

print("Groq AI client initialized successfully")

# Create database tables
with app.app_context():
    db.create_all()
    print("Database tables created successfully")

def generate_ai_response(user_message, conversation_id=None):
    context = ""
    if conversation_id:
        recent_messages = Message.query.filter_by(conversation_id=conversation_id)\
            .order_by(Message.created_at.desc())\
            .limit(6)\
            .all()
        for msg in reversed(recent_messages):  # oldest first
            if msg.role == "user":
                context += f"Human: {msg.content}\n"
            else:
                context += f"Assistant: {msg.content}\n"
    
    prompt = f"""You are a helpful AI assistant. Be friendly and be helpful.
{context}Human: {user_message}
Assistant:"""
    
    try:
        # Use Groq API for AI response
        completion = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",  # Current available model
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant. Be friendly and helpful."},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=200
        )
        
        response = completion.choices[0].message.content
        return response
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return "Sorry, I'm having trouble responding right now. Please try again."


@app.route("/")
def Home():
    return 'Hello this is home'

@app.route("/chat", methods=["POST"])
def chat():
    if request.method == "POST":
        user_message = request.json.get('message')
        conversation_id = request.json.get('conversation_id')
        
        # Get or create conversation
        if conversation_id:
            conversation = Conversation.query.get(conversation_id)
            if not conversation:
                return {"error": "Conversation not found"}, 404
        else:
            # Create new conversation
            conversation = Conversation(title="New Chat")
            db.session.add(conversation)
            db.session.commit()
        
        # Save user message
        user_msg = Message(
            conversation_id=conversation.id,
            role='user',
            content=user_message
        )
        db.session.add(user_msg)
        # Generate AI response using conversation context
        ai_response = generate_ai_response(user_message, conversation.id)
        # Save AI response
        ai_msg = Message(
            conversation_id=conversation.id,
            role='assistant',
            content=ai_response
        )
        db.session.add(ai_msg)
        db.session.commit()
        return {
            "response": ai_response,
            "conversation_id": conversation.id
        }
    

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)