
const app=document.getElementById('app');
let missions=[];

const doneKey='dyredetektiv-completed';
const completed=()=>JSON.parse(localStorage.getItem(doneKey)||'[]');
const saveDone=(id)=>{
  const s=new Set(completed()); s.add(id); localStorage.setItem(doneKey,JSON.stringify([...s]));
};
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

function burst(){
 const box=document.createElement('div');box.className='confetti';document.body.appendChild(box);
 const colors=['#f6ca54','#ef6b5b','#59a9d8','#7fc8a9','#8f78c6'];
 for(let i=0;i<55;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'vw';
 p.style.background=colors[Math.floor(Math.random()*colors.length)];
 p.style.animationDelay=(Math.random()*.55)+'s';p.style.transform=`rotate(${Math.random()*360}deg)`;box.appendChild(p)}
 setTimeout(()=>box.remove(),2400);
}
function shell(content,badge='START'){
 app.innerHTML=`<main class="shell">
  <div class="status"><div class="brand">🔍 DYREDETEKTIV</div><div class="pill">${badge}</div></div>
  ${content}<div class="footer">Aulum Dyrskue · Dyredetektiv</div></main>`;
}
function progressBlock(){
 const d=completed();
 const pct=Math.round(d.length/12*100);
 return `<div class="progress-wrap"><div class="progress-label"><span>Dine missioner</span><span>${d.length}/12</span></div>
 <div class="progress"><span style="width:${pct}%"></span></div>
 <div class="mission-grid">${missions.map(m=>`<div class="mission-dot ${d.includes(m.id)?'done':''}">${d.includes(m.id)?'✓':m.id}</div>`).join('')}</div></div>`;
}
function renderStart(){
 setTheme(null);
 const done=completed().length;
 app.innerHTML=`<main class="start-page">
   <section class="start-poster" aria-label="Dyredetektiv – skattejagt på Aulum Dyrskue">
     <img class="start-art" src="/startside-dyredetektiv.png" alt="Dyredetektiv på Aulum Dyrskue med dyr og detektivbørn">
     <div class="start-panel">
       <div class="start-kicker">Velkommen, Dyredetektiv</div>
       <p>Rundt på dyrskuepladsen gemmer der sig <b>12 missioner</b>.</p>
       <div class="start-facts">
         <div><span>🔎</span><b>Find QR-koderne</b></div>
         <div><span>🤫</span><b>Afslør dyrenes hemmeligheder</b></div>
         <div><span>🔤</span><b>Saml 12 bogstaver</b></div>
         <div><span>🧩</span><b>Knæk kodeordet</b></div>
       </div>
       <div class="start-progress"><span>${done}/12 missioner fundet</span><div><i style="width:${Math.round(done/12*100)}%"></i></div></div>
       <div class="start-next">
         <span class="start-pin">📍</span>
         <div><b>Sådan begynder du</b><br>Find Børnedyrskuet og scan QR-koden til Mission 1.</div>
       </div>
     </div>
   </section>
 </main>`;
}
function setTheme(m){document.documentElement.style.setProperty('--accent',m?.accent||'#4dabf7');document.documentElement.style.setProperty('--accent2',m?.accent2||'#ffd43b')}
function renderMission(id){
 const m=missions.find(x=>x.id===id);setTheme(m);
 if(!m){renderStart();return}
 const answers=m.id<12?`<div class="answers">${m.answers.map((a,i)=>`<button class="answer" data-index="${i}">${esc(a)}</button>`).join('')}</div>`:
 `<input id="code" class="code" placeholder="Skriv kodeordet" autocomplete="off"><button class="cta" id="checkCode">Tjek kodeord</button>`;
 shell(`<section class="game">
   <div class="hero"><div><div class="mission-icon">${m.emoji}</div><h1>${esc(m.title)}</h1><div class="subtitle">Mission ${m.id}</div></div></div>
   <div class="body">${progressBlock()}
    <div class="card secret"><div class="kicker">🤫 ${esc(m.speaker)}</div><p>${esc(m.secret)}</p></div>
    <div class="card"><div class="question">${esc(m.question)}</div>${answers}</div>
    <div id="feedback"></div>
   </div>
  </section>`,`MISSION ${m.id}`);
 if(m.id<12){
   document.querySelectorAll('.answer').forEach(btn=>btn.addEventListener('click',()=>answerMission(m,btn)));
 }else{
   document.getElementById('checkCode').addEventListener('click',()=>checkFinal(m));
 }
}
function answerMission(m,btn){
 const correct=Number(btn.dataset.index)===m.correct;
 document.querySelectorAll('.answer').forEach(b=>b.disabled=true);
 btn.classList.add(correct?'good':'bad');
 const f=document.getElementById('feedback');
 if(!correct){
   f.innerHTML=`<div class="card error"><div class="kicker">Ikke helt</div><p>Prøv igen.</p></div>`;
   setTimeout(()=>renderMission(m.id),1200);return;
 }
 saveDone(m.id);burst();
 f.innerHTML=`<div class="card success"><div class="kicker">🎉 Godt klaret</div>
  <p>${esc(m.explanation)}</p><div class="letter">${m.letter}</div>
  <p class="small">Gem bogstavet til den sidste mission.</p></div>
  <div class="card clue"><div class="kicker">🔍 Næste mission</div><p>${esc(m.clue)}</p><div class="route"><span>🐾</span><span>→</span><span>🔎</span></div></div>`;
}
function checkFinal(m){
 const value=document.getElementById('code').value.trim().toUpperCase().replace(/\s+/g,' ');
 const f=document.getElementById('feedback');
 if(value!=='AULUM DYRSKUE'){f.innerHTML=`<div class="card error"><div class="kicker">Ikke helt</div><p>Prøv at sætte alle bogstaverne sammen igen.</p></div>`;return}
 saveDone(12);burst();
 f.innerHTML=`<div class="card success"><div class="kicker">🏆 Mission fuldført</div>
 <p><b>Tillykke, Dyredetektiv.</b></p><p>Du har fundet alle missionerne og knækket kodeordet.</p>
 <p>Tak fordi du var med.</p></div>`;
}
function route(){
 const path=location.pathname.replace(/\/+$/,'');
 const match=path.match(/\/mission-(\d+)$/);
 if(match)renderMission(Number(match[1]));else renderStart();
}
fetch('/missions.json').then(r=>r.json()).then(data=>{missions=data;route()})
.catch(()=>shell(`<div class="card error"><b>Skattejagten kunne ikke indlæses.</b><p>Prøv igen, når du har internetforbindelse.</p></div>`));

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'))}
