import { lazy, Suspense, useState } from 'react'
import { createRoot } from 'react-dom/client'
import BuyerPage from './pages/Buyer/BuyerPage'
const AdminPage = lazy(() => import('./pages/Admin/AdminPage'))
import AdminLogin from './components/AdminLogin'
import './styles.css'
import { LanguageProvider } from './i18n'
function AdminRoute(){const [authenticated,setAuthenticated]=useState(()=>sessionStorage.getItem('negroshop-admin-auth')==='true');const role=sessionStorage.getItem('negroshop-admin-role')||'admin';return authenticated?<AdminPage role={role} onLogout={()=>{sessionStorage.clear();setAuthenticated(false)}}/>:<AdminLogin onSuccess={()=>setAuthenticated(true)}/>}
function Root(){return <LanguageProvider><Suspense fallback={<main role="status" className="p-8 text-center">Cargando página…</main>}>{window.location.pathname.startsWith('/admin') ? <AdminRoute /> : <BuyerPage />}</Suspense></LanguageProvider>}
const root = import.meta.hot?.data.root ?? createRoot(document.getElementById('root')!)
if (import.meta.hot) import.meta.hot.data.root = root
root.render(<Root />)
