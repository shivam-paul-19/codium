# 🌐 Codium

**A collaborative code editor powered by WebSockets 🚀**  
Work on code in real time with others — like VS Code + teamwork magic ✨

---

## 🔗 Live Demo

Check it out here: https://codium-iota.vercel.app

---

## 📌 About

Codium is a real-time collaborative code editor built using WebSockets.  
Multiple users can edit code simultaneously and see changes live, just like Google Docs for code.

---

## 🧱 Features

- 🖋️ Real-time shared editing  
- 🌍 Live WebSocket connection between users  
- 🛠️ Frontend + backend integration  
- 🎨 Syntax-friendly UI (editor)  
- 🚀 Easy to start and test

---

## 📁 Project Structure
├── frontend/ # Web app interface (React / JS)\
├── backend/ # Server (Node.js + WebSockets)\
├── .github/ # Github workflows\
├── .gitignore\
└── README.md


---

## 🧰 Tech Stack

| Part       | Tech Used         |
|------------|------------------|
| Frontend   | JavaScript / TypeScript / CSS |
| Backend    | Node.js + WebSockets |
| Collaboration | real-time sync  |

---

## ⚙️ DevOps & Deployment

Codium follows a basic yet effective DevOps workflow to ensure smooth development, testing, and deployment.

### 🔁 CI/CD Pipeline

- Implemented **Continuous Integration and Continuous Deployment (CI/CD)** using **GitHub Actions**
- On every push:
  - Code is automatically built
  - Dependencies are installed
  - Basic checks are performed
- Ensures that broken code never reaches production 🚫

---

### 🐳 Docker Integration

- The application is **containerized using Docker**
- Separate containers for:
  - Frontend
  - Backend
- Docker helps in:
  - Consistent environment across development & production
  - Easy deployment without dependency conflicts
  - Faster onboarding for contributors

---

### ☁️ AWS EC2 Deployment

- Deployed the backend on an **AWS EC2 instance**
- Steps followed:
  - Provisioned EC2 with Linux
  - Installed Docker & Node.js
  - Pulled Docker images and ran containers
- The server listens for WebSocket connections, enabling real-time collaboration

---

### 🧠 Why This Matters

- CI/CD → **Automation & reliability**
- Docker → **Scalability & portability**
- AWS EC2 → **Cloud-ready production setup**

This DevOps setup makes Codium production-ready and easy to scale in the future.

    
