import sqlite3
import os
from flask import g
from config import DB_PATH

def get_db():
    if 'db' not in g:
        # Ensure database parent directory exists
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
        create_schema_tables(g.db)
        create_chat_tables(g.db)
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def create_schema_tables(conn):
    try:
        schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
        if os.path.exists(schema_path):
            with open(schema_path, 'r', encoding='utf-8') as f:
                conn.executescript(f.read())
            conn.commit()

        # Import and run idempotent seed function if tables are empty
        from database.seed import seed_data_if_empty
        seed_data_if_empty(conn)

        # Add profile columns safely if missing
        cursor = conn.cursor()
        for col in [("phone", "TEXT DEFAULT ''"), ("city", "TEXT DEFAULT ''"), ("designation", "TEXT DEFAULT ''")]:
            try:
                cursor.execute(f"ALTER TABLE users ADD COLUMN {col[0]} {col[1]}")
            except Exception:
                pass
        conn.commit()
    except Exception as e:
        print(f"[DB] Error executing schema.sql / seeding: {e}")


def create_chat_tables(conn):
    try:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id INTEGER NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                attachments TEXT DEFAULT '[]',
                parent_message_id INTEGER DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
            )
        ''')
        conn.commit()
    except Exception as e:
        print(f"[DB] Error creating chat tables: {e}")

def init_db(app):
    app.teardown_appcontext(close_db)
    with app.app_context():
        db = get_db()
        create_schema_tables(db)
        create_chat_tables(db)

def get_db_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    create_schema_tables(conn)
    create_chat_tables(conn)
    return conn

