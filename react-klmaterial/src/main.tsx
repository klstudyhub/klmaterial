import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// Add a runtime toggle to disable animations globally so the site can be
// inspected without moving overlays. This mirrors the CSS rules in
// `index.css` that target `html.disable-animations`.
try {
  // Only run in browsers
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.classList.add('disable-animations')
  }
} catch (e) {
  // ignore in non-browser environments
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
