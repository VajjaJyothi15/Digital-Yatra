import os
import json
import urllib.request
import urllib.parse
import re
import math
import sqlite3
from database.db import get_db, get_db_connection

# ==========================================
# SAFE DATABASE HELPER
# ==========================================

def safe_get_db():
    try:
        from flask import g
        if g:
            db = get_db()
            if db:
                return db
    except Exception:
        pass
    try:
        return get_db_connection()
    except Exception:
        return None

# ==========================================
# DATABASE HELPER FUNCTIONS FOR CHAT HISTORY
# ==========================================

def get_or_create_conversation(db, conversation_id=None, user_id=1, initial_title="New Chat"):
    if not db:
        return {"id": conversation_id or 1, "user_id": user_id, "title": initial_title}

    try:
        cursor = db.cursor()
        if conversation_id:
            cursor.execute("SELECT * FROM conversations WHERE id = ?", (conversation_id,))
            row = cursor.fetchone()
            if row:
                return dict(row)

        cursor.execute("INSERT INTO conversations (user_id, title) VALUES (?, ?)", (user_id, initial_title[:40]))
        db.commit()
        conv_id = cursor.lastrowid
        return {"id": conv_id, "user_id": user_id, "title": initial_title[:40]}
    except Exception as e:
        print(f"[DB Helper] Error creating conversation: {e}")
        return {"id": conversation_id or 1, "user_id": user_id, "title": initial_title}

def list_user_conversations(user_id=1):
    db = safe_get_db()
    if not db:
        return []
    try:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM conversations WHERE user_id = ? ORDER BY updated_at DESC", (user_id,))
        rows = cursor.fetchall()
        return [dict(r) for r in rows]
    except Exception as e:
        print(f"[DB Helper] Error listing conversations: {e}")
        return []

def get_conversation_messages(conversation_id):
    db = safe_get_db()
    if not db:
        return []
    try:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM chat_messages WHERE conversation_id = ? ORDER BY id ASC", (conversation_id,))
        rows = cursor.fetchall()
        res = []
        for r in rows:
            d = dict(r)
            if d.get('attachments'):
                try:
                    d['attachments'] = json.loads(d['attachments'])
                except Exception:
                    d['attachments'] = []
            else:
                d['attachments'] = []
            res.append(d)
        return res
    except Exception as e:
        print(f"[DB Helper] Error getting messages: {e}")
        return []

