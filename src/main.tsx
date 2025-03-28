import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './Context/AuthContext.tsx'
import { StudentSearchProvider } from './Context/StudentFilterContext.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


const queryclient = new QueryClient()

createRoot(document.getElementById('root')!).render(


    <QueryClientProvider client={queryclient}>

      <BrowserRouter>

        <GoogleOAuthProvider clientId='15124092057-q7saopofjt97svqnsd47t12n7ckn29qi.apps.googleusercontent.com'>

          <AuthProvider>

            <StudentSearchProvider>

              <App />

            </StudentSearchProvider>

          </AuthProvider>

        </GoogleOAuthProvider>

      </BrowserRouter>

    </QueryClientProvider>


)
