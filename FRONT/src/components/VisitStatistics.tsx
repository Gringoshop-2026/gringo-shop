import { useEffect, useState } from 'react'
import { ExternalLink, RefreshCw } from 'lucide-react'
import { getVisitStats } from '../services/api'
type Stats={visitors:number;views:number;firstDay:string|null;daily:{day:string;visitors:number;views:number}[]}
export default function VisitStatistics(){
  const [days,setDays]=useState(7)
  const [stats,setStats]=useState<Stats|null>(null)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')
  const [refresh,setRefresh]=useState(0)
  useEffect(()=>{let live=true;setLoading(true);setError('');getVisitStats(days).then(data=>{if(live)setStats(data)}).catch(e=>{if(live)setError(e.message)}).finally(()=>{if(live)setLoading(false)});return()=>{live=false}},[days,refresh])
  const max=Math.max(1,...(stats?.daily.map(row=>row.views)||[]))
  return <section className="admin-panel visit-statistics" aria-busy={loading}>
    <div className="admin-panel-heading"><div><h2>Visitas a tu tienda</h2><p>Registro propio · Hora de Lima</p></div><div className="visit-tools"><select aria-label="Período de estadísticas" value={days} onChange={e=>setDays(Number(e.target.value))}><option value={7}>Últimos 7 días</option><option value={30}>Últimos 30 días</option></select><button type="button" aria-label="Actualizar estadísticas" disabled={loading} onClick={()=>setRefresh(n=>n+1)}><RefreshCw size={18}/></button></div></div>
    {error?<div className="visit-body" role="alert"><p>{error}</p><button className="text-button" onClick={()=>setRefresh(n=>n+1)}>Reintentar</button></div>:loading?<p className="visit-body" role="status">Cargando estadísticas…</p>:stats&&<div className="visit-body">
      <dl className="visit-totals"><div><dt>Visitantes únicos</dt><dd>{stats.visitors.toLocaleString('es-PE')}</dd></div><div><dt>Páginas vistas</dt><dd>{stats.views.toLocaleString('es-PE')}</dd></div></dl>
      <p className="visit-explanation">Cada navegador se cuenta una vez en el período. Las páginas vistas incluyen visitas repetidas. El panel de administración queda excluido.</p>
      <h3>Actividad por día</h3>
      {stats.views===0&&<p className="visit-explanation">Aún no hay visitas registradas. Los datos aparecerán cuando alguien abra la tienda.</p>}
      <div className="visit-table-wrap"><table className="visit-table"><thead><tr><th>Fecha</th><th>Actividad</th><th>Visitantes</th><th>Vistas</th></tr></thead><tbody>{stats.daily.map(row=><tr key={row.day}><th scope="row">{new Date(row.day+'T12:00:00-05:00').toLocaleDateString('es-PE',{day:'numeric',month:'short'})}</th><td><span className="visit-bar" aria-hidden="true"><span style={{width:`${row.views/max*100}%`}}/></span></td><td>{row.visitors}</td><td>{row.views}</td></tr>)}</tbody></table></div>
      <p className="visit-explanation">{stats.firstDay?`Datos disponibles desde el ${new Date(stats.firstDay+'T12:00:00-05:00').toLocaleDateString('es-PE')}. `:''}Conservamos los últimos 90 días. Este contador es independiente de Vercel y puede mostrar cifras diferentes.</p>
    </div>}
    <div className="visit-footer"><span>Consulta tu historial anterior en Vercel.</span><a className="text-button" href="https://vercel.com/stephano5/gringo-shop-4saf/analytics" target="_blank" rel="noreferrer">Abrir Vercel Analytics <ExternalLink size={15}/></a></div>
  </section>
}
