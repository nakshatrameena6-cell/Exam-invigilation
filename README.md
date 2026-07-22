# 🎓 AI Exam Invigilation System

An AI-powered Exam Invigilation System that automates classroom monitoring using state-of-the-art computer vision techniques. The system detects, tracks, and monitors students from CCTV or recorded examination videos using a dual YOLO model ensemble and generates an annotated output video with unique tracking IDs.

The project is designed with a modular architecture consisting of a **Python backend** for AI inference and a **React frontend** for a modern dashboard, making it suitable for real-world deployments, research, hackathons, and academic demonstrations.


# 🛠 Technology Stack

## Backend

* Python 3.10+
* OpenCV
* PyTorch
* Ultralytics YOLO
* NumPy

## Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion
* React Router
* Axios
* TanStack Query
* Recharts
* Lucide React
* shadcn/ui

---

# 📂 Project Structure

```text
AI-Exam-Invigilation/
│
├── backend/
│   │
│   ├── app/
│   │   ├── config.py
│   │   ├── detector.py
│   │   ├── tracker.py
│   │   ├── drawing.py
│   │   ├── video_processor.py
│   │   ├── main.py
│   │   └── __init__.py
│   │
│   ├── input/
│   │     BACKVIEW.mp4
│   │
│   ├── output/
│   │
│   ├── weights/
│   │     yolo26n.pt
│   │     yolo26s.pt
│   │
│   ├── requirements.txt
│   └── .gitignore
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   ├── components/
│   │   │     Navbar/
│   │   │     Sidebar/
│   │   │     UploadCard/
│   │   │     VideoPlayer/
│   │   │     StatsCard/
│   │   │     StudentTable/
│   │   │     ProgressBar/
│   │   │     Loader/
│   │   │
│   │   ├── pages/
│   │   │     Login/
│   │   │     Dashboard/
│   │   │     Upload/
│   │   │     Results/
│   │   │     Reports/
│   │   │     Settings/
│   │   │
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── docs/
│
├── .gitignore
│
└── README.md
```

---



# ⚙ Installation

## 1. Clone Repository

```bash
git clone https://github.com/your-username/AI-Exam-Invigilation.git

cd AI-Exam-Invigilation
```

---

## 2. Create Virtual Environment

### Windows

```bash
python -m venv venv

venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv

source venv/bin/activate
```

---

## 3. Install Backend Dependencies

```bash
cd backend

pip install -r requirements.txt
```

---

## 4. Install Frontend Dependencies

```bash
cd ../frontend

npm install
```

---

## 5. Run Backend

```bash
cd backend/app

python main.py
```

---

## 6. Run Frontend

```bash
cd frontend

npm run dev
```

---

# 📁 Input Files

Place examination videos inside

```text
backend/input/
```

Example

```text
BACKVIEW.mp4
```

---

# 🧠 Model Files

Place the trained YOLO models inside

```text
backend/weights/
```

```
yolo26n.pt

yolo26s.pt
```

---

# 📤 Output

The processed video will automatically be generated inside

```text
backend/output/
```

Example

```text
output_v2.mp4
```

---

# 📊 Dashboard Modules

* Dashboard Overview
* Upload Center
* Detection Results
* Student Tracking
* Reports
* Settings
* User Profile

---





# 📋 Requirements

## Backend

* Python 3.10+
* OpenCV
* PyTorch
* Ultralytics
* NumPy

## Frontend

* Node.js 20+
* npm
* React
* Vite

---

# 🤝 Contributing

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

# 📜 License

This project is intended for educational, research, and academic purposes. Ensure compliance with institutional privacy policies and local regulations before deploying in real examination environments.

---

# 👨‍💻 Author

**AI Exam Invigilation System**

A modular AI-powered examination monitoring platform developed using deep learning and computer vision to assist educational institutions in automating student detection, tracking, and video-based invigilation.
