# Unima — University Interaction Management System

## 📌 Overview

**Unima** is a web-based integrated platform designed to improve communication between students and professors in a university environment.

The system provides features such as:

* Professor presence tracking (real-time)
* Meeting request and scheduling
* Real-time notifications using WebSocket
* Student and professor dashboards
* Automatic university meal reservation system
* Interaction history and data tracking

This project was developed as part of a university software engineering project.

📄 **Full Project Proposal:**
See full documentation here:
👉 [Project Proposal](docs/P-Unima.pdf)

---

## 🎯 Project Goals

The main goal of Unima is to build a unified system that:

* Eliminates fragmented communication channels
* Improves meeting scheduling efficiency
* Provides real-time interaction updates
* Automates repetitive tasks like meal reservation
* Improves user experience for both students and professors

---

## 🧠 Key Features

### 👨‍🏫 Professor Features

* Set presence status (Available, Busy, Absent)
* Manage meeting requests
* View interaction history
* Receive real-time notifications
* Manage weekly schedule

### 🎓 Student Features

* View professor availability
* Request meetings
* Receive real-time notifications
* View meeting history
* Manual or automatic meal reservation
* Dashboard overview

### 🔔 Real-Time System

* WebSocket-based notifications
* Instant updates without page refresh

### 🍽️ Auto Meal Reservation

* Automatic daily or weekly reservation
* Simulated university meal API
* Reservation history tracking
* Error and success notification

---

## 🏗️ System Architecture

### Frontend

* HTML
* CSS
* Bootstrap
* JavaScript
* jQuery

### Backend

* ASP.NET Core
* Entity Framework Core
* REST API
* WebSocket

### Database

* SQL Server

### Background Services

* Hangfire (background job processing)

### Deployment

* Docker (optional)
* Local or cloud deployment

---

## 📂 Project Structure

```
Unima/
│
├── docs/
│   └── proposal.pdf
│
├── frontend/
│
├── backend/
│
├── database/
│
└── README.md
```

---

## 🚀 How to Run

### Backend

1. Open solution in Visual Studio
2. Configure database connection string
3. Run migrations
4. Start the server

### Frontend

Open index.html or run frontend project.

---

## 🧪 Technologies Summary

| Layer           | Technology               |
| --------------- | ------------------------ |
| Frontend        | HTML, CSS, Bootstrap, JS |
| Backend         | ASP.NET Core             |
| Database        | SQL Server               |
| Real-Time       | WebSocket                |
| Background Jobs | Hangfire                 |
| ORM             | Entity Framework Core    |

---

## 📖 Documentation

Full system documentation is available in:

```
docs/proposal.pdf
```

Includes:

* System analysis
* Architecture diagrams
* Use Case diagram
* ER diagram
* UI design
* Functional and non-functional requirements

---

## 👨‍💻 Team Members

* Reza Zare
* AmirReza Akhavan
* Seyed Sajjad Tanha

Supervisor:
Mohammad Sadegh Navab

---

## 🎓 Academic Project

This project was developed for academic purposes as part of a university software engineering course.

---

## 📄 License

Educational Use Only
