from flask import Flask, request
from flask_cors import CORS
from models.ai_models import load_model
from models.db import db, Conversation, Message
import torch
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

CORS(app)  # Enable CORS for all routes

print("Loading AI Model...")
tokenizer , model = load_model()
print("AI Model Loaded Successfully")

# Create database tables
with app.app_context():
    db.create_all()
    print("Database tables created successfully")

def generate_ai_response(user_message , conversation_id = None):

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
    input_ids = tokenizer.encode(prompt, return_tensors="pt")
    with torch.no_grad():
        outputs = model.generate(
            input_ids,
            max_length=input_ids.shape[1] + 100,
            num_return_sequences=1,
            temperature=0.7
        )
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    # Extract only the assistant's reply
    if "Assistant:" in response:
        response = response.split("Assistant:")[-1].strip()
    return response


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
    app.run(debug=True)