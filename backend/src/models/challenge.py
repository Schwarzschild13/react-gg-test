from src.models.user import db
from datetime import datetime
import json

class Challenge(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    starter_code = db.Column(db.Text, nullable=False)
    solution = db.Column(db.Text, nullable=False)
    tests = db.Column(db.Text, nullable=False)  # JSON string
    hints = db.Column(db.Text, nullable=False)  # JSON string
    difficulty = db.Column(db.String(20), nullable=False)  # easy, medium, hard
    tags = db.Column(db.Text, nullable=False)  # JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'starterCode': self.starter_code,
            'solution': self.solution,
            'tests': json.loads(self.tests) if self.tests else [],
            'hints': json.loads(self.hints) if self.hints else [],
            'difficulty': self.difficulty,
            'tags': json.loads(self.tags) if self.tags else [],
            'createdAt': self.created_at.isoformat()
        }

class ChallengeSubmission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    challenge_id = db.Column(db.String(50), db.ForeignKey('challenge.id'), nullable=False)
    user_id = db.Column(db.String(50), nullable=False)
    code = db.Column(db.Text, nullable=False)
    passed = db.Column(db.Boolean, nullable=False)
    test_results = db.Column(db.Text, nullable=False)  # JSON string
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'challengeId': self.challenge_id,
            'userId': self.user_id,
            'code': self.code,
            'passed': self.passed,
            'testResults': json.loads(self.test_results) if self.test_results else [],
            'submittedAt': self.submitted_at.isoformat()
        }

