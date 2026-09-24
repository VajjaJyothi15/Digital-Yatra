import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from services.assistant_service import (
    process_assistant_query, 
    list_user_conversations, 
    get_conversation_messages, 
    get_or_create_conversation, 
    rename_conversation, 
    delete_conversation
)
from services.fare_service import validate_transport_fare
from database.db import get_db

assistant_bp = Blueprint('assistant', __name__, url_prefix='/api')

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'csv', 'json', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@assistant_bp.route('/assistant/chat', methods=['POST'])
def assistant_chat():
    data = request.get_json() or {}
    message = data.get('message', '').strip()
    destination = data.get('destination', 'Goa')
    language = data.get('language', 'Auto-Detect')
    user_id = data.get('user_id', 1)
    messages_history = data.get('messages', [])
    conversation_id = data.get('conversation_id')
    attachments = data.get('attachments', [])
    user_location = data.get('user_location')
    edit_message_id = data.get('edit_message_id')

    if not message:
        return jsonify({"success": False, "message": "Message text is required."}), 400

    chat_response = process_assistant_query(
        user_message=message,
        destination=destination,
        language=language,
        user_id=user_id,
        messages_history=messages_history,
        conversation_id=conversation_id,
        attachments=attachments,
        user_location=user_location,
        edit_message_id=edit_message_id
    )

    return jsonify({
        "success": True,
        "chat": chat_response
    })

# Conversation Management Endpoints
@assistant_bp.route('/chat/conversations', methods=['GET', 'POST'])
def handle_conversations():
    if request.method == 'GET':
        user_id = request.args.get('user_id', 1, type=int)
        convs = list_user_conversations(user_id=user_id)
        return jsonify({"success": True, "conversations": convs})

    elif request.method == 'POST':
        data = request.get_json() or {}
        user_id = data.get('user_id', 1)
        title = data.get('title', 'New Chat')
        db = get_db()
        conv = get_or_create_conversation(db, conversation_id=None, user_id=user_id, initial_title=title)
        return jsonify({"success": True, "conversation": conv})

@assistant_bp.route('/chat/conversations/<int:conv_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_single_conversation(conv_id):
    if request.method == 'GET':
        msgs = get_conversation_messages(conv_id)
        return jsonify({"success": True, "messages": msgs})

    elif request.method == 'PUT':
        data = request.get_json() or {}
        new_title = data.get('title', 'Renamed Chat')
        ok = rename_conversation(conv_id, new_title)
        return jsonify({"success": ok, "message": "Renamed" if ok else "Failed"})

    elif request.method == 'DELETE':
        ok = delete_conversation(conv_id)
        return jsonify({"success": ok, "message": "Deleted" if ok else "Failed"})

# Attachment File Upload Endpoint
@assistant_bp.route('/chat/upload', methods=['POST'])
def upload_chat_file():
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file uploaded."}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "message": "Empty file name."}), 400

    if file and allowed_file(file.filename):
        orig_filename = secure_filename(file.filename)
        ext = orig_filename.rsplit('.', 1)[1].lower() if '.' in orig_filename else ''
        unique_name = f"{uuid.uuid4().hex[:8]}_{orig_filename}"

        upload_folder = current_app.config['UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, unique_name)
        file.save(file_path)

        file_url = f"/uploads/{unique_name}"
        is_image = ext in ['png', 'jpg', 'jpeg', 'webp', 'gif']

        return jsonify({
            "success": True,
            "attachment": {
                "name": orig_filename,
                "url": file_url,
                "type": "image" if is_image else "document",
                "size": os.path.getsize(file_path)
            }
        })
    
    return jsonify({"success": False, "message": "File type not supported."}), 400

@assistant_bp.route('/fares/compare', methods=['POST'])
def compare_fare():
    data = request.get_json() or {}
    transport_type = data.get('transport_type', 'Auto')
    origin = data.get('origin', '')
    destination = data.get('destination', '')
    quoted_fare = data.get('quoted_fare', 200)

    result = validate_transport_fare(
        transport_type=transport_type,
        origin=origin,
        destination=destination,
        quoted_fare=quoted_fare
    )

    return jsonify({
        "success": True,
        "fare_analysis": result
    })
