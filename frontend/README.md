# HRIS System Frontend Documentation

## Deskripsi Proyek

Aplikasi HRIS (Human Resource Information System) berbasis React dengan fitur lengkap untuk manajemen karyawan dan sistem absensi. Aplikasi ini memiliki dua role utama: **Admin** dan **Employee**.

## Fitur Utama

### 🔐 Authentication System
- **Login**: Email dan password
- **Register**: Nama, email, password, nomor HP, posisi
- **Role-based access** (Admin/Employee)
- **JWT Token authentication**

### 👥 Role Admin
- **Dashboard**: Overview statistik karyawan dan absensi
- **Manage Employees**: 
  - Tambah karyawan baru
  - Edit data karyawan
  - Hapus karyawan
  - Upload foto profil
- **View Attendance**: 
  - Lihat semua absensi karyawan (Read-only)
  - Filter by date range dan nama karyawan
  - Export report

### 👤 Role Employee
- **Dashboard**: Personal attendance overview
- **Profile Management**:
  - View profile lengkap (Nama, Email, Foto, Posisi, No. HP)
  - Edit nomor HP dan foto profil
  - Change password
- **Attendance System**:
  - Clock in/out dengan timestamp
  - Real-time clock display
  - Daily attendance summary
- **Attendance Summary**:
  - View riwayat absensi
  - Default: awal bulan s/d hari ini
  - Filter by date range
  - Statistik work hours

## Struktur File

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx           # Main layout with sidebar
│   │   ├── Sidebar.jsx          # Navigation sidebar with dropdown
│   │   └── ProtectedRoute.jsx   # Route protection
│   ├── contexts/
│   │   └── AuthContext.jsx      # Authentication state management
│   ├── pages/
│   │   ├── Login.jsx            # Login page
│   │   ├── Register.jsx         # Registration page
│   │   ├── Dashboard.jsx        # Dashboard page
│   │   ├── Profile.jsx          # Profile management
│   │   ├── Attendance.jsx       # Clock in/out page
│   │   ├── AttendanceSummary.jsx # Attendance history
│   │   ├── AdminEmployees.jsx   # Employee management
│   │   └── AdminAttendance.jsx  # Admin attendance view
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.jsx                 # Main app with routing
│   ├── App.css                 # App-specific styles
│   ├── index.css              # Global styles (utility classes)
│   └── main.jsx               # App entry point
├── .env                       # Environment variables
└── package.json              # Dependencies
```

## Teknologi yang Digunakan

- **React 19.1.1**: Frontend framework
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client untuk API calls
- **Lucide React**: Icon library
- **Vite**: Build tool dan dev server
- **CSS3**: Styling dengan utility classes custom

## Environment Configuration

File `.env`:
```
VITE_API_URL=http://localhost:3000/api
```

## API Endpoints yang Digunakan

### Authentication
- `POST /auth/login` - Login
- `POST /auth/register` - Register

### User Management
- `GET /users/profile` - Get user profile
- `PATCH /users/profile` - Update profile
- `PATCH /users/password` - Change password
- `POST /users/profile/picture` - Upload profile picture

### Admin User Management
- `GET /admin/users` - Get all users
- `POST /admin/users` - Create user
- `PATCH /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user

### Attendance
- `POST /attendance/clock-in` - Clock in
- `POST /attendance/clock-out` - Clock out
- `GET /attendance` - Get user attendance (with date filters)
- `GET /attendance/today` - Get today's attendance
- `GET /admin/attendance` - Get all attendance (admin)

## Instalasi dan Setup

1. **Clone repository**
```bash
git clone <repository-url>
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment**
```bash
# Copy .env file dan sesuaikan VITE_API_URL
cp .env.example .env
```

4. **Run development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## Route Structure

```
/ → Redirect to /login or /dashboard
/login → Login page
/register → Registration page
/dashboard → Role-based dashboard
/profile → User profile management
/attendance → Clock in/out (Employee only)
/attendance/summary → Attendance history (Employee only)
/admin/employees → Employee management (Admin only)
/admin/attendance → All attendance view (Admin only)
```

Aplikasi ini siap untuk production dengan fitur lengkap sesuai requirements yang diminta!

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
