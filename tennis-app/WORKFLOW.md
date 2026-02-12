# 🎾 Tennis Matchmaking App - Workflow & Development Plan

## 📋 Development Approach: MVP + Vertical Slices

**Concept:** Build one complete feature from start to finish (Frontend → Backend → Database), test it works, then move to the next feature.

**Why this is good:**
- ✅ Works end-to-end quickly
- ✅ Easy to test and identify problems early
- ✅ Provides immediate value
- ✅ Allows iteration and improvement

---

## 🏗️ Architecture (Based on Diagram)

```
Frontend (Streamlit) 
    ↓
Services (API Client)
    ↓
Backend API (Flask)
    ↓
Controllers (API Layer)
    ↓
Managers (Business Logic)
    ↓
Repositories (Data Access)
    ↓
Database (SQLite/PostgreSQL)
```

**Flow:**
1. Frontend → Service → sends HTTP request to Backend
2. Backend → Controller → receives the request
3. Controller → Manager → processes business logic
4. Manager → Repository → communicates with Database
5. Response → returns through the same path back to Frontend

---

## 📝 Development Stages

### ✅ Stage 1: Infrastructure Setup (COMPLETED)
- [x] Create project folder structure
- [x] Set up basic Flask app
- [x] Set up config.py with environment variables
- [x] Set up CORS
- [x] Set up Database connection

### 🔄 Stage 2: Database Connection (IN PROGRESS)
- [x] Create `backend/models/database.py`
- [x] Connect SQLAlchemy to Database
- [x] Update `app.py` to use Database
- [ ] Test: Database creation works

### 📦 Feature #1: User Registration (NEXT)
**Goal:** User can register to the app

**What we'll build:**
1. **Database:** Users table
   - `backend/models/user.py` - User model
   - Fields: id, name, email, phone, skill_level, password_hash, created_at

2. **Backend:**
   - `backend/repositories/user_repository.py` - Database access
   - `backend/managers/user_manager.py` - Business logic (password hashing)
   - `backend/controllers/user_controller.py` - API endpoints
   - Route: `POST /api/users/register`

3. **Frontend:**
   - `frontend/pages/register.py` - Registration page in Streamlit
   - `frontend/services/user_service.py` - Sends requests to Backend

4. **Test:** Registration works end-to-end

---

### 📦 Feature #2: User Login
**Goal:** User can log in

**What we'll build:**
1. **Backend:**
   - `POST /api/users/login` - Returns JWT token
   - Authentication middleware

2. **Frontend:**
   - `frontend/pages/login.py` - Login page
   - Store token in session

---

### 📦 Feature #3: Match Request Creation
**Goal:** User can create a match request

**What we'll build:**
1. **Database:** MatchRequests table
   - `backend/models/match_request.py`
   - Fields: id, user_id, time_range_start, time_range_end, location, status, created_at

2. **Backend:**
   - `backend/repositories/match_request_repository.py`
   - `backend/managers/match_request_manager.py`
   - `backend/controllers/match_request_controller.py`
   - Route: `POST /api/match-requests`

3. **Frontend:**
   - `frontend/pages/create_request.py` - Create request page
   - `frontend/services/match_service.py`

---

### 📦 Feature #4: Match List
**Goal:** User can see list of match requests

**What we'll build:**
1. **Backend:**
   - `GET /api/match-requests` - Returns list of requests

2. **Frontend:**
   - `frontend/pages/match_list.py` - Match list page

---

### 📦 Feature #5: Match Matching
**Goal:** Automatic matching between requests

**What we'll build:**
1. **Database:** Matches table
   - `backend/models/match.py`

2. **Backend:**
   - Matching logic in `match_manager.py`
   - `POST /api/matches` - Create match

---

### 📦 Feature #6: Chat
**Goal:** Players can chat

**What we'll build:**
1. **Database:** Messages table
   - `backend/models/message.py`

2. **Backend:**
   - `GET /api/matches/{match_id}/messages`
   - `POST /api/matches/{match_id}/messages`

3. **Frontend:**
   - `frontend/pages/chat.py` - Chat page

---

### 📦 Feature #7: Ratings
**Goal:** Rate players after match

**What we'll build:**
1. **Database:** Ratings table
   - `backend/models/rating.py`

2. **Backend:**
   - `POST /api/ratings`

3. **Frontend:**
   - `frontend/pages/rate_player.py`

---

### 📦 Feature #8: Tournaments
**Goal:** Create tournaments

**What we'll build:**
1. **Database:** Tournaments table
   - `backend/models/tournament.py`

2. **Backend:**
   - `POST /api/tournaments`
   - `GET /api/tournaments`

3. **Frontend:**
   - `frontend/pages/tournaments.py`

---

## 🛠️ Work Guidelines

### Before starting a new Feature:
1. ✅ Check that previous code works
2. ✅ Make commit to git (if available)
3. ✅ Read the plan here

### During Feature development:
1. **Database** → **Backend** → **Frontend** (in this order)
2. Test each stage before moving to the next
3. If stuck - ask!

### After finishing a Feature:
1. ✅ Test that the entire flow works end-to-end
2. ✅ Update the checklist here
3. ✅ Move to next Feature

---

## 📚 File Structure

```
tennis-app/
├── backend/
│   ├── app.py                    # Flask application
│   ├── config.py                 # Configuration
│   ├── models/
│   │   ├── database.py           # DB connection
│   │   ├── user.py              # User model
│   │   ├── match_request.py     # MatchRequest model
│   │   └── ...
│   ├── controllers/
│   │   ├── user_controller.py
│   │   └── ...
│   ├── managers/
│   │   ├── user_manager.py
│   │   └── ...
│   └── repositories/
│       ├── user_repository.py
│       └── ...
├── frontend/
│   ├── pages/
│   │   ├── register.py
│   │   ├── login.py
│   │   └── ...
│   └── services/
│       ├── user_service.py
│       └── ...
├── .env                          # Environment variables
├── requirements.txt              # Python dependencies
└── WORKFLOW.md                   # This file
```

---

## 🎯 Final Goal

Complete app with:
- ✅ Registration and login
- ✅ Create match requests
- ✅ Automatic matching
- ✅ Chat between players
- ✅ Player ratings
- ✅ Tournaments
- ✅ Notifications (future)
- ✅ Payments (future)

---

## 📌 Current Status

**Last Updated:** Database connection setup completed ✅

**Next Step:** Create User model (Feature #1)

---

## 💡 Important Notes

- All code comments should be in English
- Follow the architecture: Frontend → Controller → Manager → Repository → Database
- Test each feature end-to-end before moving to the next
- Keep this file updated as we progress
