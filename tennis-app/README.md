# 🎾 Tennis Matchmaking App

אפליקציה לקביעת משחקי טניס עם התאמה אוטומטית, צ'אט, התראות ותשלומים.

## 🏗️ ארכיטקטורה

- **Backend**: Flask (Python) - REST API
- **Frontend**: React (js)
- **Database**: PostgreSQL / SQLite (לפיתוח)
- **Docker**: Containerization

## 📁 מבנה הפרויקט

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

## 🚀 התקנה והרצה

### 1. התקנת תלויות
```bash
pip install -r requirements.txt
```

### 2. הגדרת משתני סביבה
צור קובץ `.env`:
```
DATABASE_URL=sqlite:///tennis_matchmaking.db
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
```

### 3. הרצת Backend (Flask)
```bash
cd backend
python app.py
```

### 4. הרצת Frontend (Streamlit)
```bash
cd frontend
npm run dev 
```

### 5. הרצה עם Docker
```bash
docker-compose up
```

## 📋 Features (MVP)

- ✅ הרשמה והתחברות
- ✅ יצירת בקשות למשחק (Match Requests)
- ✅ התאמה אוטומטית בין שחקנים
- ✅ צ'אט בין שחקנים
- ✅ דירוג שחקנים
- ✅ התראות Push
- ✅ טורנירים

## 🔄 Workflow

1. **Frontend (Streamlit)** → שולח בקשות HTTP ל-**Backend (Flask)**
2. **Backend** → מעבד את הבקשה דרך Controllers → Managers → Repositories
3. **Repositories** → מתקשרים עם Database
4. **Response** → חוזר ל-Frontend דרך JSON

## 🛠️ טכנולוגיות

- Python 3.10+
- Flask 3.0
- React
- SQLAlchemy 2.0
- PostgreSQL / SQLite
