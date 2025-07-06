<div align="center">
  <br />
  <a href="https://zenith-acad.vercel.app" target="_blank">
    <img src="public/readme/hero.png" alt="Zenith Academy Banner">
  </a>
  <br />
  <div>
    <img alt="Static Badge" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white">
    <img alt="Static Badge" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
    <img alt="Static Badge" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img alt="Static Badge" src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white">
    <img alt="Static Badge" src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
  </div>
  <h1>Zenith Academy</h1>
  <h3>Online Education Platform for You</h3>
  <p><a href="https://zenith-acad.vercel.app" target="_blank"><b>Check Live</b></a></p>
</div>

## 📋 Table of Contents

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🏗️ [System Architecture](#system-architecture)
5. ⚡ [API Design](#api-design)
6. 🤝 [How to Contribute](#how-to-contribute)

---

## 🤖 Introduction

Zenith Academy is a fully functional ed-tech platform enabling users to create, consume, and rate educational content. Built with the MERN stack, it provides:

- A seamless and interactive learning experience for students.
- A platform for instructors to showcase expertise and connect globally.

Explore the platform: [Zenith Academy Live](https://zenith-acad.vercel.app)

---

## ⚙️ Tech Stack

| Category    | Technology | Description |
|-------------|------------|-------------|
| **Frontend** | <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" /> <br> <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" /> <br> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /> <br> <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /> <br> <img src="https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white" alt="Zustand" /> <br> <img src="https://img.shields.io/badge/Framer_Motion-EF0087?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" /> | Built with Next.js for SSR and performance, React 19 for UI, TypeScript for type safety, Tailwind CSS for responsive styling, Zustand for lightweight state management, and Framer Motion for animations. |
| **Backend** | <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /> <br> <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" /> <br> <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /> <br> <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" /> <br> <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" /> <br> <img src="https://img.shields.io/badge/Bcrypt-563D7C?style=for-the-badge&logo=bcrypt&logoColor=white" alt="Bcrypt" /> <br> <img src="https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=white" alt="Razorpay" /> <br> <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" /> | Node.js with Express.js for server-side logic and RESTful APIs, MongoDB with Mongoose for database management, JWT and Bcrypt for authentication and security, Razorpay for payments integration, and Cloudinary for media storage. |
| **Tools & Deployment** | <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" /> <br> <img src="https://img.shields.io/badge/Turborepo-000000?style=for-the-badge&logo=turbo&logoColor=white" alt="Turborepo" /> <br> <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /> | Deployed on Vercel for global delivery, using Turborepo for monorepo management and build optimization, with GitHub for version control. |

---

## 🔋 Features

Zenith Academy offers a comprehensive set of features for students and instructors to deliver an engaging online education experience.

### 🎓 For Students

- **Homepage** – Overview of the platform with featured courses and quick navigation.
- **Course List** – Browse all available courses with detailed descriptions, ratings, and instructor information.
- **Wishlist** – Add courses to your wishlist for future enrolment.
- **Cart & Checkout** – Secure cart management and payment processing with Razorpay integration.
- **Course Content** – Access enrolled course content, including videos, notes, and interactive materials.
- **Progress Tracking** – Monitor lesson completion, quiz scores, and overall course progress.
- **User Profile** – View and edit personal account details and enrolment history.


### 👨‍🏫 For Instructors

- **Instructor Dashboard** – Overview of created courses with ratings, enrolment statistics, and income tracking.
- **Course Management** – Create, update, and delete courses with multimedia content uploads via Cloudinary.
- **Insights** – View detailed analytics on course views, clicks, enrolments, and earnings.
- **Profile Management** – Edit personal and professional instructor details to maintain credibility.


### 🔧 Platform Features

- **Secure Authentication** – JWT-based login and registration with Bcrypt password hashing and role-based access.
- **Payment Integration** – Razorpay gateway for seamless and secure course purchases.
- **Responsive Design** – Mobile-first, accessible UI built with Tailwind CSS and Framer Motion animations for smooth interactions.
- **Dynamic Search & Filtering** – Efficient course search and category-based filtering for enhanced user experience.
- **RESTful APIs** – Structured APIs built with Express.js and Node.js for scalable backend operations.
- **Cloud-based Media Management** – Cloudinary integration for storing and serving course images and videos efficiently.
- **Monorepo Architecture** – Managed with Turborepo for optimized build performance and maintainability.


Zenith Academy is designed for scalability, security, and an intuitive learning experience to empower students and instructors worldwide.

---

<!-- 
### 🏗️ **System Architecture**

Zenith Academy follows a **modular, scalable client-server architecture** consisting of:

- ✅ **Frontend** – Next.js, React, Tailwind CSS, Zustand, Framer Motion
- ✅ **Backend** – Node.js, Express.js REST API
- ✅ **Database** – MongoDB with Mongoose ODM
- ✅ **Integrations** – Razorpay for payments, Cloudinary for media storage
![Architecture Diagram](apps/web/public/readme/architecture.png)

--- -->

### 🔷 **Architecture Diagram**

```mermaid
graph TD
    subgraph User Side
        User[User Browser]
    end

    subgraph Frontend
        FE[Next.js App]
    end

    subgraph Backend
        BE[Node.js + Express.js Server]
    end

    subgraph Database
        DB[MongoDB with Mongoose ODM]
    end

    subgraph External Services
        Razorpay[Razorpay Payments]
        Cloudinary[Cloudinary Media Storage]
    end

    User --> FE
    FE --> BE
    BE --> DB
    BE --> Cloudinary
    FE --> Razorpay
```

---

## ⚡ API Design

Zenith Academy's backend follows a **RESTful API design**, built with **Node.js and Express.js**, using **JSON** for data exchange and standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).


### 🔷 **Authentication APIs**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register a new user (student or instructor). |
| `/api/auth/login` | POST | Login with existing credentials, returns JWT token. |
| `/api/auth/verify-otp` | POST | Verify OTP sent to user's email. |
| `/api/auth/forgot-password` | POST | Sends password reset link to registered email. |


### 🔷 **Course Management APIs**

| Endpoint                | Method | Description                            |
| ----------------------- | ------ | -------------------------------------- |
| `/api/courses`          | GET    | Fetch all available courses.           |
| `/api/courses/:id`      | GET    | Fetch specific course details by ID.   |
| `/api/courses`          | POST   | Create a new course (Instructor only). |
| `/api/courses/:id`      | PUT    | Update an existing course by ID.       |
| `/api/courses/:id`      | DELETE | Delete a course by ID.                 |
| `/api/courses/:id/rate` | POST   | Add a rating (out of 5) to a course.   |


### 🔷 **User APIs**

| Endpoint                  | Method | Description                     |
| ------------------------- | ------ | ------------------------------- |
| `/api/users/:id`          | GET    | Get user profile by ID.         |
| `/api/users/:id`          | PUT    | Update user profile details.    |
| `/api/users/:id/courses`  | GET    | Fetch courses enrolled by user. |
| `/api/users/:id/wishlist` | GET    | Fetch user's wishlist items.    |


### 🔷 **Payment APIs**

| Endpoint               | Method | Description                           |
| ---------------------- | ------ | ------------------------------------- |
| `/api/payments/order`  | POST   | Create a new Razorpay order.          |
| `/api/payments/verify` | POST   | Verify payment success post checkout. |


This **robust API design** ensures a scalable, secure, and maintainable backend for Zenith Academy, enabling seamless interaction between frontend and backend services.

---


## 🤝 How to Contribute

We welcome contributions from the community to improve Zenith Academy. Follow these steps to get started:

### ⚡ Prerequisites

Ensure you have the following installed:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [pnpm](https://pnpm.io/)

### 📝 Steps to Contribute

##### 1. **Fork the repository**

- Click the `Fork` button at the top right of this page to create your own copy. 


##### 2. **Clone your forked repository**

```bash
git clone https://github.com/your-username/Zenith-Academy.git
cd Zenith-Academy
````

##### 3. **Install dependencies using pnpm**

```bash
pnpm install
```

##### 4. **Create a new branch for your feature or bug fix**

```bash
git checkout -b feature/YourFeatureName
```

##### 5. **Make your changes**

- Ensure your code follows the project’s coding standards and includes relevant tests if applicable.

##### 6. **Commit your changes**

```bash
git add .
git commit -m "Add YourFeatureName"
```

##### 7. **Push to your branch**

```bash
git push origin feature/YourFeatureName
```

##### 8. **Create a Pull Request**

Go to your forked repository on GitHub and click `Compare & pull request`. Add a clear description of your changes.
  
### 💡 Contribution Guidelines

- ✅ Keep PRs focused and atomic
- ✅ Write clear commit messages
- ✅ Follow existing code style and structure
- ✅ Test thoroughly before submitting

---

### 📜 Code of Conduct

This project follows a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold these standards.

Thank you for contributing to **Zenith Academy**! 🙌

---

## ❤️ Contributors

<a href="https://github.com/aayushbharti/Zenith-Academy/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=aayushbharti/Zenith-Academy" />
</a>

---

<p align="center">Built with ❤️ by <a href="https://github.com/AayushBharti">Aayush Bharti</a></p>
