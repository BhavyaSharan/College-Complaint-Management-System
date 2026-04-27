# College Complaint Management System

A modernized campus Complaint Management System featuring a professional glassmorphic UI, secure student authentication flow with domain-specific validation, automated complaint routing, and a multi-stage resolution workflow.

## Project Structure

This project is divided into two main parts:
- `frontend/`: A Vite + React application styled with Tailwind CSS, using Framer Motion for animations and Supabase for some services.
- `backend/`: A Flask application serving the API.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed (for the frontend)
- Python 3.x installed (for the backend)

## Setup Instructions

### 1. Backend Setup

Navigate to the backend directory and install the required Python packages.

```bash
cd backend
pip install -r requirements.txt
```

Run the backend server:

```bash
python app.py
```
The server will typically start on `http://127.0.0.1:5000` (or another port depending on `app.py`).

### 2. Frontend Setup

Open a new terminal window, navigate to the frontend directory, and install the required npm packages.

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173`. Open this URL in your web browser to view the application.

## Technologies Used

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, React Router DOM, Recharts, tsParticles, Supabase (for auth/database if configured).
- **Backend:** Python, Flask, Flask-CORS, Bcrypt.
