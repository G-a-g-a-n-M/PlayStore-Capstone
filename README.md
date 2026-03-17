# PlayStore Capstone

A full-stack web application that simulates a App Store-like experience, built using the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to browse apps by genre, register/login, and manage their own applications through an Owner Dashboard.

## Features

- **Authentication System:** User registration, login, and logout functionality with role-based access.
- **Role-based Dashboards:**
  - **Owner Dashboard:** A dedicated dashboard for app creators to view analytics, manage their applications, and monitor reviews.
- **App Management:** Owners can add new apps, edit existing ones, and assign apps to specific genres (e.g., Food, Social, Education).
- **Modern User Interface:** Built with React and styled using Material UI (MUI) for a responsive and premium design.
- **Service-Oriented Backend:** Structured backend with a distinct service layer for robust business logic separation (e.g., application service, review service).
- **Comprehensive Testing Suite:** Includes React component tests, backend API tests with Mocha/Chai, and End-to-End (E2E) UI testing with Cypress.

## Tech Stack

**Frontend:**
- React (React 19)
- Material-UI (MUI)
- Redux Toolkit
- React Router DOM
- Axios
- Formik & Yup
- Firebase

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT) & bcryptjs

**Testing:**
- Cypress (E2E Testing)
- Jest & React Testing Library (Frontend)
- Mocha, Chai, Supertest (Backend API)

## Getting Started

### Prerequisites

- Node.js
- MongoDB instance (local or Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Setup the Backend:**
   Navigate to the backend directory and install dependencies:
   ```bash
   cd playstore-backend
   npm install
   ```
   
   Create a `.env` file in the `playstore-backend` directory and add the required environment variables (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`).
   
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   Open a new terminal, navigate to the frontend directory, and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
   
   Start the React development server:
   ```bash
   npm start
   ```

The application should now be running. The frontend will typically be accessible at `https://playstore-capstone-gagan.web.app/`.

## Running Tests

- **Frontend Tests:**
  ```bash
  cd frontend
  npm test
  ```
- **Backend Tests:**
  ```bash
  cd playstore-backend
  npm test
  ```

## License
ISC
