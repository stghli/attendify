
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { ClassesProvider } from './context/classes/ClassesContext'
import { AttendanceProvider } from './context/attendance/AttendanceContext'
import { SmsProvider } from './context/sms/SmsContext'
import { Toaster } from './components/ui/sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ClassesProvider>
            <AttendanceProvider>
              <SmsProvider>
                <App />
                <Toaster />
              </SmsProvider>
            </AttendanceProvider>
          </ClassesProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
