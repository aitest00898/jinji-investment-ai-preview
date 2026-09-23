const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const model=html.slice(html.indexOf("const TODAY="),html.indexOf('const root=document'));
const m=vm.runInNewContext(model+';({records,sites,growers,configurations,operations,issues,contextRows,amount,net,pool,sum,configAt,timelineNodes,operatingStats})');
assert.equal(m.sites.length,18);assert.equal(m.growers.length,6);assert.equal(m.records.length,206);assert.equal(new Set(m.records.map(c=>c.id)).size,206);
const c={scope:'all',year:'2026',owner:'pool',month:null,basis:'pool'};
assert.equal(m.contextRows(c).length,53);
assert.equal(m.sum(m.contextRows({...c,scope:'B'}),m.pool),72000);
assert.equal(m.sum(m.contextRows({...c,scope:'B'}),r=>m.amount(r,{...c,owner:'2'})),24000);
for(const r of m.records){assert.ok(r.date<=r.payoutDate);assert.ok(r.payoutDate<='2026-09-22');assert.ok(Math.abs(m.sum(r.snapshot.split)-1)<1e-12);assert.equal(m.net(r),m.pool(r)-r.expense);assert.ok(Math.abs(m.sum(['1','2','3'],owner=>m.amount(r,{...c,owner,basis:'net'}))-m.net(r))<1e-7);assert.ok(Object.isFrozen(r.snapshot));}
assert.equal(m.configAt('B',c).pool,.25);assert.equal(m.configAt('B',{...c,year:'2025'}).pool,.2);assert.ok(m.contextRows({...c,scope:'B'}).every(r=>r.snapshot.pool===.2));
assert.ok(m.timelineNodes('D',c).some(n=>n.kind==='配置生效'));
const previous=m.contextRows({...c,scope:'D',year:'2024'})[0];const original=previous.snapshot.pool;m.configurations.D.at(-1).pool=.9;assert.equal(previous.snapshot.pool,original);
const rStats=m.operatingStats(m.operations.filter(o=>o.site==='R'&&o.date.startsWith('2026')));assert.equal(rStats.survival,null);assert.equal(rStats.fcr,null);assert.equal(rStats.total,3);
const unequal=m.operatingStats([{chicks:100,shipped:90,weight:100,feed:200,date:'2026-01-01'},{chicks:300,shipped:240,weight:300,feed:900,date:'2026-02-01'},{chicks:null,shipped:null,weight:null,feed:null,date:'2026-03-01'}]);assert.equal(unequal.survival,82.5);assert.equal(unequal.fcr,2.75);assert.equal(unequal.complete,2);
assert.equal(m.issues.length,5);assert.equal(m.contextRows({...c,year:'all'}).length,206);assert.equal(m.contextRows({...c,scope:'g1'}).length,8);
console.log(JSON.stringify({status:'PASS',sites:18,growers:6,settled:m.records.length,ytdSettled:53,years:[...new Set(m.records.map(c=>c.date.slice(0,4)))],crossYear:m.records.filter(c=>c.date.slice(0,4)!==c.payoutDate.slice(0,4)).length,ytdPool:m.sum(m.contextRows(c),m.pool),ytdNet:m.sum(m.contextRows(c),m.net),allPool:m.sum(m.records,m.pool),allNet:m.sum(m.records,m.net)}));

assert.equal((html.match(/__BUILD_SHA__/g)||[]).length,2);
assert.ok(html.includes("connect-src 'none'"));
assert.ok(!/<script[^>]+src=|<iframe|autofocus|codex-remote-attachments|\/Users\/joe/.test(html));
assert.equal((html.match(/data-action="page"/g)||[]).length,3);
console.log('PASS: deploy markers, static-only boundary and three navigation entries');

assert.equal(m.sum(m.contextRows(c),m.pool),3235030);
assert.equal(m.sum(m.contextRows(c),m.net),3213630);
assert.equal(m.sum(m.records,m.pool),11059980);
assert.equal(m.sum(m.records,m.net),10983380);
