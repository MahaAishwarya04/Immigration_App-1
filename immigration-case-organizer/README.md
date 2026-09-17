# Immigration Case Organizer

A full-stack local development project using:

- Frontend: React.js + Bootstrap + Vite
- Backend: Java 11 + Spring Boot 2.7.18 + Spring Data JPA
- Database: PostgreSQL 15
- API: REST
- Build tools: npm + Maven

> This application is an organizational/tracking tool only. It does not provide legal advice.

## 1. Prerequisites

Install:

1. Java 11
2. Node.js 18+ and npm
3. Maven 3.8+
4. Docker Desktop (recommended for PostgreSQL)

Verify:

```bash
java -version
node -v
npm -v
mvn -v
docker --version
```

## 2. Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

The database will run on:
- Host: localhost
- Port: 5432
- Database: immigration_db
- Username: immigration_user
- Password: immigration_password

## 3. Start the Spring Boot backend

Open Terminal 1:

```bash
cd backend
mvn spring-boot:run
```

Backend:
http://localhost:8080

Test:
http://localhost:8080/api/health

## 4. Start the React frontend

Open Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints, normally:
http://localhost:5173

## 5. What the application currently does

- Create immigration cases
- View all cases
- Update case status
- Delete cases
- Add documents to a case
- Track document status
- Add important deadlines
- View upcoming deadlines
- Dashboard summary
- Responsive Bootstrap UI

## 6. Main architecture

```text
React + Bootstrap
       |
       | REST / JSON
       v
Spring Boot 2.7
       |
       | Spring Data JPA
       v
PostgreSQL
```

## 7. API endpoints

### Cases

- GET `/api/cases`
- GET `/api/cases/{id}`
- POST `/api/cases`
- PUT `/api/cases/{id}`
- DELETE `/api/cases/{id}`

### Documents

- GET `/api/cases/{caseId}/documents`
- POST `/api/cases/{caseId}/documents`
- PUT `/api/documents/{id}`
- DELETE `/api/documents/{id}`

### Deadlines

- GET `/api/cases/{caseId}/deadlines`
- POST `/api/cases/{caseId}/deadlines`
- PUT `/api/deadlines/{id}`
- DELETE `/api/deadlines/{id}`

## 8. Suggested development roadmap

Phase 1:
- Case CRUD
- Documents
- Deadlines
- Dashboard

Phase 2:
- User registration/login
- Spring Security
- JWT authentication
- Role-based access

Phase 3:
- File uploads to local storage/S3
- Email reminders
- Calendar integration
- Case timeline

Phase 4:
- AWS deployment
- PostgreSQL managed database
- CI/CD
- Automated tests
- Accessibility improvements

## Important privacy/security note

Do not put real passport numbers, A-numbers, USCIS receipt numbers, or other sensitive immigration information into this local demo until authentication, authorization, encryption, secure secrets management, audit logging, and appropriate privacy controls are implemented.


Your three terminals should ultimately look like this

Terminal 1 — Database

immigration-case-organizer/
└── docker compose up -d

Terminal 2 — Java

immigration-case-organizer/backend/
└── mvn spring-boot:run

Terminal 3 — React

immigration-case-organizer/frontend/
└── npm run dev

And your browser:

http://localhost:5173
