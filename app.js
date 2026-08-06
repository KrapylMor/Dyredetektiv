
const app=document.getElementById('app');
let missions=[];

const doneKey='dyredetektiv-completed';
const completed=()=>JSON.parse(localStorage.getItem(doneKey)||'[]');
const saveDone=(id)=>{
  const s=new Set(completed()); s.add(id); localStorage.setItem(doneKey,JSON.stringify([...s]));
};
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[m]));

function burst(){
 const box=document.createElement('div');box.className='confetti';document.body.appendChild(box);
 const colors=['#f6ca54','#ef6b5b','#59a9d8','#7fc8a9','#8f78c6'];
 for(let i=0;i<55;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'vw';
 p.style.background=colors[Math.floor(Math.random()*colors.length)];
 p.style.animationDelay=(Math.random()*.55)+'s';p.style.transform=`rotate(${Math.random()*360}deg)`;box.appendChild(p)}
 setTimeout(()=>box.remove(),2400);
}
function shell(content,badge='START'){
 const progressCount=completed().length;
 app.innerHTML=`<main class="shell">
  <div class="status">
   <div class="brand">🔍 DYREDETEKTIV</div>
   <div class="status-actions">
    ${badge!=='START'?`<div class="pill">${esc(badge)}</div>`:''}
    <div class="pill progress-pill">🐾 ${progressCount} / 12</div>
   </div>
  </div>
  ${content}<div class="footer">Aulum Dyrskue · Dyredetektiv</div></main>`;
}
function progressBlock(){
 const d=completed();
 const pct=Math.round(d.length/12*100);
 return `<div class="progress-wrap"><div class="progress-label"><span>Dine missioner</span><span>${d.length}/12</span></div>
 <div class="progress"><span style="width:${pct}%"></span></div>
 <div class="mission-grid">${missions.map(m=>`<div class="mission-dot ${d.includes(m.id)?'done':''}">${d.includes(m.id)?'✓':m.id}</div>`).join('')}</div></div>`;
}
function getScene(m){
 if(m.id===10){return{emoji:'🎪',people:'👩‍⚖️👨‍🌾',className:'scene-ring-small'}}
 if(m.id===12){return{emoji:'🎪',people:'👥👩‍⚖️👨‍🌾',className:'scene-ring-big'}}
 if(m.id===11){return{emoji:'🛍️',people:'🧑‍🤝‍🧑',className:'scene-market'}}
 return{emoji:m.emoji,people:'🧭',className:'scene-animal'};
}
function renderStart(){
 setTheme(null);
 const done=completed().length;
 app.innerHTML=`<main class="start-page">
   <div class="status page-status">
    <div class="brand">🔍 DYREDETEKTIV</div>
    <div class="pill progress-pill">🐾 ${done} / 12</div>
   </div>
   <section class="start-poster" aria-label="Dyredetektiv – skattejagt på Aulum Dyrskue">
     <img class="start-art" src="/startside-dyredetektiv.png" alt="Dyredetektiv på Aulum Dyrskue med dyr og detektivbørn">
     <div class="start-overlay">
       <div class="treasure-map">
         <div class="map-label">🗺️ Treasure map</div>
         <h1>Welcome detective.</h1>
         <p>Find the first QR code at the children's animal show. Scan it. Solve 12 missions. Collect the secret letters.</p>
         <div class="map-steps">
           <div class="map-step"><span>🐾</span><div>Welcome detective.</div></div>
           <div class="map-step"><span>📍</span><div>Find the first QR code at the children's animal show.</div></div>
           <div class="map-step"><span>📱</span><div>Scan it.</div></div>
           <div class="map-step"><span>🧩</span><div>Solve 12 missions.</div></div>
           <div class="map-step"><span>🔤</span><div>Collect the secret letters.</div></div>
         </div>
         <div class="start-progress"><span>${done}/12 missioner fundet</span><div><i style="width:${Math.round(done/12*100)}%"></i></div></div>
       </div>
     </div>
   </section>
 </main>`;
}
function setTheme(m){document.documentElement.style.setProperty('--accent',m?.accent||'#4dabf7');document.documentElement.style.setProperty('--accent2',m?.accent2||'#ffd43b')}
function renderLockedMission(id){
 const previous=id-1;
 setTheme(null);
 shell(`<section class="game">
   <div class="hero"><div class="hero-copy"><div class="hero-kicker">Treasure trail</div><div class="hero-illustration"><div class="hero-emoji">🔒</div></div><h1>Mission ${id} er låst</h1><div class="subtitle">Følg sporene i den rigtige rækkefølge</div></div></div>
   <div class="body">${progressBlock()}
    <div class="card error">
      <div class="kicker">Du er kommet for langt frem</div>
      <p>Du skal først gennemføre <b>Mission ${previous}</b>.</p>
      <p>Gå tilbage til den seneste ledetråd, find den rigtige post og scan QR-koden dér.</p>
    </div>
   </div>
  </section>`,`LÅST`);
}

