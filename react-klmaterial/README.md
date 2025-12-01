# KL Material - React Edition 🚀

A powerful, modern React-based study hub for CSE materials with advanced features and smooth animations.

## 🌟 Features

### Core Functionality
- **📚 Materials Browser**: Dynamic GitHub API integration for real-time material loading
- **🗺️ Career Roadmap**: Interactive 4-year B.Tech guidance
- **🔍 Smart Search**: Real-time filtering across all materials
- **🏷️ Category Filters**: Quick access by subject (BEEC, DM, PSC, DSD)
- **📱 Fully Responsive**: Mobile-first design with touch optimization

### Advanced Features
- **⚡ React + TypeScript**: Type-safe, component-based architecture
- **🎨 Seasonal Animations**: Dynamic winter/spring/summer/autumn effects
- **🎭 Smooth Transitions**: Page routing with React Router
- **♿ Accessible**: ARIA labels, keyboard navigation, screen reader support
- **🌙 Modern UI**: Glassmorphic design with animated backgrounds
- **⚡ Performance**: Code splitting, lazy loading, optimized builds

## 🛠️ Tech Stack

- **Framework**: React 18.3+ with TypeScript
- **Build Tool**: Vite 6.0 (lightning-fast HMR)
- **Routing**: React Router v6
- **Styling**: CSS3 with modern animations
- **API**: GitHub REST API (unauthenticated)
- **Deployment**: GitHub Pages ready

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm

### Setup
```bash
# Navigate to the React project
cd react-klmaterial

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## 🏗️ Project Structure

```
react-klmaterial/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   │   ├── Navigation.tsx
│   │   ├── SeasonalAnimation.tsx
│   │   └── BackToTop.tsx
│   ├── pages/          # Page components
│   │   ├── Home.tsx
│   │   ├── Materials.tsx
│   │   ├── Roadmap.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── hooks/          # Custom React hooks
│   │   └── useGitHubMaterials.ts
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # React entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript config
└── package.json        # Dependencies
```

## 🔑 Key Components

### Navigation
- **Desktop**: Fixed glassmorphic header with inline links
- **Mobile**: Hamburger menu with slide-out drawer
- **Features**: Active route highlighting, smooth transitions

### Materials Page
- **GitHub Integration**: Real-time fetching via `useGitHubMaterials` hook
- **Smart Filtering**: Search + category filters
- **Responsive Grid**: Auto-adjusting layout
- **Error Handling**: Graceful fallbacks for API failures

### Seasonal Animations
- **Auto-Detection**: Changes based on current month
- **Winter**: Realistic snowfall with swaying motion
- **Spring**: Cherry blossom petals
- **Summer**: Fireflies
- **Autumn**: Falling leaves

## 🎨 Customization

### Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --bg-primary: #000814;
  --accent-primary: #00d4ff;
  /* ... more variables */
}
```

### GitHub Repository
Update in `src/hooks/useGitHubMaterials.ts`:
```typescript
const response = await fetch(
  'https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/materials'
);
```

### Base Path
Modify `vite.config.ts` for deployment:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
});
```

## 🚀 Deployment

### GitHub Pages
1. Update `base` in `vite.config.ts` to match your repo name
2. Run:
```bash
npm run deploy
```

### Manual Build
```bash
npm run build
# Upload the `dist` folder to your hosting provider
```

## 📱 Mobile Optimizations

- **Touch Targets**: Minimum 44px for all interactive elements
- **Responsive Breakpoints**: 
  - Mobile: 0-768px
  - Tablet: 769-1199px
  - Desktop: 1200px+
- **Performance**: Lazy loading, code splitting
- **PWA Ready**: Can be extended with service workers

## 🤝 Contributing

This is a student project. Feel free to fork and customize for your own use!

## 📝 Migration from Vanilla JS

### What's New:
✅ Component-based architecture  
✅ TypeScript type safety  
✅ React Router for navigation  
✅ Custom hooks for logic reuse  
✅ Faster builds with Vite  
✅ Better developer experience  

### What's Preserved:
✅ All original features  
✅ Visual design & animations  
✅ Mobile responsiveness  
✅ GitHub API integration  

## 🐛 Known Issues

- GitHub API has a 60 requests/hour limit for unauthenticated requests
- Add a GitHub token in `useGitHubMaterials.ts` for higher limits

## 📄 License

Educational project - Free to use and modify

## 👨‍💻 Author

**Praveen Reddy**
- GitHub: [@praveenreddy8942-debug](https://github.com/praveenreddy8942-debug)
- Email: praveenreddy8942@gmail.com

---

Built with ❤️ using React + Vite
