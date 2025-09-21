# AI-Based Internship Recommendation Engine

A Next.js application for the PM Internship Scheme that provides AI-powered internship recommendations for Indian youth, with special focus on first-generation learners and rural applicants.

## 🎯 Project Overview

This application implements the comprehensive PRD for an internship recommendation system that:
- Provides personalized internship matching using AI algorithms
- Supports multilingual interface (Hindi/English)
- Focuses on digital inclusion and accessibility
- Integrates with the PM Internship Scheme portal

## 🚀 Features

### Core Features
- **AI-Powered Recommendations**: Intelligent matching based on education, skills, interests, and location
- **Multilingual Support**: Hindi and English interface with easy language switching
- **Mobile-First Design**: Responsive design optimized for smartphone usage
- **Accessibility Compliant**: WCAG 2.1 AA compliance for inclusive design
- **Real-time Matching**: Sub-2 second recommendation generation

### User Experience
- Progressive profile creation form
- Visual skill and sector selection
- Location-based filtering
- Explanation for each recommendation
- One-click application process

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Library**: Chakra UI + Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios + React Query

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Phone OTP + Google OAuth)
- **Caching**: Redis (planned)

### Development Tools
- **Build Tool**: Next.js built-in bundler
- **Linting**: ESLint + Prettier
- **Testing**: Jest + React Testing Library
- **Deployment**: Docker + Vercel/AWS

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── recommendations/
│   │   └── internships/
│   ├── components/        # Reusable UI components
│   │   └── ui/
│   ├── lib/              # Utility functions and configurations
│   ├── types/            # TypeScript type definitions
│   └── globals.css       # Global styles
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sih_prototype
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Firebase Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Edit .env.local with your Firebase project credentials
   # Get these from Firebase Console > Project Settings > General
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
```

## 🔧 API Endpoints

### Recommendations
- `POST /api/recommendations` - Generate personalized recommendations
- `GET /api/recommendations` - API information

### Internships
- `GET /api/internships` - List internships with filters
- `POST /api/internships` - Create new internship (admin)
- `GET /api/internships/[id]` - Get internship details
- `PUT /api/internships/[id]` - Update internship (admin)
- `DELETE /api/internships/[id]` - Delete internship (admin)

### Example API Usage

```javascript
// Get recommendations
const response = await fetch('/api/recommendations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    profile: {
      userId: "user123",
      education: "Bachelor's in Computer Science",
      skills: ["JavaScript", "React", "Node.js"],
      location: { state: "Maharashtra", district: "Mumbai" },
      interests: ["Technology", "Software Development"],
      language: "en"
    }
  })
});
```

## 🎨 Design System

### Colors
- **Primary Blue**: #2196f3 (brand colors)
- **Government Orange**: #ff9800 (government theme)
- **Gray Scale**: Various shades for text and backgrounds

### Typography
- **Font**: Inter (system fallback: system-ui, sans-serif)
- **Sizes**: Responsive typography scale

### Components
- Consistent 44px minimum touch targets
- Rounded corners and subtle shadows
- High contrast ratios for accessibility

## 🌐 Internationalization

The app supports:
- **English** (en): Default language
- **Hindi** (hi): Primary Indian language
- **Extensible**: Framework ready for additional languages

Language switching is available in the header and persists across sessions.

## 📱 Mobile Optimization

- **Progressive Web App** principles
- **Touch-friendly** interface with large tap targets
- **Offline support** for basic functionality (planned)
- **Low bandwidth** optimization with image compression

## 🔒 Security & Privacy

- HTTPS enforcement
- Input validation and sanitization
- XSS and CSRF protection
- Data privacy compliance (IT Act 2000)
- Secure API endpoints

## 🧪 Testing Strategy

### Test Coverage
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Critical user journey testing
- **Accessibility Tests**: WCAG compliance validation

### Running Tests
```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 📊 Performance Targets

- **Page Load**: <3 seconds (First Contentful Paint)
- **API Response**: <2 seconds (95th percentile)
- **Bundle Size**: <500KB initial load
- **Accessibility**: 100% WCAG 2.1 AA compliance

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Docker (Planned)
```bash
docker build -t internship-engine .
docker run -p 3000:3000 internship-engine
```

## 📈 Monitoring & Analytics

- **Performance**: Web Vitals tracking
- **User Analytics**: Journey and conversion tracking
- **Error Monitoring**: Real-time error tracking
- **API Monitoring**: Response time and success rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write tests for new features
- Maintain accessibility standards

## 📄 License

This project is part of the PM Internship Scheme initiative by the Ministry of Corporate Affairs, Government of India.

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Refer to the comprehensive PRD documentation

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Basic recommendation engine
- ✅ Multilingual interface
- ✅ API endpoints
- 🔄 User profile creation

### Phase 2 (Planned)
- [ ] Database integration
- [ ] User authentication
- [ ] Admin dashboard
- [ ] Advanced ML algorithms

### Phase 3 (Future)
- [ ] WhatsApp integration
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Real-time notifications

---

**Built with ❤️ for Indian youth and the PM Internship Scheme**
