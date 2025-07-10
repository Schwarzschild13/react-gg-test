from flask import Blueprint, request, jsonify
from src.models.challenge import db, Challenge, ChallengeSubmission
import json
import subprocess
import tempfile
import os
import sys

challenges_bp = Blueprint('challenges', __name__)

@challenges_bp.route('/challenges', methods=['GET'])
def get_challenges():
    """Get all challenges"""
    try:
        challenges = Challenge.query.all()
        return jsonify([challenge.to_dict() for challenge in challenges])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@challenges_bp.route('/challenges/<challenge_id>', methods=['GET'])
def get_challenge(challenge_id):
    """Get a specific challenge"""
    try:
        challenge = Challenge.query.get_or_404(challenge_id)
        return jsonify(challenge.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@challenges_bp.route('/challenges', methods=['POST'])
def create_challenge():
    """Create a new challenge"""
    try:
        data = request.get_json()
        
        challenge = Challenge(
            id=data['id'],
            title=data['title'],
            description=data['description'],
            starter_code=data['starterCode'],
            solution=data['solution'],
            tests=json.dumps(data['tests']),
            hints=json.dumps(data['hints']),
            difficulty=data['difficulty'],
            tags=json.dumps(data['tags'])
        )
        
        db.session.add(challenge)
        db.session.commit()
        
        return jsonify(challenge.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@challenges_bp.route('/challenges/<challenge_id>/submit', methods=['POST'])
def submit_challenge(challenge_id):
    """Submit code for a challenge and run tests"""
    try:
        data = request.get_json()
        user_code = data.get('code', '')
        user_id = data.get('userId', 'anonymous')
        
        challenge = Challenge.query.get_or_404(challenge_id)
        tests = json.loads(challenge.tests)
        
        # Run tests against the submitted code
        test_results = run_code_tests(user_code, tests)
        
        # Check if all tests passed
        all_passed = all(result['passed'] for result in test_results)
        
        # Save submission
        submission = ChallengeSubmission(
            challenge_id=challenge_id,
            user_id=user_id,
            code=user_code,
            passed=all_passed,
            test_results=json.dumps(test_results)
        )
        
        db.session.add(submission)
        db.session.commit()
        
        return jsonify({
            'submissionId': submission.id,
            'passed': all_passed,
            'testResults': test_results,
            'message': 'All tests passed! Great job!' if all_passed else 'Some tests failed. Keep trying!'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def run_code_tests(user_code, tests):
    """Run JavaScript/React code tests in a safe environment"""
    test_results = []
    
    for test in tests:
        try:
            # Create a temporary file with the user's code and test
            with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
                # Write a simple test runner
                test_code = f"""
// User's code
{user_code}

// Test case
try {{
    const testInput = {test.get('input', '{}')};
    const expectedOutput = {test.get('expectedOutput', 'null')};
    
    // Simple evaluation - in a real implementation, you'd use a proper test framework
    let result;
    if (typeof testInput === 'object' && testInput.props) {{
        // For React component tests
        result = eval('(' + testInput.code + ')');
    }} else {{
        // For function tests
        result = eval(testInput);
    }}
    
    const passed = JSON.stringify(result) === JSON.stringify(expectedOutput);
    console.log(JSON.stringify({{
        passed: passed,
        input: testInput,
        expected: expectedOutput,
        actual: result,
        description: "{test.get('description', '')}"
    }}));
}} catch (error) {{
    console.log(JSON.stringify({{
        passed: false,
        input: {test.get('input', '{}')},
        expected: {test.get('expectedOutput', 'null')},
        actual: null,
        error: error.message,
        description: "{test.get('description', '')}"
    }}));
}}
"""
                f.write(test_code)
                f.flush()
                
                # Run the test with Node.js
                try:
                    result = subprocess.run(
                        ['node', f.name],
                        capture_output=True,
                        text=True,
                        timeout=5
                    )
                    
                    if result.stdout:
                        test_result = json.loads(result.stdout.strip())
                        test_results.append(test_result)
                    else:
                        test_results.append({
                            'passed': False,
                            'description': test.get('description', ''),
                            'error': result.stderr or 'No output from test'
                        })
                        
                except subprocess.TimeoutExpired:
                    test_results.append({
                        'passed': False,
                        'description': test.get('description', ''),
                        'error': 'Test timed out'
                    })
                except json.JSONDecodeError:
                    test_results.append({
                        'passed': False,
                        'description': test.get('description', ''),
                        'error': 'Invalid test output'
                    })
                finally:
                    os.unlink(f.name)
                    
        except Exception as e:
            test_results.append({
                'passed': False,
                'description': test.get('description', ''),
                'error': str(e)
            })
    
    return test_results

@challenges_bp.route('/challenges/<challenge_id>/submissions', methods=['GET'])
def get_challenge_submissions(challenge_id):
    """Get submissions for a challenge"""
    try:
        user_id = request.args.get('userId', 'anonymous')
        submissions = ChallengeSubmission.query.filter_by(
            challenge_id=challenge_id,
            user_id=user_id
        ).order_by(ChallengeSubmission.submitted_at.desc()).all()
        
        return jsonify([submission.to_dict() for submission in submissions])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

