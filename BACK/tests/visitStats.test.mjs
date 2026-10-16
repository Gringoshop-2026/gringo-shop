import test from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { visitStats } from '../application/analytics/VisitStats.mjs'
test('visits deduplicate browsers, use Lima dates, fill empty days and retain 90 days',()=>{
 const db=new DatabaseSync(':memory:');const stats=visitStats(db)
 const a='aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',b='bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
 assert.equal(stats.record('bad'),false)
 stats.record(a,new Date('2026-10-14T03:00:00Z'))
 stats.record(a,new Date('2026-10-15T12:00:00Z'));stats.record(a,new Date('2026-10-15T12:01:00Z'));stats.record(b,new Date('2026-10-15T12:02:00Z'))
 const result=stats.read(7,new Date('2026-10-15T15:00:00Z'))
 assert.equal(result.visitors,2);assert.equal(result.views,4);assert.equal(result.daily.length,7)
 assert.equal(result.daily.find(r=>r.day==='2026-10-13').views,1)
 assert.equal(result.daily.at(-1).visitors,2);assert.equal(result.daily.at(-1).views,3)
 stats.record(a,new Date('2027-03-01T12:00:00Z'));assert.equal(stats.read(30,new Date('2027-03-01T12:00:00Z')).firstDay,'2027-03-01')
 db.close()
})
