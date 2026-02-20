# Developer Journal UI

A modern, production-ready, enterprise-grade frontend web application for managing daily developer work logs. Built with Next.js 16, TypeScript, and Bootstrap 5.

## 🚀 Features

- **Authentication System**: Mock JWT-based authentication with localStorage
- **Protected Routes**: Route guards to secure private pages
- **Daily Log Management**: Full CRUD operations for daily work logs
- **Search & Filter**: Search logs by keyword and date range
- **Dashboard**: Overview with statistics and quick actions
- **Responsive Design**: Mobile-first Bootstrap 5 UI
- **TypeScript**: Fully typed for type safety and better DX
- **Scalable Architecture**: Enterprise-level code organization

## 📁 Project Structure

```
developer-journal-ui/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── dashboard/           # Dashboard page
│   │   ├── dailylogs/           # Daily logs pages
│   │   │   ├── create/         # Create log page
│   │   │   ├── search/         # Search logs page
│   │   │   └── page.tsx        # List logs page
│   │   ├── login/              # Login page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page (redirects)
│   │   ├── globals.css         # Global styles + Bootstrap
│   │   └── BootstrapClient.tsx # Bootstrap JS initialization
│   ├── components/
│   │   ├── forms/              # Form components
│   │   │   └── DailyLogForm.tsx
│   │   ├── layouts/            # Layout components
│   │   │   └── ProtectedLayout.tsx
│   │   └── ui/                 # UI components
│   │       ├── AuthGuard.tsx
│   │       ├── DailyLogCard.tsx
│   │       └── Navbar.tsx
│   ├── lib/                    # Utility libraries
│   │   └── auth.ts            # Auth helper functions
│   ├── models/                 # TypeScript interfaces
│   │   ├── DailyLog.ts
│   │   └── User.ts
│   └── services/               # API services (mock)
│       ├── api-client.ts       # Axios abstraction layer
│       ├── auth-service.ts     # Auth service
│       └── dailylog-service.ts # Daily log service
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── next.config.ts              # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies

```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: Bootstrap 5.3.3
- **HTTP Client**: Axios (prepared for future backend)
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Next.js App Router with protected routes
- **Build Tool**: Turbopack

## 📋 Prerequisites

- Node.js v20 or higher
- npm, yarn, or pnpm

## 🔧 Installation

1. **Fix npm SSL issue** (if you encountered the SSL cipher error):
   ```bash
   # Update Node.js and npm to latest versions
   # Or try using a different registry
   npm config set registry https://registry.npmjs.org/
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 🔐 Demo Credentials

Use these credentials to log in:

- **Email**: john@example.com
- **Password**: password123

Alternative users:
- jane@example.com / password123 (Team Lead)
- bob@example.com / password123 (Developer)

## 📱 Pages & Routes

### Public Routes
- `/login` - User authentication

### Protected Routes (require authentication)
- `/dashboard` - Main dashboard with statistics
- `/dailylogs` - List all daily logs
- `/dailylogs/create` - Create new daily log
- `/dailylogs/search` - Search and filter logs

## 🏗️ Architecture Highlights

### 1. **Clean Separation of Concerns**
- **Models**: TypeScript interfaces for data structures
- **Services**: Business logic and API calls
- **Components**: Reusable UI components
- **Lib**: Utility functions and helpers

### 2. **Mock Service Layer**
All services are currently using mock data with simulated async delays. This allows:
- Frontend development without backend dependency
- Realistic user experience simulation
- Easy future integration with real API

### 3. **Future Backend Integration**
The application is structured for minimal changes when integrating with a .NET 8 CQRS Web API:

**What needs to change:**
- Replace mock service implementations in `services/` folder
- Uncomment the real API implementations (already provided in comments)
- Update `.env.local` with actual API URL

**What stays the same:**
- All React components
- All TypeScript models
- API client abstraction layer
- Authentication utilities
- UI/UX logic

### 4. **Authentication Flow**
```
Login Page → Auth Service → Save to localStorage → Protected Layout → Dashboard
                                    ↓
                            JWT Token (mock) stored
                                    ↓
                            AuthGuard validates on route change
```

### 5. **Bootstrap Integration**
- Bootstrap CSS imported globally
- Bootstrap JS loaded client-side dynamically
- Custom CSS variables for design tokens
- Reusable component classes

## 🎨 Design System

The application uses a comprehensive design token system:

- **Colors**: Primary, secondary, success, danger, warning, info
- **Typography**: Consistent heading and text styles
- **Spacing**: Standardized spacing scale
- **Shadows**: Elevation system for depth
- **Borders**: Consistent border radius

## 🔄 Data Flow

```
User Action → Component → Service (Mock) → Update State → Re-render UI
                              ↓
                    (Future: Real API Call)
```

## 📝 Daily Log Data Model

```typescript
interface DailyLog {
  id: string;
  logDate: string;           // YYYY-MM-DD
  tasksWorked: string;
  problemsFaced: string;
  solutions: string;
  learnings: string;
  tips: string;
  createdAt: string;         // ISO datetime
  updatedAt: string;         // ISO datetime
}
```

## 🔮 Future Enhancements

When integrating with the backend:

1. **Update API Client**: Configure real API base URL
2. **Replace Services**: Uncomment real implementations in service files
3. **Add Interceptors**: Already configured for JWT token injection
4. **Error Handling**: Centralized error handling already in place
5. **Token Refresh**: Implement token refresh logic
6. **Pagination**: Add server-side pagination for large datasets
7. **Real-time Updates**: WebSocket support for live updates

## 🐛 Known Issues

- **npm SSL Error**: There's an SSL cipher operation error with npm on Windows. This is a known OpenSSL/npm issue. Solutions:
  - Update Node.js to latest LTS version
  - Use yarn or pnpm instead
  - Configure npm registry settings

## 📄 License

This project is for demonstration and educational purposes.

## 👨‍💻 Development Notes

- All routes except `/login` are protected by `AuthGuard`
- Mock data persists in memory (resets on page refresh)
- LocalStorage is used for auth data (not production-ready for real auth)
- Bootstrap JavaScript components are loaded dynamically on client-side
- TypeScript strict mode is enabled

## 🤝 Contributing

This is a demonstration project. For production use:
1. Replace mock authentication with real JWT
2. Use HTTP-only cookies instead of localStorage
3. Implement proper error boundaries
4. Add comprehensive testing
5. Set up CI/CD pipeline
6. Add proper logging and monitoring

---

**Built with ❤️ using Next.js 16, TypeScript, and Bootstrap 5**
