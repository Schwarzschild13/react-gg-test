from src.models.user import db
from datetime import datetime
import json

class Lesson(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    duration = db.Column(db.Integer, nullable=False)  # in minutes
    difficulty = db.Column(db.String(20), nullable=False)  # beginner, intermediate, advanced
    prerequisites = db.Column(db.Text, nullable=False)  # JSON string
    order_index = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'content': self.content,
            'duration': self.duration,
            'difficulty': self.difficulty,
            'prerequisites': json.loads(self.prerequisites) if self.prerequisites else [],
            'orderIndex': self.order_index,
            'createdAt': self.created_at.isoformat()
        }

class UserProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)
    lesson_id = db.Column(db.String(50), db.ForeignKey('lesson.id'), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    progress_percentage = db.Column(db.Integer, default=0)
    completed_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'lessonId': self.lesson_id,
            'completed': self.completed,
            'progressPercentage': self.progress_percentage,
            'completedAt': self.completed_at.isoformat() if self.completed_at else None
        }

