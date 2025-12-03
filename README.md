# Aks Clip - AI Video Clipper

Aks Clip adalah aplikasi web yang menggunakan AI untuk secara otomatis menganalisis video dan membuat short-form content yang viral untuk TikTok, Instagram Reels, dan YouTube Shorts.

## Fitur Utama

### 🎬 AI-Powered Video Clipping
- **AI Persona Analyzer**: Menganalisis karakter artis untuk menentukan momen yang paling disukai fans
- **Theme Scene Detector**: Mendeteksi bagian video yang cocok sesuai tema (cute, funny, sad, hype, dll)
- **Market Sentiment Analyzer**: Mengecek tren artis dan topik yang sedang viral

### 📝 Automatic Title & Description Generation
- Generate judul viral otomatis berdasarkan AI analysis
- Generate deskripsi yang optimized untuk engagement
- Copy-to-clipboard untuk kemudahan sharing

### 🎯 Tier System
**Lite Plan** (Gratis)
- Maksimal 15 clip per hari
- Banner ads (tidak bisa ditutup)
- Tidak ada subtitle feature
- Preview dan download gratis

**Pro Plan** (Premium)
- Unlimited clip generation
- Tidak ada screen-video ads
- Banner ads bisa ditutup
- Subtitle otomatis (on/off toggle)
- Prioritas kecepatan render
- Kualitas output lebih tinggi

### 📹 Video Processing
- Support YouTube links dan file upload
- FFmpeg-based video clipping
- Automatic subtitle generation (Pro-only)
- S3 storage untuk processed videos
- Real-time preview sebelum download

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Tailwind CSS 4** - Styling
- **tRPC** - Type-safe API calls
- **Wouter** - Lightweight routing
- **Shadcn/ui** - Component library

### Backend
- **Express 4** - Web server
- **tRPC 11** - RPC framework
- **Drizzle ORM** - Database layer
- **FFmpeg** - Video processing
- **Manus OAuth** - Authentication
- **S3** - File storage

### Database
- **MySQL/TiDB** - Primary database
- **Drizzle Kit** - Schema management

## Setup & Installation

### Prerequisites
- Node.js 22.13.0+
- pnpm 10.4.1+
- FFmpeg 4.4+
- MySQL/TiDB database

### Installation

```bash
# Clone repository
git clone https://github.com/Akskuy/clipper.git
cd clipper

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan credentials Anda

# Setup database
pnpm db:push

# Run development server
pnpm dev
```

Server akan berjalan di `http://localhost:3000`

## Environment Variables

```env
# Database
DATABASE_URL=mysql://user:password@host/database

# Authentication
JWT_SECRET=your-secret-key
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Storage
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# App Config
VITE_APP_TITLE=Aks Clip
VITE_APP_LOGO=/logo.svg
```

## Project Structure

```
aks-clip/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # Utilities & helpers
│   │   └── App.tsx        # Main app component
│   └── public/            # Static assets
├── server/                # Backend Express app
│   ├── routers/          # tRPC routers
│   ├── db.ts             # Database queries
│   └── _core/            # Core utilities
├── drizzle/              # Database schema & migrations
├── storage/              # S3 storage helpers
└── shared/               # Shared types & constants
```

## API Routes

### Authentication
- `POST /api/oauth/callback` - OAuth callback handler
- `GET /api/trpc/auth.me` - Get current user
- `POST /api/trpc/auth.logout` - Logout user

### Clipper
- `POST /api/trpc/clipper.generateClip` - Generate new clip
- `GET /api/trpc/clipper.getClips` - Get user's clips
- `GET /api/trpc/clipper.getTier` - Get user tier
- `GET /api/trpc/clipper.getDailyUsage` - Get daily usage (Lite users)

## Development

### Run Tests
```bash
pnpm test
```

### Format Code
```bash
pnpm format
```

### Type Check
```bash
pnpm check
```

### Build for Production
```bash
pnpm build
pnpm start
```

## Features Roadmap

### MVP (Current)
- [x] User authentication
- [x] Lite & Pro tier system
- [x] AI-powered clip generation
- [x] Viral title & description generation
- [x] Video clipping with FFmpeg
- [x] Subtitle generation (Pro-only)
- [x] S3 storage integration
- [x] Banner ads system

### Phase 2
- [ ] Real YouTube download support
- [ ] Advanced video effects
- [ ] Batch clip generation
- [ ] Social media direct upload
- [ ] Analytics dashboard
- [ ] Referral system

### Phase 3
- [ ] Mobile app (React Native)
- [ ] Video templates
- [ ] Watermark customization
- [ ] Advanced AI models
- [ ] API for third-party integrations

## Performance Optimization

- **Video Processing**: Async FFmpeg processing dengan progress tracking
- **Caching**: React Query untuk efficient data fetching
- **Code Splitting**: Lazy loading untuk pages
- **Image Optimization**: Automatic image compression
- **Database**: Indexed queries untuk fast retrieval

## Security

- **Authentication**: Manus OAuth dengan JWT tokens
- **Authorization**: Role-based access control (Lite/Pro)
- **Data Protection**: Encrypted database connections
- **File Upload**: Validated file types dan sizes
- **API Security**: CORS, rate limiting, input validation

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

Untuk pertanyaan atau issues, silakan buka GitHub issue atau hubungi support team.

## Changelog

### v1.0.0 (Current)
- Initial release
- Core AI clipping functionality
- Lite & Pro tier system
- Video processing with FFmpeg
- S3 storage integration
- Full test coverage

---

**Built with ❤️ by Manus Team**

Last Updated: December 2025
