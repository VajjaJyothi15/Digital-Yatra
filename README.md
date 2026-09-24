# Digital Yatra

**Digital Yatra** is an AI-powered tourism platform designed to assist tourists before, during, and after their journey.

## Key Features
- **Sanitation & Restroom Finder**: Clean public restrooms and drinking water points.
- **Touting & Fare Transparency**: Estimated fare calculator & overcharging alert system.
- **Health & Emergency Assist**: Quick access to nearest hospitals & police stations.
- **Transport Reliability**: Route options, estimated fares, travel times.
- **Infrastructure & Incident Reporting**: GPS location-aware problem reporting.
- **Safety Mode**: SOS emergency button, trusted contact location sharing, 112 hotline.
- **AI Travel Assistant**: Contextual chatbot for trip recommendations & adjustments.
- **Admin & Hotspot Analytics**: Real-time problem monitoring & feedback loop for authorities.

## Setup Instructions

### Backend (Flask & SQLite)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python database/seed.py
python app.py
```

### Frontend (React & Vite)
```powershell
cd frontend
npm install
npm run dev
```

### ML Models
```powershell
cd ml
python train_recommendation.py
python train_cost.py
```
