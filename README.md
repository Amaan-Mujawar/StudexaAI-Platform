# 🚀 StudexaAI

### *Your AI-Powered Study Companion*

[![Status](https://img.shields.io/badge/Status-Active%20Development-blue?style=for-the-badge)](/)
[![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20AI-navy?style=for-the-badge)](/)
[![License](https://img.shields.io/badge/License-MIT-steelblue?style=for-the-badge)](/)

> **StudexaAI** is a professional, AI-powered study platform that centralizes and enhances the student learning experience through advanced automation, intelligent note generation, and personalized educational tools.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Models](#-database-models)
- [Routing](#-routing--navigation)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Team](#-team)

---

## 🧠 Overview

**StudexaAI** is built for high school and college students, as well as competitive exam aspirants. The platform reduces cognitive load by automating study material generation and providing a gamified, structured environment for skill-building.

| | |
|---|---|
| 🎯 **Purpose** | Centralize and automate the student learning experience using AI |
| 👥 **Target Users** | Students, competitive exam aspirants, and education-focused learners |
| ⚡ **AI Engine** | GROQ SDK — high-speed, high-quality LLM responses |
| 📦 **Status** | MVP — Active Development |

---

## ✨ Features

### 🗒️ AI Notes Module *(Core)*
- Generate **Short or Detailed** structured study notes on any topic
- **History Sidebar** — instantly revisit past notes
- **Regeneration** — rewrite or enhance existing notes with one click
- Direct integration with the **AI Todo** module

### 🧪 AI Quiz & Practice
- Dynamically generate quizzes based on any topic
- Score tracking with **detailed attempt reviews**
- Dedicated modules for **Aptitude, Logical Reasoning, and Verbal Reasoning**
- Performance analytics and history tracking per module

### ✅ AI Todo (Task Manager)
- Collaborative task management with AI-assisted sub-task suggestions
- Generate a full study plan from a single high-level goal

### 🏆 Contests
- Gamified, timed competition section for students

### 🛠️ Admin Dashboard
- Centralized management for users, content, and platform settings

### 🎫 Support Tickets
- Integrated helpdesk for user issue reporting

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js (Vite) |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **AI Integration** | GROQ SDK (LLM) |
| **Real-time** | Socket.io |
| **Auth** | JWT + OTP Verification |
| **Deployment** | Vercel (Frontend) · Render / AWS EC2 (Backend) · MongoDB Atlas |

---

## 🏗️ Architecture

```
User
 │
 ├── React SPA (Vite)
 │    ├── /src/features        → Component-based feature modules
 │    ├── /src/context         → Global state (Auth, SidebarHistory)
 │    └── /src/layouts         → Dashboard & Admin wrappers
 │
 └── Node.js / Express API
      ├── /src/modules         → Controllers, Models, Routes per feature
      └── /src/services        → Shared business logic (AI Service, etc.)
 │
 ├── MongoDB (Mongoose)        → Persistent data storage
 ├── GROQ AI SDK               → LLM-powered content generation
 └── Socket.io                 → Real-time contest updates
```



---
 
## 🏗️ System Architecture
 
```
                        ┌─────────────────────┐
                        │        USER         │
                        └─────────┬───────────┘
                                  │ HTTPS
                        ┌─────────▼───────────┐
                        │   React SPA (Vite)  │
                        │                     │
                        │  /features  ──────► Component Modules
                        │  /context   ──────► Auth, SidebarHistory
                        │  /layouts   ──────► Dashboard, Admin
                        └─────────┬───────────┘
                                  │ API Requests
                        ┌─────────▼───────────┐
                        │  Node.js + Express  │
                        │                     │
                        │  /modules   ──────► Controllers, Routes
                        │  /services  ──────► AI Service Layer
                        └──┬──────────────┬───┘
                           │              │
              ┌────────────▼──┐    ┌──────▼────────────┐
              │   MongoDB     │    │    GROQ AI SDK     │
              │   (Atlas)     │    │   (LLM Engine)     │
              └───────────────┘    └───────────────────┘
                           │
              ┌────────────▼──────────────┐
              │        Socket.io          │
              │   (Real-time Contests)    │
              └───────────────────────────┘

```
---

## 🗄️ Database Models

| Entity | Description | Relationships |
|---|---|---|
| `User` | Core user profile, auth data, and AI usage tracking | Parent to all entities |
| `AiNote` | AI-generated notes, subject, and mode (short/detailed) | Linked to `User`, optional `Todo` |
| `QuizAttempt` | Records of quiz sessions and scores | Linked to `User` |
| `Todo` | User tasks and AI-generated task drafts | Linked to `User` |

---

## 🔗 Routing & Navigation

| Path | Access | Description |
|---|---|---|
| `/` | Public | Landing Page |
| `/login` | Public | Login & Registration |
| `/dashboard` | 🔒 Protected | User Stats & Quick Actions |
| `/dashboard/ai-note` | 🔒 Protected | AI Notes Generator & Viewer |
| `/dashboard/ai-quiz` | 🔒 Protected | Quiz History & New Session |
| `/admin/*` | 🔒 Admin Only | Administrative Tools |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- GROQ API Key

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs on **port 5173 / 5174** (Vite default)

---

## 🔐 Environment Variables

### Backend `.env`

```env
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

---

## ☁️ Deployment

| Service | Platform |
|---|---|
| **Frontend** | Vercel or Netlify |
| **Backend** | Render or AWS EC2 |
| **Database** | MongoDB Atlas |

---

## 🗺️ Roadmap

- [x] AI Notes Generation (Short & Detailed)
- [x] History Sidebar with Navigation
- [x] AI Quiz with Score Tracking
- [x] Aptitude & Reasoning Practice Modules
- [x] AI Todo with Sub-task Suggestions
- [x] Contest Module
- [ ] **Collaborative Notes** — Share AI notes with peers
- [ ] **PDF Export** — Export notes and quiz results
- [ ] **Advanced Analytics** — Visual progress tracking over time

---

## 👥 Team

Built with ❤️ for the Hackathon

| Role | Name |
|---|---|
| 👑 **Team Leader** | Amaan Mujawar |
| 💻 **Member** | Ninad Ubale |
| 💻 **Member** | Rohan Bejgamwar |

---


**StudexaAI™ — Empowering Students with the Power of AI**

*Made with ❤️ · Powered by GROQ · Built on MERN*
 
 
© 2025 StudexaAI™ · Amaan Mujawar, Ninad Ubale & Rohan Bejgamwar · All Rights Reserved.
 
*Unauthorized reproduction, distribution, or use of this software or its contents, in whole or in part, is strictly prohibited without prior written permission from the authors.*
 
