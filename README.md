# Unima — University Interaction Management System

## 📌 Overview

**Unima** is a web-based integrated platform designed to streamline and manage academic interactions between students and professors.

The system provides real-time communication, meeting management, and an automated meal reservation system within a unified platform.

📄 **Project Proposal:**
Full system documentation is available here:
👉 [docs/proposal.pdf](docs/P-Unima.pdf)

---

## 🎯 Objectives

The main objectives of this project are:

* Provide a centralized communication system
* Enable real-time interaction between users
* Manage meeting requests efficiently
* Automate repetitive student services such as meal reservation
* Improve academic workflow efficiency

---

## 🧠 Core Features

### Professor

* Manage presence status
* Accept or reject meeting requests
* View interaction history
* Receive real-time notifications
* Manage weekly schedule

### Student

* View professor availability
* Send meeting requests
* Receive instant notifications
* Track interaction history
* Reserve meals manually or automatically

### System Features

* Real-time notification system (WebSocket)
* Automated meal reservation (Hangfire)
* Integrated dashboard for all users
* Structured academic interaction tracking

---

## 🏗️ Architecture

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
* WebSocket (SignalR)

### Database

* SQL Server

### Background Services

* Hangfire

### Infrastructure

* Docker
* Amazon S3 (File Storage)

---

## 📂 Project Structure

```
Unima/
│
├── docs/
│   └── proposal.pdf
│
├── frontend/
├── backend/
├── database/
│
└── README.md
```

---

## 📖 Documentation

Complete project documentation is provided in:

```
docs/proposal.pdf
```

This includes:

* System analysis
* Architecture design
* Database design
* Use Case, ER, and Class diagrams
* UI design samples
* Functional and non-functional requirements

---

## 👨‍💻 Team

* Reza Zare
* AmirReza Akhavan
* Seyed Sajjad Tanha
* Hamid Ghasemi

Supervisor:
Mohammad Sadegh Navab

---

## ⚙️ Deployment

This project is designed using containerized infrastructure (Docker-based deployment).

Setup and deployment configuration are defined within the project environment.

---

## 🎓 Academic Context

This project was developed as part of a university academic software engineering project.

---

## 📄 License

This project is intended for academic and educational use.
