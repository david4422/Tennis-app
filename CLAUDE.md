
# Tennis-app
platphorm to find teniss matches with other people. talk and feel tennis:)

## About
- Project owner: David Cohen
- Language: Python & React
- Project directory: C:\Users\david\Desktop\ארז Jarvis\Teniss

## Personal Info
- Name: David Cohen
- Address: Even Gvirol 90
- Phone: 0506946636
- Email: davidcohen6636@gmail.com

## Preferences
- Write code in VS Code (files are edited directly on the filesystem)
- Communicate in English
- Keep code simple and clean


# 🎾 Tennis Matchmaking App

An application for scheduling tennis matches with automatic matchmaking, chat, notifications, and payments.

## 🏗️ Architecture

- **Backend**: Flask (Python) - REST API
- **Frontend**: React (js)
- **Database**: PostgreSQL / SQLite (for development)
- **Docker**: Containerization

## 📁 Project Structure

```
tennis-matchmaking/
├── backend/              # Flask API
│   ├── app.py           # Flask application
│   ├── models/          # Database models
│   ├── controllers/     # API controllers
│   ├── managers/        # Business logic
│   ├── repositories/    # Data access layer
│   └── services/        # External services (notifications, payments)
├── frontend/            # Streamlit UI
│   ├── pages/           # React pages
│   └── services/        # API client services
├── docker-compose.yml   # Docker setup
└── requirements.txt     # Python dependencies
```

## 🚀 Installation and Running

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Environment Variables
Create a `.env` file:
```
DATABASE_URL=sqlite:///tennis_matchmaking.db
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
```

### 3. Run Backend (Flask)
```bash
cd backend
python app.py
```

### 4. Run Frontend (Streamlit)
```bash
cd frontend
npm run dev
```


## 📋 Features (MVP)

- ✅ Registration and Login
- ✅ Create Match Requests
- ✅ Automatic Matchmaking Between Players
- ✅ Chat Between Players
- ✅ Player Ratings
- ✅ Push Notifications
- ✅ Tournaments

## 🔄 Workflow

1. **Frontend (Streamlit)** → Sends HTTP requests to **Backend (Flask)**
2. **Backend** → Processes the request through Controllers → Managers → Repositories
3. **Repositories** → Communicate with Database
4. **Response** → Returns to Frontend via JSON

## 🛠️ Technologies

- Python 3.10+
- Flask 3.0
- React
- SQLAlchemy 2.0
- PostgreSQL / SQLite