def save_chat_message(conversation_id, role, content, attachments=None, parent_message_id=None):
    db = safe_get_db()
    if not db:
        return None
    try:
        cursor = db.cursor()
        attach_str = json.dumps(attachments or [])
        cursor.execute("""
            INSERT INTO chat_messages (conversation_id, role, content, attachments, parent_message_id)
            VALUES (?, ?, ?, ?, ?)
        """, (conversation_id, role, content, attach_str, parent_message_id))
        
        # Update title if it's the first message
        cursor.execute("SELECT COUNT(*) as count FROM chat_messages WHERE conversation_id = ?", (conversation_id,))
        count_row = cursor.fetchone()
        if count_row and count_row['count'] <= 2 and role == 'user':
            short_title = content.strip().split('\n')[0][:30]
            cursor.execute("UPDATE conversations SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (short_title, conversation_id))
        else:
            cursor.execute("UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?", (conversation_id,))

        db.commit()
        return cursor.lastrowid
    except Exception as e:
        print(f"[DB Helper] Error saving chat message: {e}")
        return None

def rename_conversation(conversation_id, new_title):
    db = safe_get_db()
    if not db:
        return False
    try:
        cursor = db.cursor()
        cursor.execute("UPDATE conversations SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (new_title.strip(), conversation_id))
        db.commit()
        return True
    except Exception as e:
        print(f"[DB Helper] Error renaming conversation: {e}")
        return False

def delete_conversation(conversation_id):
    db = safe_get_db()
    if not db:
        return False
    try:
        cursor = db.cursor()
        cursor.execute("DELETE FROM chat_messages WHERE conversation_id = ?", (conversation_id,))
        cursor.execute("DELETE FROM conversations WHERE id = ?", (conversation_id,))
        db.commit()
        return True
    except Exception as e:
        print(f"[DB Helper] Error deleting conversation: {e}")
        return False

def edit_and_truncate_messages(conversation_id, message_id, new_content):
    db = safe_get_db()
    if not db:
        return False
    try:
        cursor = db.cursor()
        cursor.execute("UPDATE chat_messages SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND conversation_id = ?", (new_content, message_id, conversation_id))
        # Remove subsequent messages
        cursor.execute("DELETE FROM chat_messages WHERE conversation_id = ? AND id > ?", (conversation_id, message_id))
        db.commit()
        return True
    except Exception as e:
        print(f"[DB Helper] Error editing message: {e}")
        return False


# ==========================================
# FILE ATTACHMENT TEXT PARSER
# ==========================================

def parse_attachment_content(file_path):
    if not os.path.exists(file_path):
        return ""

    ext = os.path.splitext(file_path)[1].lower()
    
    try:
        if ext in ['.txt', '.md', '.csv', '.json', '.html', '.py', '.js', '.css', '.c', '.cpp', '.java']:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read(15000)
                return f"\n\n--- UPLOADED FILE ATTACHMENT ({os.path.basename(file_path)}) ---\n{content}\n--- END OF ATTACHMENT ---\n"
        
        elif ext == '.pdf':
            try:
                import pypdf
                reader = pypdf.PdfReader(file_path)
                text = ""
                for page in reader.pages[:10]:
                    text += page.extract_text() + "\n"
                return f"\n\n--- UPLOADED PDF ({os.path.basename(file_path)}) ---\n{text[:10000]}\n--- END OF PDF ---\n"
            except Exception:
                with open(file_path, 'rb') as f:
                    raw = f.read(10000).decode('ascii', errors='ignore')
                    cleaned = re.sub(r'[^a-zA-Z0-9\s\.,!\?]', ' ', raw)
                    return f"\n\n--- UPLOADED PDF ({os.path.basename(file_path)}) ---\n{cleaned[:3000]}\n--- END OF PDF ---\n"

        elif ext in ['.png', '.jpg', '.jpeg', '.webp', '.gif']:
            return f"\n\n[USER ATTACHED AN IMAGE FILE: {os.path.basename(file_path)}]\n"

    except Exception as e:
        print(f"[File Parser] Error reading attachment {file_path}: {e}")
    return ""


# ==========================================
# MULTILINGUAL METADATA & UTILITIES
# ==========================================

LANG_META = {
    "hindi": {"name": "Hindi", "code": "hi", "flag": "🇮🇳", "native": "हिन्दी"},
    "telugu": {"name": "Telugu", "code": "te", "flag": "🇮🇳", "native": "తెలుగు"},
    "tamil": {"name": "Tamil", "code": "ta", "flag": "🇮🇳", "native": "தமிழ்"},
    "kannada": {"name": "Kannada", "code": "kn", "flag": "🇮🇳", "native": "ಕನ್ನಡ"},
    "malayalam": {"name": "Malayalam", "code": "ml", "flag": "🇮🇳", "native": "മലയാളം"},
    "bengali": {"name": "Bengali", "code": "bn", "flag": "🇮🇳", "native": "বাংলা"},
    "marathi": {"name": "Marathi", "code": "mr", "flag": "🇮🇳", "native": "मराठी"},
    "gujarati": {"name": "Gujarati", "code": "gu", "flag": "🇮🇳", "native": "ગુજરાતી"},
    "punjabi": {"name": "Punjabi", "code": "pa", "flag": "🇮🇳", "native": "ਪੰਜਾਬੀ"},
    "urdu": {"name": "Urdu", "code": "ur", "flag": "🇵🇰", "native": "اردو"},
    "odia": {"name": "Odia", "code": "or", "flag": "🇮🇳", "native": "ଓଡ଼ିଆ"},
    "assamese": {"name": "Assamese", "code": "as", "flag": "🇮🇳", "native": "অসমীয়া"},
    "sanskrit": {"name": "Sanskrit", "code": "sa", "flag": "🇮🇳", "native": "संस्कृतम्"},
    "japanese": {"name": "Japanese", "code": "ja", "flag": "🇯🇵", "native": "日本語"},
    "chinese": {"name": "Chinese", "code": "zh", "flag": "🇨🇳", "native": "中文"},
    "mandarin": {"name": "Chinese", "code": "zh", "flag": "🇨🇳", "native": "中文"},
    "korean": {"name": "Korean", "code": "ko", "flag": "🇰🇷", "native": "한국어"},
    "french": {"name": "French", "code": "fr", "flag": "🇫🇷", "native": "Français"},
    "german": {"name": "German", "code": "de", "flag": "🇩🇪", "native": "Deutsch"},
    "spanish": {"name": "Spanish", "code": "es", "flag": "🇪🇸", "native": "Español"},
    "portuguese": {"name": "Portuguese", "code": "pt", "flag": "🇵🇹", "native": "Português"},
    "italian": {"name": "Italian", "code": "it", "flag": "🇮🇹", "native": "Italiano"},
    "russian": {"name": "Russian", "code": "ru", "flag": "🇷🇺", "native": "Русский"},
    "arabic": {"name": "Arabic", "code": "ar", "flag": "🇸🇦", "native": "العربية"},
    "turkish": {"name": "Turkish", "code": "tr", "flag": "🇹🇷", "native": "Türkçe"},
    "indonesian": {"name": "Indonesian", "code": "id", "flag": "🇮🇩", "native": "Bahasa Indonesia"},
    "vietnamese": {"name": "Vietnamese", "code": "vi", "flag": "🇻🇳", "native": "Tiếng Việt"},
    "thai": {"name": "Thai", "code": "th", "flag": "🇹🇭", "native": "ไทย"},
    "dutch": {"name": "Dutch", "code": "nl", "flag": "🇳🇱", "native": "Nederlands"},
    "greek": {"name": "Greek", "code": "el", "flag": "🇬🇷", "native": "Ελληνικά"},
    "hebrew": {"name": "Hebrew", "code": "he", "flag": "🇮🇱", "native": "עברית"},
    "persian": {"name": "Persian", "code": "fa", "flag": "🇮🇷", "native": "فارسی"},
    "farsi": {"name": "Persian", "code": "fa", "flag": "🇮🇷", "native": "فارسی"},
    "swahili": {"name": "Swahili", "code": "sw", "flag": "🇰🇪", "native": "Kiswahili"},
    "english": {"name": "English", "code": "en", "flag": "🇬🇧", "native": "English"}
}

def extract_target_languages(msg):
    text_lower = msg.lower()
    found = []
    words = re.findall(r'\b[a-z]+\b', text_lower)
    for w in words:
        if w in LANG_META:
            lang_info = LANG_META[w]
            if lang_info['name'] not in [f['name'] for f in found]:
                found.append(lang_info)
    return found

def extract_source_text(msg, history=None):
    # Check for quotes first
    match = re.search(r'["\'`](.*?)["\'`]', msg)
    if match and len(match.group(1).strip()) > 0:
        return match.group(1).strip()

    msg_lower = msg.lower().strip()
    clean = re.sub(r'^[^\w\s]+|[^\w\s]+$', '', msg_lower).strip()

    m = re.search(r'how (do you|can you|to) say (.*?) in [a-z]+', msg_lower)
    if m:
        return m.group(2).strip()

    m = re.search(r'translate (.*?) (into|to) [a-z]+', msg_lower)
    if m:
        return m.group(1).strip()

    m = re.search(r'[a-z]+ meaning of (.*)', msg_lower)
    if m:
        return m.group(1).strip()

    m = re.search(r'meaning of (.*?) in [a-z]+', msg_lower)
    if m:
        return m.group(1).strip()

    m = re.search(r'what is (.*?) in [a-z]+', msg_lower)
    if m:
        return m.group(1).strip()

    # Follow-up check with history
    if history and (clean.startswith("in ") or clean.startswith("what about") or clean.startswith("how about") or clean.startswith("and in") or clean in [l.lower() for l in LANG_META]):
        for h in reversed(history):
            prev_msg = h.get('content', '')
            prev_source = extract_source_text(prev_msg)
            if prev_source and prev_source != prev_msg.lower():
                return prev_source

    res = re.sub(r'\b(in|to|into)\s+(' + '|'.join(LANG_META.keys()) + r')\b', '', msg_lower, flags=re.IGNORECASE)
    res = re.sub(r'\bhow (do you|to) say\b', '', res, flags=re.IGNORECASE)
    res = re.sub(r'\btranslate\b', '', res, flags=re.IGNORECASE)
    res = re.sub(r'\bwhat is\b', '', res, flags=re.IGNORECASE)
    res = re.sub(r'\bmeaning of\b', '', res, flags=re.IGNORECASE)
    return res.strip() or msg.strip()

def translate_gtx(text, lang_code):
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl={lang_code}&dt=t&q={urllib.parse.quote(text)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            translated_parts = [part[0] for part in data[0] if part[0]]
            return "".join(translated_parts)
    except Exception as e:
        return None


# ==========================================
# INTENT CLASSIFIER
# ==========================================

def classify_intent(msg_raw, messages_history=None):
    """
    Classifies user message intent into:
    - CASUAL_CONVERSATION
    - TRANSLATION
    - TRAVEL_TOURISM
    - TRIP_PLANNING
    - SAFETY_EMERGENCY
    - NEARBY_SEARCH
    - GENERAL_KNOWLEDGE
    - APP_INFO
    - GENERAL
    """
    msg = msg_raw.strip().lower()
    clean_msg = re.sub(r'^[^\w\s]+|[^\w\s]+$', '', msg).strip()

    # 0. Check follow-up translation intent first
    if messages_history:
        followup_trans_pattern = r'^(in|what about|how about|and in|translate to)\s+[a-z]+(\s+and\s+[a-z]+)*\??$'
        if re.match(followup_trans_pattern, clean_msg) or clean_msg in [l.lower() for l in LANG_META]:
            for h in reversed(messages_history):
                content = h.get('content', '').lower()
                if any(k in content for k in ["translate", "how do you say", "how to say", "meaning of", "in "]):
                    return "TRANSLATION"

    # 1. TRANSLATION (explicit translation pattern)
    trans_patterns = [
        r'\btranslate\b',
        r'\bhow (do|can) (you|i) say\b',
        r'\bhow to say\b',
        r'\bmeaning of\b',
        r'\bwhat is\b.*\bin [a-z]+\b',
        r'\b[a-z]+ (meaning|translation|word) of\b',
        r'\btranslate (this|the following|into|to)\b'
    ]
    for p in trans_patterns:
        if re.search(p, clean_msg):
            # If target language or explicit translation word is present
            if any(k in clean_msg for k in ["in ", "to ", "into ", "translate"]) or any(re.search(r'\b' + re.escape(lang) + r'\b', clean_msg) for lang in LANG_META):
                return "TRANSLATION"

    # 2. CASUAL CONVERSATION (must NOT be a translation request)
    casual_exact = {
        "hi", "hello", "hey", "namaste", "namaskar", "hullo", "hola",
        "good morning", "good afternoon", "good evening", "good night",
        "how are you", "how are u", "how r u", "how do you do", "how are you doing", "hows it going", "how is it going",
        "what are you doing", "whats up", "what's up", "wbu", "what about you",
        "who are you", "what is your name", "whats your name", "who made you",
        "thank you", "thanks", "thanks a lot", "thank u", "thx",
        "that's great", "thats great", "awesome", "cool", "superb", "nice", "great", "wonderful", "perfect", "good job",
        "bye", "byebye", "goodbye", "see you", "take care",
        "tell me something interesting", "tell me a joke", "tell me a story"
    }

    hinglish_casual = [
        "kaise ho", "kese ho", "kaisa ho", "kya haal", "kya haal hai", "kya kar rahe ho", "kya chal raha hai", "thik ho", "sab thik"
    ]
    for h in hinglish_casual:
        if h in clean_msg:
            return "CASUAL_CONVERSATION"

    if clean_msg in casual_exact:
        return "CASUAL_CONVERSATION"

    if any(clean_msg.startswith(g + " ") or clean_msg.endswith(" " + g) for g in ["hi", "hello", "hey", "namaste", "good morning", "good evening", "good afternoon", "thank you", "thanks"]):
        if len(clean_msg.split()) <= 4 and not any(l in clean_msg for l in LANG_META):
            return "CASUAL_CONVERSATION"

    if (clean_msg.startswith("how are you") or clean_msg.startswith("how are u") or clean_msg.startswith("who are you") or clean_msg.startswith("what are you doing")) and not any(l in clean_msg for l in ["in ", "to ", "into "] + list(LANG_META.keys())):
        return "CASUAL_CONVERSATION"

    # 3. SAFETY / EMERGENCY
    safety_words = ["hospital", "doctor", "ambulance", "police", "police station", "help me", "emergency", "someone is following me", "in danger", "unsafe", "sos", "attacked", "harassed", "stolen", "lost passport", "accident"]
    if any(w in clean_msg for w in safety_words):
        if "near me" in clean_msg or "nearby" in clean_msg or "closest" in clean_msg:
            return "NEARBY_SEARCH"
        return "SAFETY_EMERGENCY"

    # 4. NEARBY PLACES / SEARCH
    nearby_words = ["near me", "nearby", "closest", "around here", "nearest", "find restaurants", "find hotels", "atm near", "restroom near"]
    if any(w in clean_msg for w in nearby_words):
        return "NEARBY_SEARCH"

    # 5. TRIP PLANNING
    trip_patterns = [
        r'\bplan a (\d+[\s-]day|\d+[\s-]days)?\s*trip\b',
        r'\bmake an itinerary\b',
        r'\bitinerary for\b',
        r'\bbudget for\b',
        r'\bi want to travel to\b.*\bfor\b',
        r'\bcreate a (trip|plan|itinerary)\b',
        r'\bplanning a trip\b'
    ]
    for p in trip_patterns:
        if re.search(p, clean_msg):
            return "TRIP_PLANNING"

    # 6. TRAVEL / TOURISM
    travel_patterns = [
        r'\bplaces to visit\b',
        r'\btop (\d+ )?places\b',
        r'\bbest places\b',
        r'\bwhat to see in\b',
        r'\battractions in\b',
        r'\btourist spots\b',
        r'\bwhat can i do in\b',
        r'\bthings to do in\b',
        r'\bsightseeing in\b',
        r'\btravel to\b',
        r'\bvisit\b'
    ]
    for p in travel_patterns:
        if re.search(p, clean_msg):
            return "TRAVEL_TOURISM"

    known_destinations = ["goa", "andhra pradesh", "ap", "vizag", "visakhapatnam", "tirupati", "jaipur", "delhi", "mumbai", "kerala", "rajasthan", "agra", "udaipur", "varanasi"]
    if any(re.search(r'\b' + re.escape(d) + r'\b', clean_msg) for d in known_destinations):
        return "TRAVEL_TOURISM"

    # 7. APP / PROJECT RELATED
    app_words = ["how does this app work", "what is digital yatra", "what is guide me", "how do i use safety mode", "what can you do", "what are your features", "how to book a guide", "what is this app"]
    if any(w in clean_msg for w in app_words):
        return "APP_INFO"

    # 8. GENERAL KNOWLEDGE
    gk_patterns = [
        r'^what is ',
        r'^who invented ',
        r'^who is ',
        r'^why is ',
        r'^how does .* work$',
        r'^explain ',
        r'^tell me about '
    ]
    for p in gk_patterns:
        if re.search(p, clean_msg):
            return "GENERAL_KNOWLEDGE"

    return "GENERAL"


# ==========================================
# MAIN ASSISTANT QUERY PROCESSOR
# ==========================================

def process_assistant_query(user_message, destination='Goa', language='Auto-Detect', user_id=1, messages_history=None, conversation_id=None, attachments=None, user_location=None, edit_message_id=None):
    msg = user_message.strip()
    msg_lower = msg.lower()
    
    db = safe_get_db()

    # Handle Database Conversation Context
    if conversation_id and db:
        conv = get_or_create_conversation(db, conversation_id, user_id=user_id or 1, initial_title=msg)
        conversation_id = conv['id']
        
        if edit_message_id:
            edit_and_truncate_messages(conversation_id, edit_message_id, msg)
        else:
            save_chat_message(conversation_id, 'user', msg, attachments=attachments)

        if not messages_history:
            history_rows = get_conversation_messages(conversation_id)
            messages_history = [{'role': m['role'], 'content': m['content']} for m in history_rows[:-1]]

    # Parse attachment content if present
    attachment_text = ""
    if attachments:
        for att in attachments:
            file_url = att.get('url') or att.get('path') or ''
            if file_url:
                local_path = file_url.replace('/uploads/', '').replace('\\', '/')
                full_path = os.path.join(os.path.abspath('backend'), 'uploads', os.path.basename(local_path))
                attachment_text += parse_attachment_content(full_path)

    full_user_prompt = msg + attachment_text

    # 1. Try external LLM API if key is configured in environment
    api_key = os.environ.get('GEMINI_API_KEY') or os.environ.get('OPENAI_API_KEY') or os.environ.get('AI_API_KEY')
    if api_key:
        api_response = call_external_llm_api(api_key, full_user_prompt, destination, language, messages_history, user_location)
        if api_response:
            if conversation_id and db:
                save_chat_message(conversation_id, 'assistant', api_response['reply'])
                api_response['conversation_id'] = conversation_id
            return api_response

    # 2. General-Purpose Intent-Driven Engine
    response_data = generate_conversational_response(full_user_prompt, msg_lower, destination, language, messages_history, db, user_location)
    
    if conversation_id and db:
        save_chat_message(conversation_id, 'assistant', response_data['reply'])
        response_data['conversation_id'] = conversation_id

    return response_data


# ==========================================
# EXTERNAL LLM API CALL (GEMINI / OPENAI)
# ==========================================

def call_external_llm_api(api_key, user_message, destination, language, messages_history, user_location=None):
    try:
        if api_key.startswith("AIza"):
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            
            loc_ctx = f" (User Live Location: Lat {user_location.get('lat')}, Lng {user_location.get('lng')})" if user_location else ""

            system_prompt = f"""You are Digital Yatra AI, a warm, wise, natural, friendly AI Companion & Travel Guide.{loc_ctx}
CRITICAL INSTRUCTIONS FOR MULTILINGUAL TRANSLATION & INTENT:
1. TRANSLATION INTENT:
   - Identify requested target language(s) dynamically (e.g. Hindi, Japanese, French, Spanish, German, Arabic, Korean, Russian, etc.). NEVER default to Telugu or Hindi unless requested.
   - If user asks for multiple target languages (e.g., "in Telugu, Hindi, Japanese and French"), return ALL requested translations clearly formatted.
   - Handle follow-up translation prompts (e.g., "in Hindi", "what about Spanish?") by referring to the previous turn's source text.
   - Translate the EXACT user phrase or sentence. Do NOT replace it with a pre-canned phrase.
2. CASUAL CONVERSATION:
   - "How are you?" is a casual question, NOT a translation request. Answer naturally: "I'm doing great! 😊 How are you?"
3. DO NOT prefix responses with "You asked: ...".
4. Keep answers direct, friendly, and human-like."""

            contents = []
            contents.append({"role": "user", "parts": [{"text": system_prompt}]})
            contents.append({"role": "model", "parts": [{"text": "Namaste! I am Digital Yatra AI, your smart AI assistant. How can I help you today?"}]})
            
            if messages_history:
                for h in messages_history:
                    role = "user" if h.get("role") in ["user", "human"] else "model"
                    contents.append({"role": role, "parts": [{"text": h.get("content", "")}]})

            contents.append({"role": "user", "parts": [{"text": user_message}]})

            req_data = json.dumps({"contents": contents}).encode('utf-8')
            req = urllib.request.Request(url, data=req_data, headers={"Content-Type": "application/json"})
            
            with urllib.request.urlopen(req, timeout=12) as response:
                res_body = json.loads(response.read().decode('utf-8'))
                text = res_body['candidates'][0]['content']['parts'][0]['text']
                return {
                    "reply": text,
                    "action_type": "TEXT",
                    "suggestions": ["Translate to Spanish", "Translate to French", "Translate to Japanese"],
                    "destination": destination,
                    "language": language
                }
    except Exception as e:
        print(f"[AI Assistant] External API note: {e}. Using local intelligence engine.")
    return None


# ==========================================
# INTENT-BASED RESPONSE GENERATION ENGINE
# ==========================================

def generate_conversational_response(msg, msg_lower, destination, language, messages_history, db, user_location=None):
    intent = classify_intent(msg, messages_history)
    
    response_text = ""
    action_type = "TEXT"
    suggestions = []

    clean_msg = re.sub(r'^[^\w\s]+|[^\w\s]+$', '', msg_lower).strip()

    # ------------------------------------------
    # 1. CASUAL CONVERSATION
    # ------------------------------------------
    if intent == "CASUAL_CONVERSATION":
        if "how are you" in clean_msg or "how are u" in clean_msg or "how r u" in clean_msg or "how do you do" in clean_msg or "how are you doing" in clean_msg or "hows it going" in clean_msg:
            response_text = "I'm doing great! 😊 Thank you for asking. How are you doing today?"
            suggestions = ["I'm doing good!", "Plan a trip to Goa", "Top places to visit in AP", "Tell me something interesting"]

        elif "good morning" in clean_msg:
            response_text = "Good morning! ☀️ Wishing you a pleasant and wonderful day ahead. How can I help you today?"
            suggestions = ["Plan a trip", "Top places to visit in AP", "Find local tour guide"]

        elif "good evening" in clean_msg:
            response_text = "Good evening! <ctrl42> How has your day been? How can I assist you today?"
            suggestions = ["Plan a trip", "Explore attractions", "Find nearby places"]

        elif "good afternoon" in clean_msg:
            response_text = "Good afternoon! ☀️ Hope you are having a pleasant day. How can I help you?"
            suggestions = ["Plan a trip", "Explore places", "Safety tips"]

        elif "thank" in clean_msg:
            response_text = "You're very welcome! 😊 I'm happy to help. Let me know if you need anything else!"
            suggestions = ["Top places in AP", "Plan a trip to Goa", "Tell me a joke"]

        elif "that's great" in clean_msg or "thats great" in clean_msg or "awesome" in clean_msg or "cool" in clean_msg or "superb" in clean_msg or "nice" in clean_msg or "wonderful" in clean_msg or "perfect" in clean_msg:
            response_text = "Glad to hear that! 😊 Let me know if there's anything else you'd like to explore or plan."
            suggestions = ["Plan a trip", "Top places in AP", "Find local guide"]

        elif "who are you" in clean_msg or "what is your name" in clean_msg or "whats your name" in clean_msg:
            response_text = "I am **Digital Yatra AI**, your smart AI companion and travel guide! 🤖✨ I am here to help you explore top places across India, plan travel itineraries, find certified local guides, assist with safety, translate phrases, and answer your questions."
            suggestions = ["Plan a trip to Goa", "Top places in AP", "How does this app work?"]

        elif "what are you doing" in clean_msg or "whats up" in clean_msg or "what's up" in clean_msg:
            response_text = "Not much, just here and ready to assist you! 😊 What's on your mind today?"
            suggestions = ["Plan a trip", "Explore places in AP", "Tell me something interesting"]

        elif "tell me something interesting" in clean_msg or "something interesting" in clean_msg:
            response_text = "Did you know that India's **Magnetic Hill** in Ladakh creates an optical illusion where vehicles seem to roll uphill against gravity? 🚗✨ Or that **Belum Caves** in Andhra Pradesh is the second largest cave system in the Indian subcontinent!"
            suggestions = ["Tell me another fact", "Top places in Ladakh", "Belum Caves info"]

        elif "joke" in clean_msg:
            response_text = "Why don't travelers ever get lost in India? Because every local is a human GPS with a warm cup of chai! ☕😄"
            suggestions = ["Tell another joke", "Plan a trip to Goa", "Top places in AP"]

        elif any(h in clean_msg for h in ["kaise ho", "kese ho", "kaisa ho", "kya haal"]):
            response_text = "Main bilkul badhiya hoon! 😊 Aap bataiye, aap kaise hain? Aaj kya explore ya plan karna chahenge?"
            suggestions = ["Main thik hoon", "Plan a trip", "Explore AP places"]

        else:
            response_text = "Namaste! Hello! 😊 How can I assist you today?"
            suggestions = ["Plan a trip to Goa", "Top places in AP", "Find local guide"]

    # ------------------------------------------
    # 2. DYNAMIC MULTILINGUAL TRANSLATION
    # ------------------------------------------
    elif intent == "TRANSLATION":
        target_langs = extract_target_languages(msg)
        source_text = extract_source_text(msg, messages_history)

        # Check default dropdown language if user didn't specify target language in message
        if not target_langs:
            if language and language != 'Auto-Detect' and language.lower() in LANG_META:
                target_langs = [LANG_META[language.lower()]]
            else:
                target_langs = [LANG_META["telugu"]]

        results = []
        for lang in target_langs:
            trans = translate_gtx(source_text, lang['code'])
            results.append((lang, trans or source_text))

        if len(results) == 1:
            lang, trans = results[0]
            response_text = f"In **{lang['name']}** ({lang['native']}), **\"{source_text}\"** is spoken as:\n\n👉 **\"{trans}\"** 😊"
        else:
            lines = [f"Here are the translations for **\"{source_text}\"**:\n"]
            for lang, trans in results:
                lines.append(f"- {lang['flag']} **{lang['name']}** ({lang['native']}): **\"{trans}\"**")
            response_text = "\n".join(lines)

        # Dynamic suggestions based on requested target language
        other_langs = ["Spanish", "French", "Japanese", "German", "Hindi", "Korean", "Arabic"]
        used_names = [l['name'] for l in target_langs]
        suggest_langs = [l for l in other_langs if l not in used_names][:3]
        suggestions = [f"Translate to {l}" for l in suggest_langs]

    # ------------------------------------------
    # 3. SAFETY / EMERGENCY
    # ------------------------------------------
    elif intent == "SAFETY_EMERGENCY":
        response_text = """### 🚨 EMERGENCY & SAFETY ASSISTANCE

If you are in immediate danger or need urgent help, please contact emergency helplines right away:

- 📞 **National Emergency Number:** 112
- 👮 **Police Control Room:** 100 / 112
- 🚑 **Medical / Ambulance:** 108
- 👩 **Women Helpline:** 1091

**Immediate Safety Advice:**
1. Move to a well-lit public area immediately.
2. Share your live location with family or trusted friends.
3. Keep emergency numbers on speed dial.

*Tap **Open Safety Mode** below to trigger SOS alert or check fare transparency.*"""
        action_type = "OPEN_SAFETY"
        suggestions = ["Open Safety Mode", "Nearest Hospital", "Nearest Police Station"]

    # ------------------------------------------
    # 4. NEARBY PLACES / SEARCH
    # ------------------------------------------
    elif intent == "NEARBY_SEARCH":
        loc_str = f" (**Lat: {user_location['lat']:.4f}, Lng: {user_location['lng']:.4f}**)" if user_location else ""
        response_text = f"""### 📍 Nearby Places & Services

Based on your live location{loc_str}, you can explore nearby services on Digital Yatra Map:

- 🍴 **Restaurants & Cafés**: Local authentic dining and top-rated eateries.
- 🏥 **Hospitals & Clinics**: 24/7 medical centers and emergency care.
- 🏧 **ATMs & Banks**: Cash withdrawal and banking kiosks.
- 👮 **Police Stations**: Local law enforcement and helpdesks.

*Tap **Open Map** below to view exact distances and navigate live on Digital Yatra Map!*"""
        action_type = "FIND_NEARBY"
        suggestions = ["Find Restaurants", "Nearest Hospital", "Nearest ATM", "Open Map"]

    # ------------------------------------------
    # 5. TRIP PLANNING
    # ------------------------------------------
    elif intent == "TRIP_PLANNING":
        target = "Goa"
        if "ap" in clean_msg or "andhra" in clean_msg:
            target = "Andhra Pradesh"
        elif "vizag" in clean_msg or "visakhapatnam" in clean_msg:
            target = "Visakhapatnam"
        elif "jaipur" in clean_msg:
            target = "Jaipur"
        elif "rajasthan" in clean_msg:
            target = "Rajasthan"
        elif "kerala" in clean_msg:
            target = "Kerala"

        if target == "Goa":
            response_text = """### 🌴 4-Day Customized Goa Itinerary

- **Day 1 – Coastal Arrival & Sunset**: Check in, relax at Candolim / Baga beach, watch sunset at Fort Aguada 🌅, and enjoy dinner at a cozy beach shack.
- **Day 2 – North Goa Forts & Night Markets**: Visit Chapora Fort, Vagator beach, Anjuna flea market, and enjoy beach music.
- **Day 3 – South Goa Heritage & Quiet Shorelines**: Explore Fontainhas Latin Quarter in Panaji, Old Goa Churches (Basilica of Bom Jesus), and unwind at Palolem beach.
- **Day 4 – Cafés & Departure**: Morning walk along Miramar beach, local café breakfast, souvenir shopping, and departure! ✈️

💰 **Estimated Budget**: ₹8,000 – ₹15,000 per person."""
        elif target == "Andhra Pradesh":
            response_text = """### 🏛️ 3-Day Andhra Pradesh Tour Itinerary

- **Day 1 – Heritage & Sacred Tirupati**: Visit Sri Venkateswara Swamy Temple in Tirupati and explore Kapila Theertham.
- **Day 2 – Scenic Araku Valley & Caves**: Scenic train ride to Araku Valley, coffee plantations, and million-year-old Borra Caves.
- **Day 3 – Coastal Vizag Highlights**: Explore RK Beach, INS Kursura Submarine Museum, and hilltop views from Kailasagiri in Visakhapatnam."""
        else:
            response_text = f"""### 🗓️ Customized Travel Plan for {target}

- **Day 1 – Arrival & Iconic Landmarks**: Check in, visit top historical monuments and scenic viewpoints.
- **Day 2 – Cultural & Heritage Exploration**: Local street food tour, heritage markets, and ancient temples/forts.
- **Day 3 – Scenic Spots & Relaxation**: Nature parks, local artisan shopping, and sunset leisure.

💰 **Estimated Budget**: ₹6,000 – ₹12,000 per person."""
        
        suggestions = ["Plan budget trip", "Book local guide", "Top food spots", "Safety tips"]

    # ------------------------------------------
    # 6. TRAVEL / TOURISM
    # ------------------------------------------
    elif intent == "TRAVEL_TOURISM":
        if "ap" in clean_msg or "andhra" in clean_msg:
            response_text = """### 🏛️ Top Places to Visit in Andhra Pradesh (AP)

1. **Tirupati (Sri Venkateswara Swamy Temple)** – World-renowned sacred pilgrimage center.
2. **Araku Valley** – Serene hill station with lush coffee plantations and waterfalls.
3. **Visakhapatnam (RK Beach & Submarine Museum)** – Coastal beauty with INS Kursura museum and Kailasagiri.
4. **Borra Caves** – Ancient million-year-old limestone cave formations near Araku.
5. **Belum Caves** – Second largest cave system in the Indian subcontinent.
6. **Amaravathi** – Historical Buddhist heritage site and ancient capital along the Krishna river.
7. **Srisailam** – Ancient Mallikarjuna Jyotirlinga temple in the scenic Nallamala hills.
8. **Lepakshi** – Marvelous 16th-century Vijayanagara architecture and hanging pillar.
9. **Horsley Hills** – Picturesque hill resort near Chittoor with pleasant climate.
10. **Rajahmundry & Godavari River** – Cultural capital of AP with scenic river cruises.

*Would you like a customized itinerary or certified local guide for any of these places?*"""
            suggestions = ["Plan 3-day AP trip", "Top places in Vizag", "Book local guide in Tirupati"]

        elif "vizag" in clean_msg or "visakhapatnam" in clean_msg:
            response_text = """### 🌊 Top Highlights of Visakhapatnam (Vizag)

1. **RK Beach (Ramakrishna Beach)** – Vibrant coastal promenade with sunset views and food stalls.
2. **INS Kursura Submarine Museum** – Decommissioned submarine turned museum right on the beach.
3. **Kailasagiri** – Hilltop park offering panoramic views of the city and Bay of Bengal.
4. **Rushikonda Beach** – Blue Flag certified beach perfect for water sports and swimming.
5. **Dolphin's Nose & Lighthouse** – Massive rock formation overlooking the harbor and ocean.

*Would you like a day plan or hotel recommendations for Vizag?*"""
            suggestions = ["Plan Vizag day trip", "Araku Valley info", "Find local guide in Vizag"]

        elif "goa" in clean_msg:
            response_text = """### 🌴 Top Places to Visit in Goa

1. **North Goa Beaches (Baga, Calangute, Anjuna)** – Beach shacks, water sports, and vibrant nightlife.
2. **Fort Aguada & Lighthouse** – 17th-century Portuguese fort overlooking the Arabian Sea.
3. **Fontainhas (Latin Quarter, Panaji)** – Colorful Portuguese heritage streets and boutique cafés.
4. **South Goa Beaches (Palolem, Colva, Agonda)** – Peaceful, scenic beaches surrounded by palm groves.
5. **Dudhsagar Waterfalls** – Majestic four-tiered waterfall inside Bhagwan Mahaveer Sanctuary.

*Tell me how many days you plan to stay and I'll create a full Goa plan!*"""
            suggestions = ["Plan 3-day Goa trip", "Best South Goa beaches", "Book local guide"]

        else:
            response_text = f"""### 🏰 Top Travel Highlights for Your Request

- 📍 **Must-Visit Landmarks**: Top historical monuments, scenic spots, and cultural heritage sites.
- 🍴 **Local Food Specialties**: Authentic regional delicacies and popular street food.
- 🏨 **Stays**: Budget hostels to luxury heritage hotels.

*Tell me your destination of choice and I'll generate a complete guide and itinerary!*"""
            suggestions = ["Top places in AP", "Plan trip to Goa", "Top places in Jaipur"]

    # ------------------------------------------
    # 7. APP / PROJECT RELATED
    # ------------------------------------------
    elif intent == "APP_INFO":
        if "guide me" in clean_msg:
            response_text = """**Guide Me** is Digital Yatra's interactive map feature! 🗺️

It allows you to:
- Search nearby places (Restaurants, ATMs, Hospitals, Police Stations, Hotels, Attractions).
- Filter places by specific category.
- View real-time distances between your live location and destination.
- Open turn-by-turn navigation in Google Maps."""
            suggestions = ["Open Guide Me Map", "How does Safety Mode work?", "How to book a guide"]

        elif "safety" in clean_msg:
            response_text = """**Safety Mode** is Digital Yatra's dedicated traveler security system! 🚨

It includes:
- ⚡ **Emergency SOS Alert**: Instantly notify emergency contacts.
- 📞 **24/7 Helpline Hotlines**: National Emergency 112, Police 100, Medical 108, Women Helpline 1091.
- 🚕 **Fare Transparency Calculator**: Estimate fair auto/taxi fares to prevent overcharging.
- 📍 **Live Location Sharing**: Share your GPS coordinates with family."""
            suggestions = ["Open Safety Mode", "Check Fare Calculator", "Emergency Helplines"]

        else:
            response_text = """### 🧭 Digital Yatra — Smart Travel Assistant

**Digital Yatra** is your all-in-one smart travel companion across India!

Key features:
1. 🗺️ **Guide Me**: Interactive map to discover nearby places (restaurants, ATMs, hospitals, police, attractions) with category filtering and Google Maps navigation.
2. 🚨 **Safety Mode**: Emergency SOS alerts, 24/7 helpline hotlines, live GPS location sharing, and auto/taxi fare calculator.
3. 🧑‍🏫 **Local Guide Booking**: Connect with certified local tour guides across Indian destinations.
4. 📅 **Trip Planner**: Customized day-by-day itineraries tailored to your budget and stay duration.
5. 🤖 **AI Assistant**: Smart conversational companion for travel planning, heritage stories, language translation, and instant answers!"""
            suggestions = ["Open Interactive Map", "Plan a Trip", "Book Local Guide"]

    # ------------------------------------------
    # 8. GENERAL KNOWLEDGE
    # ------------------------------------------
    elif intent == "GENERAL_KNOWLEDGE":
        if "machine learning" in clean_msg or "ml" in clean_msg:
            response_text = """**Machine Learning (ML)** is a branch of artificial intelligence (AI) focused on building systems that learn from data and improve their performance over time without being explicitly programmed.

Key applications include:
- 🤖 **Recommendation Engines** (e.g. Netflix, YouTube, Spotify)
- 📧 **Spam Filtering** in email
- 🚗 **Autonomous Driving** & computer vision
- 💬 **Natural Language Processing** & AI chatbots"""
            suggestions = ["Tell me about AI", "What is Deep Learning?", "Plan a trip"]

        elif "telephone" in clean_msg:
            response_text = "The telephone was invented by **Alexander Graham Bell**, who was awarded the official U.S. patent for the device in **1876**."
            suggestions = ["Who invented the computer?", "Tell me another history fact", "Plan a trip"]

        else:
            response_text = f"Here is the information regarding your question:\n\nAs your AI assistant, I can help explain general knowledge topics, science, history, calculations, writing, or travel concepts! Let me know if you would like deeper details on this."
            suggestions = ["Tell me more", "Explain simply", "Plan a trip"]

    # ------------------------------------------
    # 9. GENERAL FALLBACK
    # ------------------------------------------
    else:
        response_text = "That's an interesting question! 😊 How can I best assist you with this topic today?"
        suggestions = ["Tell me more", "Plan a trip to Goa", "Top places in AP"]

    return {
        "reply": response_text,
        "action_type": action_type,
        "suggestions": suggestions,
        "destination": destination,
        "language": language
    }
