from flask import Blueprint, request, jsonify
from src.models.lesson import db, Lesson, UserProgress
from datetime import datetime
import json

lessons_bp = Blueprint('lessons', __name__)

@lessons_bp.route('/lessons', methods=['GET'])
def get_lessons():
    """Get all lessons ordered by index"""
    try:
        lessons = Lesson.query.order_by(Lesson.order_index).all()
        return jsonify([lesson.to_dict() for lesson in lessons])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@lessons_bp.route('/lessons/<lesson_id>', methods=['GET'])
def get_lesson(lesson_id):
    """Get a specific lesson"""
    try:
        lesson = Lesson.query.get_or_404(lesson_id)
        return jsonify(lesson.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@lessons_bp.route('/lessons', methods=['POST'])
def create_lesson():
    """Create a new lesson"""
    try:
        data = request.get_json()
        
        lesson = Lesson(
            id=data['id'],
            title=data['title'],
            description=data['description'],
            content=data['content'],
            duration=data['duration'],
            difficulty=data['difficulty'],
            prerequisites=json.dumps(data.get('prerequisites', [])),
            order_index=data['orderIndex']
        )
        
        db.session.add(lesson)
        db.session.commit()
        
        return jsonify(lesson.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@lessons_bp.route('/lessons/<lesson_id>/progress', methods=['POST'])
def update_lesson_progress():
    """Update user progress for a lesson"""
    try:
        data = request.get_json()
        lesson_id = data['lessonId']
        user_id = data.get('userId', 'anonymous')
        progress_percentage = data.get('progressPercentage', 0)
        completed = data.get('completed', False)
        
        # Find existing progress or create new
        progress = UserProgress.query.filter_by(
            user_id=user_id,
            lesson_id=lesson_id
        ).first()
        
        if not progress:
            progress = UserProgress(
                user_id=user_id,
                lesson_id=lesson_id
            )
            db.session.add(progress)
        
        progress.progress_percentage = progress_percentage
        progress.completed = completed
        
        if completed and not progress.completed_at:
            progress.completed_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(progress.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@lessons_bp.route('/users/<user_id>/progress', methods=['GET'])
def get_user_progress(user_id):
    """Get all progress for a user"""
    try:
        progress_records = UserProgress.query.filter_by(user_id=user_id).all()
        return jsonify([progress.to_dict() for progress in progress_records])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@lessons_bp.route('/users/<user_id>/progress/summary', methods=['GET'])
def get_user_progress_summary(user_id):
    """Get progress summary for a user"""
    try:
        total_lessons = Lesson.query.count()
        completed_lessons = UserProgress.query.filter_by(
            user_id=user_id,
            completed=True
        ).count()
        
        progress_records = UserProgress.query.filter_by(user_id=user_id).all()
        total_progress = sum(p.progress_percentage for p in progress_records)
        average_progress = total_progress / max(total_lessons, 1)
        
        return jsonify({
            'totalLessons': total_lessons,
            'completedLessons': completed_lessons,
            'averageProgress': average_progress,
            'completionRate': (completed_lessons / max(total_lessons, 1)) * 100
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