function renderMission(id){
 const m=missions.find(x=>x.id===id);
 if(!m){renderStart();return}
 if(id>1 && !completed().includes(id-1)){renderLockedMission(id);return}
 if(m.id===12 && completed().includes(12)){renderFinal();return}
 setTheme(m);
 const scene=getScene(m);
 const answers=m.id<12?`<div class="answers">${m.answers.map((a,i)=>`<button class="answer" data-index="${i}">${esc(a)}</button>`).join('')}</div>`:
 `<input id="code" class="code" placeholder="Skriv kodeordet" autocomplete="off"><button class="cta" id="checkCode">Tjek kodeord</button>`;
 shell(`<section class="game">
   <div class="hero"><div class="hero-copy"><div class="hero-kicker">Treasure trail</div><div class="hero-illustration ${scene.className}"><div class="hero-emoji">${scene.emoji}</div><div class="hero-people">${scene.people}</div></div><h1>${esc(m.title)}</h1><div class="subtitle">Mission ${m.id}</div></div></div>
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
function renderFinal(){
 setTheme({accent:'#4dabf7',accent2:'#ffd43b'});
 shell(`<section class="game final-page">
   <div class="hero hero-final"><div class="hero-copy"><div class="hero-kicker">Treasure complete</div><div class="treasure-chest">📦💎</div><h1>Congratulations!</h1><div class="subtitle">You opened the treasure chest</div></div></div>
   <div class="body">${progressBlock()}
    <div class="card success"><div class="kicker">🏆 Congratulations</div>
     <p><b>Well done, detective.</b></p>
     <p>You solved all 12 missions and collected the secret letters.</p>
     <p>The treasure is yours.</p></div>
    <div class="card clue"><div class="kicker">🗝️ Secret ending</div><p>Thank you for joining the hunt at Aulum Dyrskue.</p></div>
   </div>
  </section>`,`COMPLETE`);
 burst();
}
function checkFinal(m){
 const value=document.getElementById('code').value.trim().toUpperCase().replace(/\s+/g,' ');
 const f=document.getElementById('feedback');
 if(value!=='AULUM DYRSKUE'){f.innerHTML=`<div class="card error"><div class="kicker">Ikke helt</div><p>Prøv at sætte alle bogstaverne sammen igen.</p></div>`;return}
 saveDone(12);renderFinal();
}
function route(){
 const path=location.pathname.replace(/\/+$/,'');
 const match=path.match(/\/mission-(\d+)$/);
 if(match)renderMission(Number(match[1]));else renderStart();
}
fetch('/missions.json').then(r=>r.json()).then(data=>{missions=data;route()})
.catch(()=>shell(`<div class="card error"><b>Skattejagten kunne ikke indlæses.</b><p>Prøv igen, når du har internetforbindelse.</p></div>`));

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'))}
