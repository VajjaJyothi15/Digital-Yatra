import secrets
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database.db import get_db
from utils.validators import validate_email, validate_password

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Temporary in-memory store for password reset tokens
reset_tokens = {}

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')
    role = data.get('role', 'TOURIST').upper()
    interests = data.get('interests', '')
    budget_preference = data.get('budget_preference', 'Medium')

    # Guide specific optional registration fields
    city = data.get('city', 'Goa')
    languages = data.get('languages', 'Hindi, English')
    specialization = data.get('specialization', 'Heritage & Culture')
    price_per_day = float(data.get('price_per_day') or data.get('price') or 800.0)
    phone = data.get('phone', '')
    experience = data.get('experience', '3 years')

    if not name:
        return jsonify({"success": False, "message": "Full name is required."}), 400
    if not validate_email(email):
        return jsonify({"success": False, "message": "Please provide a valid email address."}), 400
    if not validate_password(password):
        return jsonify({"success": False, "message": "Password must be at least 6 characters long."}), 400

    db = get_db()
    existing = db.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
    if existing:
        return jsonify({"success": False, "message": "An account with this email already exists."}), 400

    password_hash = generate_password_hash(password)
    cursor = db.cursor()

    cursor.execute(
        "INSERT INTO users (name, email, password_hash, role, interests, budget_preference) VALUES (?, ?, ?, ?, ?, ?)",
        (name, email, password_hash, role, interests, budget_preference)
    )
    user_id = cursor.lastrowid

    # If guide account, create guide profile with PENDING verification status
    if role == 'GUIDE':
        bio_text = f"Phone: {phone}. Experience: {experience}" if phone else f"Experience: {experience}"
        cursor.execute(
            """INSERT INTO guides (user_id, name, city, languages, specialization, price_per_day, bio, verification_status)
               VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')""",
            (user_id, name, city, languages, specialization, price_per_day, bio_text)
        )

    db.commit()

    user = {
        "id": user_id,
        "name": name,
        "email": email,
        "role": role,
        "interests": interests,
        "budget_preference": budget_preference
    }

    return jsonify({
        "success": True,
        "message": "User registered successfully!",
        "user": user
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required."}), 400

    db = get_db()
    user_row = db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()

    if not user_row or not check_password_hash(user_row['password_hash'], password):
        return jsonify({"success": False, "message": "Invalid email or password."}), 401

    user = {
        "id": user_row['id'],
        "name": user_row['name'],
        "email": user_row['email'],
        "role": user_row['role'] or 'TOURIST',
        "interests": user_row['interests'],
        "budget_preference": user_row['budget_preference']
    }

    return jsonify({
        "success": True,
        "message": "Login successful!",
        "user": user
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    email = data.get('email', '').strip()

    if not validate_email(email):
        return jsonify({"success": False, "message": "Please enter a valid registered email address."}), 400

    db = get_db()
    user_row = db.execute("SELECT id, name FROM users WHERE email = ?", (email,)).fetchone()

    if not user_row:
        return jsonify({"success": False, "message": "No account found with this email address."}), 44

    token = secrets.token_hex(16)
    reset_tokens[token] = email

    return jsonify({
        "success": True,
        "message": f"Password reset instructions and verification code generated for {email}.",
        "reset_token": token
    })

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json() or {}
    token = data.get('token', '').strip()
    email = data.get('email', '').strip()
    new_password = data.get('new_password', '')

    if not validate_password(new_password):
        return jsonify({"success": False, "message": "New password must be at least 6 characters long."}), 400

    db = get_db()
    
    # Validate via token or direct email match
    if token and token in reset_tokens:
        target_email = reset_tokens[token]
        del reset_tokens[token]
    elif email:
        target_email = email
    else:
        return jsonify({"success": False, "message": "Invalid or expired reset token."}), 400

    user_row = db.execute("SELECT id FROM users WHERE email = ?", (target_email,)).fetchone()
    if not user_row:
        return jsonify({"success": False, "message": "User not found."}), 404

    new_hash = generate_password_hash(new_password)
    db.execute("UPDATE users SET password_hash = ? WHERE email = ?", (new_hash, target_email))
    db.commit()

    return jsonify({
        "success": True,
        "message": "Password reset successfully! You can now log in with your new password."
    })

@auth_bp.route('/google', methods=['POST'])
def google_auth():
    data = request.get_json() or {}
    email = data.get('email', '').strip()
    name = data.get('name', '').strip() or 'Google User'
    role = data.get('role', 'TOURIST').upper()

    if not email or not validate_email(email):
        return jsonify({"success": False, "message": "Valid email address required from Google Auth."}), 400

    db = get_db()
    user_row = db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()

    if not user_row:
        # Register new Google user automatically
        random_pwd = secrets.token_hex(12)
        pwd_hash = generate_password_hash(random_pwd)
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
            (name, email, pwd_hash, role)
        )
        db.commit()
        user_id = cursor.lastrowid
        user_role = role
    else:
        user_id = user_row['id']
        name = user_row['name']
        user_role = user_row['role'] or 'TOURIST'

    user = {
        "id": user_id,
        "name": name,
        "email": email,
        "role": user_role
    }

    return jsonify({
        "success": True,
        "message": "Google Authentication Successful!",
        "user": user
    })

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    email = request.args.get('email')
    if not email:
        return jsonify({"success": False, "message": "Email parameter required."}), 400

    db = get_db()
    user_row = db.execute("SELECT id, name, email, role, interests, budget_preference, created_at FROM users WHERE email = ?", (email,)).fetchone()
    if not user_row:
        return jsonify({"success": False, "message": "User not found."}), 404

    return jsonify({
        "success": True,
        "user": dict(user_row)
    })
