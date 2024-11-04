import dns.resolver
dns.resolver.default_resolver=dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers=['8.8.8.8']
from flask import *
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os
from datetime import datetime,timedelta

app = Flask(__name__)

# Load environment variables
load_dotenv()
database_uri = os.getenv("DATABASE_URI")

client = MongoClient(database_uri)
db = client['open_write']
NOTES = db['notes']

# Home page
@app.route('/')
def index():
    notes = list(NOTES.find({}))
    # Filter note before sending to client 
    for note in notes:
        if "password" in note and note["password"] != "":
          # Remove password field from each note
          del note["password"]
          # Mark "note_content" as "Protected note"
          note["note_content"] = "🔒 Protected Note. Use password to view this note."
          # Add a new field to identify note is protected 
          note["isProtected"] = True
        
        # Format date for each note
        # Ensure `date` field exists, then format it
        if "date" in note and isinstance(note["date"], datetime):
            note["date"] = note["date"].strftime("%d %b, %y at %I:%M %p")
    
    notes.reverse()
    return render_template('index.html', notes=notes)

# Create new note
@app.route('/create-note', methods=['POST'])
def create_note():
    form = request.form
    note_content = form.get("note_content")
    note_title = form.get("title")
    password = form.get("password")
    
    # Calculate the cutoff time for deleting old notes (48 hours ago)
    cutoff_time = datetime.now() - timedelta(hours=48)

    # Delete notes older than 48 hours
    NOTES.delete_many({"date": {"$lt": cutoff_time}})

    # Define the note dictionary correctly with keys and add current date
    note = {
        "note_content": note_content,
        "title": note_title,
        "password": password or "",
        "date": datetime.now()
    }
    
    # Insert the new note into the database
    NOTES.insert_one(note)
    
    return redirect(url_for("index"))

# Get note by id with correct password
@app.route('/notes/<note_id>', methods=['POST'])
def get_note_by_id(note_id):
    data = request.get_json()
    password = data.get("password")
    
    # Query the database for a note that matches the ID and password
    note = NOTES.find_one({"_id": ObjectId(note_id), "password": password}, {"_id": 0, "password": 0})
    
    if note:
        return jsonify({ "success": True, "data": note }), 200
    else:
        return jsonify({ "success": False, "error": "Note not found or password is incorrect"}), 404

if __name__ == '__main__':
    app.run(debug=True)