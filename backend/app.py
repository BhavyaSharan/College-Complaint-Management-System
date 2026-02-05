from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt

app = Flask(__name__)
CORS(app)

# Dummy Admin Database (Later connect MySQL)
admins = [
    {
        "role": "Dean",
        "department": None,
        "email": "dean@college.com",
        "password": bcrypt.hashpw("dean123".encode(), bcrypt.gensalt())
    },
    {
        "role": "HOD",
        "department": "CSE",
        "email": "hodcse@college.com",
        "password": bcrypt.hashpw("hod123".encode(), bcrypt.gensalt())
    },
    {
        "role": "Technician",
        "department": None,
        "email": "tech@college.com",
        "password": bcrypt.hashpw("tech123".encode(), bcrypt.gensalt())
    }
]

# ✅ Admin Login API
@app.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.json

    role = data.get("role")
    department = data.get("department")
    email = data.get("email")
    password = data.get("password")

    # Search Admin in Database
    for admin in admins:
        if admin["role"] == role and admin["email"] == email:

            # Extra check for HOD department
            if role == "HOD" and admin["department"] != department:
                return jsonify({"error": "Wrong Department"}), 401

            # Password Verification
            if bcrypt.checkpw(password.encode(), admin["password"]):
                return jsonify({"message": "Login Successful ✅"}), 200

    return jsonify({"error": "Invalid Credentials"}), 401


if __name__ == "__main__":
    app.run(debug=True)
