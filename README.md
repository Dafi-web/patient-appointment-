# International Patient Appointment System

A full-stack application for managing patient appointments with international support, built with React, Node.js, Express, and MongoDB.

## Features

- 🔐 **User Authentication**: Secure registration and login system with JWT tokens
- 👤 **Role-Based Access**: Three user roles - Admin, Patient, and Doctor
- 🌍 **International Support**: Multi-language interface (English, Spanish, French, and more)
- 👥 **Patient Management**: Create, read, update, and delete patient records (Admin only)
- 👨‍⚕️ **Doctor Management**: Manage doctor profiles with specializations and availability
- 📅 **Appointment Booking**: Schedule appointments with conflict detection
- ✅ **Admin Approval System**: Admins can approve or reject appointment requests
- 🔔 **Notification System**: Real-time notifications for appointment status changes
- 🔍 **Search Functionality**: Search patients, doctors, and appointments
- 📱 **Responsive Design**: Modern, beautiful UI that works on all devices
- ⏰ **Timezone Support**: Handle appointments across different timezones

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- RESTful API

### Frontend
- React
- React Router with Protected Routes
- React Context API for Authentication
- React i18next (Internationalization)
- Axios for API calls
- Modern CSS with responsive design

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
MONGODB_URI=mongodb+srv://musiedelayselam:yesno1212@cluster0.nc9xfdg.mongodb.net/patient_appointments?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

4. Create an admin user (optional but recommended):
```bash
npm run create-admin
```
This creates an admin user with:
- Email: admin@example.com
- Password: admin123
**Please change the password after first login!**

5. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Appointments
- `GET /api/appointments` - Get all appointments (protected)
- `GET /api/appointments/pending` - Get pending appointments (admin only)
- `GET /api/appointments/:id` - Get appointment by ID (protected)
- `POST /api/appointments` - Create new appointment (protected)
- `PUT /api/appointments/:id` - Update appointment (protected)
- `PUT /api/appointments/:id/approve` - Approve appointment (admin only)
- `PUT /api/appointments/:id/reject` - Reject appointment (admin only)
- `DELETE /api/appointments/:id` - Delete appointment (protected)
- `GET /api/appointments/patient/:patientId` - Get appointments by patient (protected)
- `GET /api/appointments/doctor/:doctorId` - Get appointments by doctor (protected)
- `POST /api/appointments/available-slots` - Get available time slots (protected)

### Notifications
- `GET /api/notifications` - Get user notifications (protected)
- `GET /api/notifications/unread-count` - Get unread notification count (protected)
- `PUT /api/notifications/:id/read` - Mark notification as read (protected)
- `PUT /api/notifications/read-all` - Mark all notifications as read (protected)
- `DELETE /api/notifications/:id` - Delete notification (protected)

## Project Structure

```
patient-appointment/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── patientController.js
│   │   ├── doctorController.js
│   │   └── appointmentController.js
│   ├── models/
│   │   ├── Patient.js
│   │   ├── Doctor.js
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── patientRoutes.js
│   │   ├── doctorRoutes.js
│   │   └── appointmentRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── PatientList.js
│   │   │   ├── PatientForm.js
│   │   │   ├── DoctorList.js
│   │   │   ├── DoctorForm.js
│   │   │   ├── AppointmentList.js
│   │   │   └── AppointmentForm.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── index.css
│   │   └── i18n.js
│   └── package.json
└── README.md
```

## Usage

1. Start both backend and frontend servers
2. Open your browser to `http://localhost:3000`
3. **Register a new account** or **login** with existing credentials
4. **For Admin Access**: Use the admin account created with `npm run create-admin`
   - Email: admin@example.com
   - Password: admin123
5. Navigate through the application using the navigation bar
6. Switch languages using the language selector in the navigation
7. **As a Patient**: Book appointments by selecting a doctor and time slot
8. **As an Admin**: 
   - View pending appointments in the Admin Dashboard
   - Approve or reject appointment requests
   - Manage patients and doctors
9. Check notifications (bell icon) for appointment status updates
10. Search and filter records as needed

## User Roles

### Admin
- Can approve/reject appointment requests
- Can manage all patients and doctors
- Has access to admin dashboard
- Receives notifications for new appointment requests

### Patient
- Can create appointment requests
- Can view their own appointments
- Receives notifications when appointments are approved/rejected
- Can select doctors and book time slots

### Doctor
- Can view their appointments
- Receives notifications for new approved appointments
- Can see their schedule

## Features in Detail

### Internationalization
The application supports multiple languages:
- English (en)
- Spanish (es)
- French (fr)
- And more languages can be easily added

### Appointment Management
- **Pending Status**: New appointments start as "pending" awaiting admin approval
- **Admin Approval**: Admins can approve or reject appointments with notes
- Automatic conflict detection
- Available time slot suggestions
- Status tracking (pending, approved, rejected, scheduled, confirmed, completed, cancelled)
- Patient and doctor association
- Real-time notifications for all status changes

### Patient Management
- Complete patient profiles
- Emergency contact information
- Medical history tracking
- Multi-language preference
- Timezone support

### Doctor Management
- Specialization and department tracking
- Multi-language support for doctors
- Availability management
- Timezone configuration
- Only admins can create/edit/delete doctors

### Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes based on user roles
- Session management
- Secure API endpoints

### Notification System
- Real-time notifications for appointment status changes
- Unread notification count indicator
- Mark as read functionality
- Notification history

## License

ISC

## Author

Built for international patient appointment management
