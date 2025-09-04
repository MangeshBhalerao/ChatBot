from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func

db = SQLAlchemy()

class Conversation(db.Model):
    __tablename__ = "conversations"
    id = db.Column(db.Integer,primary_key = True)
    title = db.Column(db.String(255),nullable = False)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable = True)
    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now(), nullable = True)

class Message(db.Model):
