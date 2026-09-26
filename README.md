# Thiru Kumaran Mahal — Hall Harmony (Function Hall Booking Management System)

A production-ready full-stack Function Hall Booking and Financial Management System designed for single-owner/administrator operations.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Folder Structure](#folder-structure)
4. [Business & Booking Rules](#business--booking-rules)
5. [Development Admin Credentials](#development-admin-credentials)
6. [Getting Started (Local Development)](#getting-started-local-development)
   - [Prerequisites](#prerequisites)
   - [Backend Setup (Django + MySQL)](#backend-setup-django--mysql)
   - [Frontend Setup (React + Vite)](#frontend-setup-react--vite)
7. [Running the Test Suites](#running-the-test-suites)
8. [API Endpoints Reference](#api-endpoints-reference)
9. [Production Deployment Guide](#production-deployment-guide)
   - [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
   - [Backend Deployment (Render / Railway / AWS)](#backend-deployment-render--railway--aws)
   - [Production MySQL Database](#production-mysql-database)
10. [Security Best Practices](#security-best-practices)

---

## 1. System Architecture

Hall Harmony follows a decoupled, clean full-stack architecture:

- **Frontend (React 19 + Vite)**: Single Page Application (SPA) with responsive design, segmented category controls, Recharts analytics, JWT session interceptors, and native print/export handling.
- **Backend (Python 3 + Django 5 + Django REST Framework)**: Authoritative REST API enforcing strict booking conflict detection (with automatic 4-hour buffers), multi-day date calculation, payment validations, and PDF/Excel generation.
- **Database (MySQL)**: Persistent relational storage with indexing on booking numbers, date intervals, payment statuses, and categories.

```
┌────────────────────────────────────────────────────────┐
│                   React 19 Frontend                    │
│   (Dashboard, Booked List, Expenses, Reports, Search)  │
└───────────────────────────┬────────────────────────────┘
                            │ Axios + JWT Bearer Token
┌───────────────────────────▼────────────────────────────┐
│               Django 5 REST Framework API              │
│   (JWT Auth, Conflict Engine, Reports, Excel/PDF)      │
└───────────────────────────┬────────────────────────────┘
                            │ Django ORM / PyMySQL
┌───────────────────────────▼────────────────────────────┐
│                    MySQL Database                      │
│     (Bookings, Expenses, User Profiles, Audit Logs)    │
└────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS + Custom Camel/Cocoa/Espresso/Cream/Dark Brown Design Tokens
- **Routing**: React Router v7
- **HTTP Client**: Axios with JWT refresh token interceptor
- **Forms & Validation**: React Hook Form + Zod
- **Charts & Visualizations**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner Toasts
- **Date Handling**: date-fns

### Backend
- **Framework**: Python 3.11+ / Django 5.1
- **API Engine**: Django REST Framework (DRF)
- **Authentication**: `djangorestframework-simplejwt` (Access + Refresh + Token Blacklist)
- **CORS**: `django-cors-headers`
- **Filtering**: `django-filter`
- **Exports**: `openpyxl` (Excel), `reportlab` (PDF)
- **Static Assets**: WhiteNoise + Gunicorn

---

## 3. Folder Structure

```
Thiru Kumaran Mahal/
├── backend/
│   ├── config/              # Django core settings, WSGI, root URLs
│   ├── users/               # Custom user profile, JWT auth, permissions, dev admin seed
│   ├── bookings/            # Main booking domain (models, serializers, conflict service, views)
│   ├── expenses/            # Operational expense tracking & category summaries
│   ├── reports/             # Financial aggregation, PDF & Excel export engines
│   ├── staticfiles/         # Collected production static assets
│   ├── manage.py            # Django CLI utility
│   ├── requirements.txt     # Python backend dependencies
│   ├── Dockerfile           # Production container build definition
│   ├── render.yaml          # Render.com infrastructure blueprint
│   └── Procfile             # Production WSGI process declaration
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI (Buttons, Cards, Modals, Tables, Tabs, StatCards)
│   │   ├── layouts/         # DashboardLayout (Sidebar, Navbar, Footer) & AuthLayout
│   │   ├── pages/           # Dashboard, BookedList, BookingDetails, NewBooking, Expenses, Reports...
│   │   ├── hooks/           # Custom hooks (useAuth, useTheme, useBookings, useExpenses, useReports)
│   │   ├── services/        # Centralized Axios API services
│   │   ├── utils/           # Formatters, Date helpers, Zod validation, Export/Print helpers
│   │   ├── router/          # AppRouter & ProtectedRoute navigation guards
│   │   └── lib/             # Axios instance & Tailwind merge helpers
│   ├── package.json         # Node.js dependencies
│   ├── vite.config.js       # Vite configuration with Tailwind CSS & proxy
│   └── vercel.json          # Vercel SPA routing rewrites
└── README.md
```

---

## 4. Business & Booking Rules

1. **Auto-Generated Booking Number**: Format `FH-YYYY-NNNN` (e.g., `FH-2026-0001`), sequentially generated per year.
2. **Multi-Day Duration & End Date**:
   $$\text{End Date} = \text{Start Date} + \text{Number of Days} - 1$$
3. **4-Hour Conflict Buffer**:
   - The backend enforces a mandatory 4-hour cleaning and stage preparation buffer following the end of every active reservation.
   - Any overlap within the reservation window or the 4-hour post-event buffer is rejected with `"Already booked."`.
4. **Authoritative Event Status Classification**:
   - **Today's Events**: Active bookings where $\text{Start Date} \le \text{Today} \le \text{End Date}$.
   - **Upcoming Events**: Active bookings where $\text{Start Date} > \text{Today}$.
   - **Completed Events**: Active bookings where $\text{End Date} < \text{Today}$.
   - **Cancelled Events**: Frees the hall slot immediately for new bookings while remaining preserved in audit and cancellation reports.
5. **Payment Validation**:
   $$\text{Balance} = \text{Total Payment} - \text{Received Payment}$$
   - Total Payment $\ge 0$, Received Payment $\ge 0$.
   - Received Payment cannot exceed Total Payment.
6. **Expense Categorization**:
   - Cleaning, Electricity, Decoration, Maintenance, Repair, Staff, Transportation, Other.
   - Non-negative amounts ($ \ge 0 $).
7. **Net Profit Formula**:
   $$\text{Net Amount} = \text{Revenue (Received Payments)} - \text{Total Operational Expenses}$$

---

## 5. Development Admin Credentials

> [!WARNING]
> **DEVELOPMENT ONLY CREDENTIALS**: The credentials below are intended strictly for local development and demonstration. They must be changed before deploying to production.

- **Username**: `admin`
- **Password**: `Function@2026`
- **Role**: `Administrator / Owner`

To re-create or reset the development admin user locally:
```bash
python manage.py create_dev_admin
```

---

## 6. Getting Started (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 18+ & npm
- MySQL Server 8.0+ (Local, XAMPP, or Docker)

### Backend Setup (Django + MySQL)

1. Navigate to the `backend` directory and activate the virtual environment:
   ```bash
   cd backend
   # Windows
   ..\venv\Scripts\activate
   # Linux / macOS
   source ../venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create the MySQL Database:
   ```sql
   CREATE DATABASE thiru_kumaran_mahal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. Configure `.env` inside `backend/`:
   ```env
   SECRET_KEY=your-secure-random-secret-key
   DEBUG=True
   DB_NAME=thiru_kumaran_mahal
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_HOST=localhost
   DB_PORT=3306
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   ALLOWED_HOSTS=localhost,127.0.0.1
   ```

5. Run database migrations:
   ```bash
   python manage.py migrate
   ```

6. Seed the development admin account:
   ```bash
   python manage.py create_dev_admin
   ```

7. Start the backend development server:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```
   API health check available at `http://localhost:8000/health/`.

---

### Frontend Setup (React + Vite)

1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd frontend
   npm install
   ```

2. Configure `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Access the web application at `http://localhost:5173`.

---

## 7. Running the Test Suites

### Backend Tests
The backend includes 16 automated tests covering authentication, booking creation, 4-hour conflict buffer validation, payment calculation, expense CRUD, and Excel/PDF report generation.

```bash
cd backend
python manage.py test
```

### Frontend Production Build Test
Validate full TypeScript/JSX compilation, asset minification, and bundling:
```bash
cd frontend
npm run build
```

---

## 8. API Endpoints Reference

### Authentication (`/api/auth/`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login/` | Obtain JWT access & refresh tokens | No |
| `POST` | `/api/auth/register/` | Register a new user account | No |
| `POST` | `/api/auth/token/refresh/` | Refresh expired access token | No |
| `POST` | `/api/auth/logout/` | Blacklist refresh token & logout | Yes |
| `GET` | `/api/auth/me/` | Fetch current authenticated user info | Yes |

### Bookings (`/api/bookings/`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/bookings/` | List all bookings with search/filters/pagination | Yes |
| `POST` | `/api/bookings/` | Create a new booking (auto conflict check) | Admin |
| `GET` | `/api/bookings/{id}/` | Retrieve booking details | Yes |
| `PUT` | `/api/bookings/{id}/` | Update booking details | Admin |
| `PATCH` | `/api/bookings/{id}/update-payment/` | Update payment details | Admin |
| `POST` | `/api/bookings/{id}/cancel/` | Cancel booking and release slot | Admin |
| `GET` | `/api/bookings/today/` | List active bookings covering today | Yes |
| `GET` | `/api/bookings/upcoming/` | List future active bookings | Yes |
| `GET` | `/api/bookings/completed/` | List past active bookings | Yes |
| `GET` | `/api/bookings/dashboard-stats/` | Fetch financial & booking metrics | Yes |
| `GET` | `/api/bookings/search/?q={query}` | Global search across party/number/contact | Yes |

### Expenses (`/api/expenses/`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/expenses/` | List expenses with category/date filters | Yes |
| `POST` | `/api/expenses/` | Record new expense | Admin |
| `PUT/PATCH` | `/api/expenses/{id}/` | Edit expense record | Admin |
| `DELETE` | `/api/expenses/{id}/` | Delete expense record | Admin |
| `GET` | `/api/expenses/summary/` | Summary metrics (Total, Monthly, Cleaning, Other) | Yes |

### Reports & Exports (`/api/reports/`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/reports/daily/?date=YYYY-MM-DD` | Daily breakdown & financial totals | Yes |
| `GET` | `/api/reports/monthly/?year=YYYY&month=M` | Monthly financial aggregation | Yes |
| `GET` | `/api/reports/cancelled/` | Complete history of cancelled reservations | Yes |
| `GET` | `/api/reports/pending-payment/` | Outstanding balance report | Yes |
| `GET` | `/api/reports/fully-paid/` | Fully paid reservations | Yes |
| `GET` | `/api/reports/export/excel/?type={type}` | Download Excel (.xlsx) report | Yes |
| `GET` | `/api/reports/export/pdf/?type={type}` | Download PDF report | Yes |

---

## 9. Production Deployment Guide

### Frontend Deployment (Vercel)
1. Push the repository to GitHub.
2. In the Vercel Dashboard, import the repository and set the **Root Directory** to `frontend`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-api.onrender.com/api`
7. Click **Deploy**. The included `vercel.json` ensures all client-side routes resolve properly.

### Backend Deployment (Render / Railway / AWS)
1. **Render.com**:
   - Use the included `backend/render.yaml` blueprint or create a Web Service targeting `backend/`.
   - Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - Start Command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
2. **Environment Variables**:
   - `SECRET_KEY`: Set to a strong 64-character random string.
   - `DEBUG`: `False`
   - `DATABASE_URL`: `mysql://user:password@host:port/dbname`
   - `CORS_ALLOWED_ORIGINS`: `https://your-frontend.vercel.app`
   - `ALLOWED_HOSTS`: `your-backend.onrender.com,your-domain.com`

---

## 10. Security Best Practices

- Passwords hashed with PBKDF2 with SHA256.
- Short-lived JWT Access Tokens (1 hour) with rotating Refresh Tokens (7 days).
- Token blacklist on logout.
- Cross-Site Request Forgery (CSRF) & Cross-Origin Resource Sharing (CORS) protections enabled.
- Strict database constraints and transactions to prevent booking race conditions.
