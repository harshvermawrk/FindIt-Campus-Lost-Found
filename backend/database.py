import sqlite3

def create_table():
    conn = sqlite3.connect("findit.db")

    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT,
            location TEXT,
            status TEXT NOT NULL,
            contact TEXT
        )
    """)

    conn.commit()
    conn.close()

create_table()