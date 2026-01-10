The frontend uses a React + Vite template.

# Creating the template
To create the template, I did the following:
    - Made sure I was under the `/client` directory.
    - In the command prompt, I typed `npm create vite@latest .`, to create the Vite project under this directory.
    - For the framework, I selected React. For the variant, I selected JavaScript.
    - I chose not to use rolldown-vite, and installed with npm.
    - The frontend is now accessible at `localhost:5173`.

# Accessing the frontend
In order to access the frontend, you must:
    1. Make sure you are in the `client` directory.
    2. Run `npm run dev` in the command line. Note that running this command is separate from starting the backend.
    3. The frontend is now accessible at `localhost:5173`.

# File structure
All frontend components are accessible under `/client/src`.
    - The frontend runs our App from `main.jsx`.
    - Focused portal-related components are further nested in `/components`.
    - Some API request helper functions are under `/utils`.

# Dependencies
The frontend uses the following key libraries:
    - **React** - UI framework for building interactive components.
    - **Vite** - Fast build tool and dev server.
    - **Bootstrap** - CSS framework for responsive styling and utility classes used throughout the portal layouts.
    - **React Router** - Client-side routing library for navigation between different pages and portals without full page reloads (Single-page application).
    - **Ant Design (antd)** - Component library for forms, modals, date/time pickers, and selects.
    - **Day.js** - Lightweight date manipulation library for handling appointment times.

To install dependencies, run `npm install` in the `/client` directory.

# Components
Key components include:
    - **Login.jsx** - Handles user authentication and login.
    - **PatientPortal.jsx** - Displays patient dashboard with their appointments.
    - **DoctorPortal.jsx** - Displays doctor dashboard with their scheduled appointments and filtering options.
    - **AdminPortal.jsx** - Admin dashboard for managing users and appointments.
Other components include forms for performing CRUD operations for appointments and users (for admins), and changing passwords (for all users).

# Development notes
    - The frontend communicates with the backend API at `http://localhost:3000`.
    - Authentication tokens are stored in localStorage.
    - Make sure the backend server is running before accessing the frontend.
    - Check the browser console for any API errors or debugging information.
