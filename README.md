# 📢 Ivugire Complaint Management Platform

![Ivugire Logo](./view/public/ivugire.svg) <!-- Add your logo here -->

A web-based platform designed to **empower Rwandan citizens** to **submit complaints and feedback** directly to relevant leaders and authorities—without the need for mandatory login. This solution aims to bridge communication gaps, promote transparency, and enhance accountability in public service delivery.

🌐 Supports **Kinyarwanda** and **English** languages for broader accessibility.

---

## 🧾 Table of Contents

* [Project Overview](#-project-overview)
* [Features](#-features)
* [Tech Stack](#-tech-stack)
* [Project Structure](#-project-structure)
* [Setup Instructions](#-setup-instructions)
* [Environment Variables](#-environment-variables)
* [Running the Application](#-running-the-application)
* [Live Demo](#-live-demo)
* [Location API](#-location-api)
* [Future Enhancements](#-future-enhancements)
* [Author](#-author)
* [License](#-license)

---

## ✨ Project Overview

Ivugire provides a seamless experience for citizens to voice their concerns and provide feedback on public services in Rwanda. By offering an easy-to-use interface with location-based reporting and optional contact details, it ensures that feedback reaches the right channels. The administrative interface allows officials to efficiently manage, track, and respond to submissions, fostering a more responsive governance system.

---

## 🚀 Features

### 🌍 Public Users (Accessible without Login)

*   📝 **Complaint & Feedback Submission:** Citizens can easily submit detailed complaints or feedback.
*   📍 **Precise Location Tagging:** Utilize the Rwanda Location API to pinpoint the exact location related to the submission (Province, District, Sector, Cell, Village).
*   📨 **Email Notifications:** Users can optionally provide an email to receive a tracking code and updates on their submission status and response.
*   🔍 **Complaint Tracking:** Users can track the status and view responses to their complaints using the provided tracking code.
*   🌐 **Multilingual Support:** The user interface is available in both **Kinyarwanda** and **English**.

### 🛠️ Admin / Leaders (Requires Authentication)

*   🔐 **Secure Admin Login:** Dedicated login for staff to access the administrative dashboard.
*   📊 **View Submissions:** Browse and manage all submitted complaints and feedback.
*   🔍 **Filtering & Sorting:** Easily filter submissions by type, current status, and specific location (Province, District).
*   📈 **Complaint Statistics:** View statistics including total complaints, breakdown by status, province, and district.
*   💬 **Status & Response Updates:** Admins can update the status and provide a written response to complaints.

---

## 🛠️ Tech Stack

| Layer        | Technology                            | Description                                    |
| :----------- | :------------------------------------ | :--------------------------------------------- |
| **Frontend** | React (Vite)                          | Modern JavaScript library for building UIs     |
|              | Tailwind CSS                          | Utility-first CSS framework for styling        |
|              | `@tanstack/react-query`               | Data fetching, caching, and state management   |
|              | `react-router-dom`                    | Declarative routing for React                  |
|              | `sonner`                              | Accessible and customizable toast library      |
| **Backend**  | Node.js, Express                      | JavaScript runtime and web application framework |
| **Database** | MongoDB                               | NoSQL database                                 |
| **Email**    | Nodemailer + Brevo (Sendinblue) SMTP | Sending email notifications                    |
| **Hosting**  | Vercel (Frontend)                     | Serverless hosting for the frontend            |
|              | Railway (Backend & Database)          | Cloud platform for hosting the backend & DB    |
| **External** | Rwanda Location API                   | API for fetching Rwandan administrative divisions |

---

## 📁 Project Structure

```
complaint-platform/
├── server/        # Backend - Node.js, Express, MongoDB
├── view/          # Frontend - React (Vite), Tailwind CSS
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/aine1100/complaint-platform.git
cd complaint-platform
```

### 2. Install Dependencies

Open two separate terminal windows, one for the backend (`server`) and one for the frontend (`view`).

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd view
npm install
```

---

## 🔑 Environment Variables

You need to create `.env` files in both the `server` and `view` directories.

#### `server/.env`

Create this file in the `server` directory and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string # Get this from your MongoDB provider (e.g., Railway, MongoDB Atlas)
EMAIL_USER=your_email@gmail.com # Your Gmail address
EMAIL_PASS=your_email_app_password # Generate an App Password in your Google Account settings
# Add your location API URL if not using the public one directly
# LOCATION_API_URL=https://rwandalocations-production.up.railway.app/api
```

#### `view/.env`

Create this file in the `view` directory and add the following variable. **Ensure this points to your deployed backend URL.**

```env
VITE_BACKEND_URL=http://localhost:5000 # Use your backend's local or deployed URL (e.g., https://your-backend-url.railway.app)
```

---

## 🏃 Running the Application

Open two separate terminal windows.

#### Start Backend

```bash
cd server
npm start
```

The backend server should start on the specified `PORT` (default 5000).

#### Start Frontend

```bash
cd view
npm run dev
```

The frontend development server should start. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

---

## 📡 Live Demo

*   🔗 **Frontend** (Vercel): [https://ivugire-v2.vercel.app/](https://ivugire-v2.vercel.app/)
*   🔗 **Backend** (Railway): [https://complaints-api-production.up.railway.app](https://complaints-api-production.up.railway.app)

_Note: The live demo uses the public Rwanda Location API directly._

---

## 🌍 Location API Details

This project integrates with the public Rwanda Location API to provide users with accurate administrative divisions for location selection during complaint submission:

> 🌐 **API Endpoint:** `https://rwandalocations-production.up.railway.app/api`

The API is used to fetch a hierarchical list of Provinces, Districts, Sectors, Cells, and Villages in Rwanda.

---

## 🔮 Future Enhancements

*   📈 More advanced admin dashboard visualizations (charts beyond basic bars).
*   🔑 Granular admin roles and permissions.
*   📱 SMS notifications for complaint updates.
*   🔗 Option to attach files/images to complaints.
*   🗺️ Map integration for visualizing complaint locations.

---

## 👨‍💻 Author

**Aine Dushimire**

*   GitHub: [@aine1100](https://github.com/aine1100)
*   Email: [ainedushimire@gmail.com](mailto:ainedushimire@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

