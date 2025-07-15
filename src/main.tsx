import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './providers/theme.tsx'
import { SidebarProvider } from './context/SidebarProvider.tsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SidebarProvider> 
    <ThemeProvider>
      <div className="h-full w-full">
        <App />
      </div>
      <Toaster position="top-center" />
    </ThemeProvider>
    </SidebarProvider>
  </StrictMode>
)
