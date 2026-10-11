from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
from database import create_table

app = FastAPI()

create_table()


class Item(BaseModel):
    title: str
    description: str = ""
    category: str = ""
    location: str = ""
    status: str
    contact: str = ""


@app.get("/")
def home():
    return {"message": "FindIt Backend is Running!"}


@app.post("/items")
def add_item(item: Item):
    conn = sqlite3.connect("findit.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO items (title, description, category, location, status, contact)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        item.title,
        item.description,
        item.category,
        item.location,
        item.status,
        item.contact
    ))

    conn.commit()
    item_id = cursor.lastrowid
    conn.close()

    return {"message": "Item added successfully!", "id": item_id}


@app.get("/items")
def get_items():
    conn = sqlite3.connect("findit.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM items ORDER BY id DESC")
    items = [dict(row) for row in cursor.fetchall()]

    conn.close()
    return items

@app.get("/items/status/{status}")
def get_items_by_status(status: str):
    conn = sqlite3.connect("findit.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM items WHERE LOWER(status) = LOWER(?)",
        (status,)
    )

    items = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return items