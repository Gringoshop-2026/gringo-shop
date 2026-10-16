const dayInLima = date => new Intl.DateTimeFormat('en-CA', {timeZone:'America/Lima',year:'numeric',month:'2-digit',day:'2-digit'}).format(date)
export function visitStats(sqlite) {
  sqlite.exec('CREATE TABLE IF NOT EXISTS visits (day TEXT NOT NULL, visitor TEXT NOT NULL, views INTEGER NOT NULL DEFAULT 1, PRIMARY KEY(day, visitor)); CREATE INDEX IF NOT EXISTS visits_day ON visits(day);')
  return {
    record(visitor, now=new Date()) {
      if(typeof visitor!=='string'||!/^[a-f0-9-]{36}$/i.test(visitor))return false
      const day=dayInLima(now)
      sqlite.prepare('INSERT INTO visits(day,visitor,views) VALUES (?,?,1) ON CONFLICT(day,visitor) DO UPDATE SET views=views+1').run(day,visitor)
      sqlite.prepare('DELETE FROM visits WHERE day < ?').run(dayInLima(new Date(now.getTime()-90*86400000)))
      return true
    },
    read(days=7, now=new Date()) {
      const dates=Array.from({length:days},(_,i)=>dayInLima(new Date(now.getTime()-(days-1-i)*86400000)))
      const rows=sqlite.prepare('SELECT day,COUNT(*) AS visitors,SUM(views) AS views FROM visits WHERE day >= ? GROUP BY day').all(dates[0])
      const daily=dates.map(day=>({day,visitors:0,views:0,...rows.find(row=>row.day===day)}))
      const unique=sqlite.prepare('SELECT COUNT(DISTINCT visitor) AS visitors FROM visits WHERE day >= ?').get(dates[0]).visitors
      return {days,visitors:unique,views:daily.reduce((sum,row)=>sum+row.views,0),daily,firstDay:sqlite.prepare('SELECT MIN(day) AS day FROM visits').get().day}
    }
  }
}
