
# 📢 Complaint Management Platform

A web-based platform designed to **empower Rwandan citizens** to **submit complaints and feedback** directly to leaders—without the need to log in. This solution bridges communication gaps, promotes transparency, and enhances public service accountability.
For Users its now kinyarwanda based 

---

## 🧾 Table of Contents

* [Project Structure](#-project-structure)
* [Features](#-features)
* [Tech Stack](#-tech-stack)
* [Setup Instructions](#-setup-instructions)
* [Live Demo](#-live-demo)
* [Location API](#-location-api)
* [Future Enhancements](#-future-enhancements)
* [Author](#-author)
* [License](#-license)

---

## 📁 Project Structure

```
complaint-platform/
├── server/        # Backend - Node.js, Express, MongoDB
├── view/          # Frontend - React (Vite), Tailwind CSS
└── README.md
```

---

## 🚀 Features

### 🌍 Public Users (No Login Required)

* 📝 Submit complaints and feedback anonymously or with contact info
* 📍 Select precise location using Rwanda Location API
* 📨 Get optional confirmation via email with tracking code

### 🛠️ Admin / Leaders

* 📥 View all complaints and feedback
* 🧭 Filter by type, status, and location
* 💬 Respond or mark as resolved

---

## 🛠 Tech Stack

| Layer        | Tech Used                            |
| ------------ | ------------------------------------ |
| Frontend     | React (Vite) + Tailwind CSS          |
| Backend      | Node.js, Express                     |
| Database     | MongoDB (hosted via Railway)         |
| Email        | Nodemailer + Brevo SMTP              |
| Hosting      | Vercel (Frontend), Railway (Backend) |
| Location API | Rwanda Location API                  |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/aine1100/complaint-platform.git
cd complaint-platform
```

### 2. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../view
npm install
```

### 3. Configure Environment Variables

#### server/.env

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
```

---

## 📡 Live Demo

* 🔗 **Frontend** (Vercel): *coming soon*
* 🔗 **Backend** (Railway): [https://complaints-api-production.up.railway.app](https://complaints-api-production.up.railway.app)

---

## 🌍 Location API Integration

This project uses the Rwanda Location API for selecting user locations dynamically:

> 🌐 [https://rwandalocations-production.up.railway.app/api](https://rwandalocations-production.up.railway.app/api)

Used to fetch:

* Provinces
* Districts
* Sectors
* Cells
* Villages

---

## 🔮 Future Enhancements

* 📊 Admin dashboard with visual analytics
* 🔐 Authentication for advanced admin controls
* 📱 SMS feedback notifications
* 🌐 Multi-language support (Kinyarwanda / English)

---

## 👨‍💻 Author

**Aine Dushimire**
GitHub: [@aine1100](https://github.com/aine1100)
Email: [ainedushimire@gmail.com](mailto:ainedushimire@gmail.com)

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

