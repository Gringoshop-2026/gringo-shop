import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import BuyerPage from './pages/Buyer/BuyerPage'
import AdminPage from './pages/Admin/AdminPage'
import AdminLogin from './components/AdminLogin'
import './styles.css'
import { LanguageProvider } from './i18n'
function AdminRoute(){const [authenticated,setAuthenticated]=useState(()=>sessionStorage.getItem('gringo-admin-auth')==='true');const role=sessionStorage.getItem('gringo-admin-role')||'admin';return authenticated?<AdminPage role={role} onLogout={()=>{sessionStorage.clear();setAuthenticated(false)}}/>:<AdminLogin onSuccess={()=>setAuthenticated(true)}/>}
function Root(){return <LanguageProvider>{window.location.pathname.startsWith('/admin') ? <AdminRoute /> : <BuyerPage />}</LanguageProvider>}
createRoot(document.getElementById('root')!).render(<Root />)
