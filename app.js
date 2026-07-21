
const initialData = {
  meta: { teamName: "BSSC U12 Boys B", season: "2026–27", version: "0.1" },
  players: [
    {id:crypto.randomUUID(),name:"Brody Waite",jersey:"34",dob:"",registered:false,teamReach:true,parents:"Angela Waite; Jason Waite",email:"angela.waite.aw@gmail.com",phone:"",notes:""},
    {id:crypto.randomUUID(),name:"Carson Pauer",jersey:"13",dob:"",registered:false,teamReach:true,parents:"Chris Pauer; Kate Pauer",email:"cpauer@gmail.com; kaitling1987@gmail.com",phone:"",notes:""},
    {id:crypto.randomUUID(),name:"Colin Nichol",jersey:"17",dob:"",registered:false,teamReach:true,parents:"Ryan Larson",email:"ryan.larson@bkwschools.org",phone:"",notes:"Jersey conflict with Finnley"},
    {id:crypto.randomUUID(),name:"Derrick Lopez",jersey:"21",dob:"",registered:false,teamReach:true,parents:"Dan Lopez; Kelly Lopez",email:"maddiec95@yahoo.com",phone:"",notes:""},
    {id:crypto.randomUUID(),name:"Duke Kitchell",jersey:"",dob:"",registered:false,teamReach:true,parents:"Kory Kitchell; Matthew Kitchell",email:"newmka62@yahoo.com; mpkitch7@aol.com",phone:"518-588-3499; 518-577-0224",notes:""},
    {id:crypto.randomUUID(),name:"Ezra Hall",jersey:"5",dob:"",registered:false,teamReach:true,parents:"Dylan Hall",email:"dhallrmadrid@gmail.com",phone:"",notes:""},
    {id:crypto.randomUUID(),name:"Finnley Clark",jersey:"17",dob:"",registered:false,teamReach:true,parents:"Tracy Clark",email:"tracylclark24@gmail.com",phone:"",notes:"Returning U12; jersey conflict with Colin"},
    {id:crypto.randomUUID(),name:"Grayson Santoro",jersey:"23",dob:"",registered:false,teamReach:true,parents:"Katy Santoro",email:"asantoro2@nycap.rr.com",phone:"",notes:""},
    {id:crypto.randomUUID(),name:"Hunter Harrington",jersey:"27",dob:"",registered:false,teamReach:true,parents:"Kaliena Stanley; Mitchell Harrington",email:"kalienamarie@yahoo.com",phone:"",notes:""},
    {id:crypto.randomUUID(),name:"Jacob Madara",jersey:"10",dob:"",registered:false,teamReach:true,parents:"Juliann Madara; Nick Madara",email:"jwmadara@yahoo.com; nickmadara83@gmail.com",phone:"",notes:""},
    {id:crypto.randomUUID(),name:"Jaxon McDonough",jersey:"11",dob:"",registered:false,teamReach:false,parents:"Tobey Snyder",email:"tobeysnyder@hotmail.com",phone:"518-926-8974",notes:"TeamReach invite pending"},
    {id:crypto.randomUUID(),name:"Jude Budge",jersey:"",dob:"",registered:false,teamReach:true,parents:"Michelle Greene; Dustin Budge",email:"budgemm@gmail.com",phone:"",notes:""},
    {id:crypto.randomUUID(),name:"Landon Cartier",jersey:"14",dob:"",registered:false,teamReach:true,parents:"Laura Cartier; Bill Cartier",email:"lauranizolek@gmail.com; WilfredCartierIV@gmail.com",phone:"518-796-9686; 518-926-8310",notes:""},
    {id:crypto.randomUUID(),name:"Luca Bertagnoli",jersey:"20",dob:"",registered:false,teamReach:true,parents:"Tony Bertagnoli; Shannon Bertagnoli",email:"tonybert@gmail.com",phone:"",notes:""},
    {id:crypto.randomUUID(),name:"Paul Roden",jersey:"",dob:"",registered:false,teamReach:true,parents:"Kate Roden",email:"11goldens.toga@gmail.com",phone:"",notes:""}
  ],
  events: [],
  attendance: [],
  practices: [],
  drills: [
    {id:crypto.randomUUID(),name:"4v1 Rondo",theme:"First touch, scanning, support",minutes:12,players:"5",equipment:"Cones, balls",notes:"Rotate defender frequently."},
    {id:crypto.randomUUID(),name:"Directional 5v3 Rondo",theme:"Progression and transition",minutes:15,players:"8",equipment:"Cones, balls, two target gates",notes:"Score by connecting into target."},
    {id:crypto.randomUUID(),name:"4v4+3 Positional Game",theme:"Playing through pressure",minutes:18,players:"11",equipment:"Cones, pinnies, balls",notes:"Neutral players support team in possession."},
    {id:crypto.randomUUID(),name:"Transition Game",theme:"Immediate reaction after turnover",minutes:20,players:"10-14",equipment:"Pinnies, cones, goals",notes:"Reward quick counterattack and recovery."}
  ],
  matches: [],
  development: [],
  equipment: [
    {id:crypto.randomUUID(),item:"Soccer balls",qty:15,status:"Good",notes:""},
    {id:crypto.randomUUID(),item:"Pinnies",qty:18,status:"Good",notes:""},
    {id:crypto.randomUUID(),item:"Cones",qty:40,status:"Good",notes:""}
  ],
  notes: []
};

let data = loadData();
let deferredPrompt = null;

function loadData(){
  const raw = localStorage.getItem("touchlineBinderData");
  if(!raw) {
    localStorage.setItem("touchlineBinderData", JSON.stringify(initialData));
    return structuredClone(initialData);
  }
  try { return JSON.parse(raw); } catch { return structuredClone(initialData); }
}
function save(){ localStorage.setItem("touchlineBinderData", JSON.stringify(data)); renderAll(); }
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function fmtDate(v){ if(!v) return "TBD"; const d=new Date(v+"T00:00:00"); return d.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}); }
function playerName(id){ return data.players.find(p=>p.id===id)?.name || "Unknown"; }
function eventTypeLabel(t){return ({practice:"Practice",league:"League Game",indoor:"Indoor",tournament:"Tournament",scrimmage:"Scrimmage"}[t]||t)}

function renderAll(){
  document.getElementById("teamLabel").textContent = `${data.meta.teamName} • ${data.meta.season}`;
  renderDashboard(); renderPlayers(); renderEvents(); renderAttendance(); renderPractice(); renderMatches(); renderDevelopment(); renderEquipment(); renderSettings();
}

function renderDashboard(){
  const el=document.getElementById("dashboard");
  const upcoming=[...data.events].filter(e=>!e.date || new Date(e.date+"T23:59:59")>=new Date()).sort((a,b)=>(a.date||"9999").localeCompare(b.date||"9999"));
  const next=upcoming[0];
  const conflicts={};
  data.players.filter(p=>p.jersey).forEach(p=>(conflicts[p.jersey]??=[]).push(p.name));
  const jerseyConflicts=Object.entries(conflicts).filter(([_,names])=>names.length>1);
  el.innerHTML=`
    <div class="grid">
      <div class="card"><div class="muted">Players</div><div class="stat">${data.players.length}</div></div>
      <div class="card"><div class="muted">Officially registered</div><div class="stat">${data.players.filter(p=>p.registered).length}/${data.players.length}</div></div>
      <div class="card"><div class="muted">Upcoming events</div><div class="stat">${upcoming.length}</div></div>
      <div class="card"><div class="muted">Jersey conflicts</div><div class="stat">${jerseyConflicts.length}</div></div>
    </div>
    <div class="card">
      <h2>Next event</h2>
      ${next?`<h3>${esc(next.title||eventTypeLabel(next.type))}</h3><p>${fmtDate(next.date)} ${esc(next.time||"")}<br>${esc(next.location||"Location TBD")}</p>`:`<p class="muted">No events added yet.</p>`}
    </div>
    <div class="card">
      <h2>Outstanding actions</h2>
      ${data.players.filter(p=>!p.registered).length?`<p><span class="badge warn">${data.players.filter(p=>!p.registered).length}</span> players awaiting official registration.</p>`:""}
      ${data.players.filter(p=>!p.jersey).length?`<p><span class="badge warn">${data.players.filter(p=>!p.jersey).length}</span> players still need jersey numbers.</p>`:""}
      ${jerseyConflicts.map(([n,names])=>`<p><span class="badge danger">#${esc(n)}</span> ${esc(names.join(" and "))}</p>`).join("")}
      ${data.players.filter(p=>!p.teamReach).map(p=>`<p><span class="badge warn">TeamReach</span> ${esc(p.name)} pending.</p>`).join("")}
    </div>`;
}

function renderPlayers(){
  const el=document.getElementById("players");
  el.innerHTML=`<div class="row"><h2>Players</h2><button onclick="openPlayer()">Add player</button></div>
  ${data.players.sort((a,b)=>a.name.localeCompare(b.name)).map(p=>`
    <div class="card">
      <div class="row"><div><h3>${esc(p.name)} ${p.jersey?`<span class="badge">#${esc(p.jersey)}</span>`:""}</h3>
      <div class="small muted">${p.registered?"Officially registered":"Tryout/accepted only"} • ${p.teamReach?"TeamReach active":"TeamReach pending"}</div></div>
      <button class="secondary" onclick="openPlayer('${p.id}')">Edit</button></div>
      <p class="small">${esc(p.parents||"No parent info")}<br>${esc(p.email||"")} ${esc(p.phone||"")}</p>
      ${p.notes?`<p>${esc(p.notes)}</p>`:""}
    </div>`).join("")}`;
}

function openPlayer(id){
  const p=id?data.players.find(x=>x.id===id):{id:"",name:"",jersey:"",dob:"",registered:false,teamReach:false,parents:"",email:"",phone:"",notes:""};
  openModal(`Player`,`
    <label>Name<input name="name" value="${esc(p.name)}" required></label>
    <label>DOB<input name="dob" type="date" value="${esc(p.dob)}"></label>
    <label>Jersey<input name="jersey" value="${esc(p.jersey)}"></label>
    <label>Parents/guardians<input name="parents" value="${esc(p.parents)}"></label>
    <label>Email<input name="email" value="${esc(p.email)}"></label>
    <label>Phone<input name="phone" value="${esc(p.phone)}"></label>
    <label><input name="registered" type="checkbox" ${p.registered?"checked":""}> Official registration complete</label>
    <label><input name="teamReach" type="checkbox" ${p.teamReach?"checked":""}> TeamReach active</label>
    <label>Notes<textarea name="notes">${esc(p.notes)}</textarea></label>`,
    form=>{
      const obj={...p,id:p.id||crypto.randomUUID(),name:form.name.value.trim(),dob:form.dob.value,jersey:form.jersey.value.trim(),parents:form.parents.value.trim(),email:form.email.value.trim(),phone:form.phone.value.trim(),registered:form.registered.checked,teamReach:form.teamReach.checked,notes:form.notes.value.trim()};
      if(id) data.players[data.players.findIndex(x=>x.id===id)]=obj; else data.players.push(obj); save();
    });
}

function renderEvents(){
  const el=document.getElementById("events");
  const sorted=[...data.events].sort((a,b)=>(a.date||"9999").localeCompare(b.date||"9999"));
  el.innerHTML=`<div class="row"><h2>Schedule</h2><button onclick="openEvent()">Add event</button></div>
  ${sorted.length?sorted.map(e=>`<div class="card"><div class="row"><div><h3>${esc(e.title||eventTypeLabel(e.type))}</h3><p>${fmtDate(e.date)} ${esc(e.time||"")}<br>${esc(e.location||"Location TBD")}</p><span class="badge">${esc(eventTypeLabel(e.type))}</span> <span class="badge">${esc(e.season||"")}</span></div><button class="secondary" onclick="openEvent('${e.id}')">Edit</button></div></div>`).join(""):`<div class="card muted">Add practices, league games, indoor sessions, tournaments, and scrimmages as they are released.</div>`}`;
}

function openEvent(id){
  const e=id?data.events.find(x=>x.id===id):{id:"",title:"",type:"practice",season:"Fall",date:"",time:"",endTime:"",location:"",opponent:"",notes:""};
  openModal("Event",`
    <label>Title<input name="title" value="${esc(e.title)}" placeholder="Tuesday practice or vs Saratoga"></label>
    <label>Type<select name="type">${["practice","league","indoor","tournament","scrimmage"].map(x=>`<option value="${x}" ${e.type===x?"selected":""}>${eventTypeLabel(x)}</option>`).join("")}</select></label>
    <label>Season/session<input name="season" value="${esc(e.season)}" placeholder="Fall, Winter I, Spring"></label>
    <label>Date<input name="date" type="date" value="${esc(e.date)}"></label>
    <div class="row"><label>Start<input name="time" type="time" value="${esc(e.time)}"></label><label>End<input name="endTime" type="time" value="${esc(e.endTime)}"></label></div>
    <label>Location<input name="location" value="${esc(e.location)}"></label>
    <label>Opponent<input name="opponent" value="${esc(e.opponent)}"></label>
    <label>Notes<textarea name="notes">${esc(e.notes)}</textarea></label>`,
    form=>{
      const obj={...e,id:e.id||crypto.randomUUID(),title:form.title.value.trim(),type:form.type.value,season:form.season.value.trim(),date:form.date.value,time:form.time.value,endTime:form.endTime.value,location:form.location.value.trim(),opponent:form.opponent.value.trim(),notes:form.notes.value.trim()};
      if(id) data.events[data.events.findIndex(x=>x.id===id)]=obj; else data.events.push(obj); save();
    });
}

function renderAttendance(){
  const el=document.getElementById("attendance");
  el.innerHTML=`<div class="row"><h2>Attendance</h2><button onclick="openAttendance()">Record</button></div>
  ${data.attendance.length?data.attendance.slice().reverse().map(a=>`<div class="card"><h3>${esc(a.title)}</h3><p>${fmtDate(a.date)}</p><p>${a.present.length}/${data.players.length} present</p></div>`).join(""):`<div class="card muted">Attendance records will appear here.</div>`}`;
}
function openAttendance(){
  openModal("Attendance",`
    <label>Date<input name="date" type="date" required></label>
    <label>Title<input name="title" value="Practice"></label>
    <div class="stack">${data.players.map(p=>`<label><input type="checkbox" name="p_${p.id}" checked> ${esc(p.name)}</label>`).join("")}</div>`,
    form=>{
      const present=data.players.filter(p=>form[`p_${p.id}`]?.checked).map(p=>p.id);
      data.attendance.push({id:crypto.randomUUID(),date:form.date.value,title:form.title.value.trim(),present}); save();
    });
}

function renderPractice(){
  const el=document.getElementById("practice");
  el.innerHTML=`<div class="quick-actions"><button onclick="openPractice()">New plan</button><button class="secondary" onclick="openDrill()">Add drill</button><button class="secondary" onclick="showView('attendance')">Attendance</button><button class="secondary" onclick="showView('development')">Development</button></div>
  <h2>Practice plans</h2>
  ${data.practices.length?data.practices.slice().reverse().map(p=>`<div class="card"><h3>${esc(p.theme)}</h3><p>${fmtDate(p.date)} • ${esc(p.duration)} minutes</p><p>${esc(p.objectives)}</p><p class="small muted">${esc(p.activities)}</p></div>`).join(""):`<div class="card muted">Create plans as practice dates are confirmed.</div>`}
  <h2>Drill library</h2>
  ${data.drills.map(d=>`<div class="card"><h3>${esc(d.name)}</h3><p>${esc(d.theme)} • ${esc(d.minutes)} min • ${esc(d.players)} players</p><p class="small">${esc(d.equipment)}<br>${esc(d.notes)}</p></div>`).join("")}`;
}
function openPractice(){
  openModal("Practice plan",`
    <label>Date<input name="date" type="date"></label>
    <label>Theme<input name="theme" required></label>
    <label>Duration<input name="duration" type="number" value="90"></label>
    <label>Objectives<textarea name="objectives"></textarea></label>
    <label>Activities<textarea name="activities" placeholder="Warm-up, rondo, game, finishing..."></textarea></label>
    <label>Equipment<textarea name="equipment"></textarea></label>
    <label>After-practice notes<textarea name="notes"></textarea></label>`,
    form=>{data.practices.push({id:crypto.randomUUID(),date:form.date.value,theme:form.theme.value.trim(),duration:form.duration.value,objectives:form.objectives.value.trim(),activities:form.activities.value.trim(),equipment:form.equipment.value.trim(),notes:form.notes.value.trim()});save();}
  );
}
function openDrill(){
  openModal("Drill",`
    <label>Name<input name="name" required></label><label>Theme<input name="theme"></label>
    <label>Minutes<input name="minutes" type="number"></label><label>Players<input name="players"></label>
    <label>Equipment<input name="equipment"></label><label>Notes<textarea name="notes"></textarea></label>`,
    form=>{data.drills.push({id:crypto.randomUUID(),name:form.name.value.trim(),theme:form.theme.value.trim(),minutes:form.minutes.value,players:form.players.value.trim(),equipment:form.equipment.value.trim(),notes:form.notes.value.trim()});save();}
  );
}

function renderMatches(){
  const el=document.getElementById("matches");
  el.innerHTML=`<div class="row"><h2>Matches & AARs</h2><button onclick="openMatch()">Add match</button></div>
  ${data.matches.length?data.matches.slice().reverse().map(m=>`<div class="card"><h3>${esc(m.opponent)} ${m.gf!==""?`${esc(m.gf)}–${esc(m.ga)}`:""}</h3><p>${fmtDate(m.date)} • ${esc(m.competition)}</p><p><strong>Went well:</strong> ${esc(m.well)}</p><p><strong>Improve:</strong> ${esc(m.improve)}</p><p><strong>Next practice:</strong> ${esc(m.next)}</p></div>`).join(""):`<div class="card muted">Record results and Army-style After Action Reviews.</div>`}`;
}
function openMatch(){
  openModal("Match AAR",`
    <label>Date<input name="date" type="date"></label><label>Opponent<input name="opponent" required></label>
    <label>Competition<input name="competition"></label>
    <div class="row"><label>Goals for<input name="gf" type="number"></label><label>Goals against<input name="ga" type="number"></label></div>
    <label>What was supposed to happen?<textarea name="planned"></textarea></label>
    <label>What actually happened?<textarea name="actual"></textarea></label>
    <label>What went well?<textarea name="well"></textarea></label>
    <label>What needs improvement?<textarea name="improve"></textarea></label>
    <label>What changes at the next practice?<textarea name="next"></textarea></label>`,
    form=>{data.matches.push({id:crypto.randomUUID(),date:form.date.value,opponent:form.opponent.value.trim(),competition:form.competition.value.trim(),gf:form.gf.value,ga:form.ga.value,planned:form.planned.value.trim(),actual:form.actual.value.trim(),well:form.well.value.trim(),improve:form.improve.value.trim(),next:form.next.value.trim()});save();}
  );
}

function renderDevelopment(){
  const el=document.getElementById("development");
  el.innerHTML=`<div class="row"><h2>Player development</h2><button onclick="openDevelopment()">Add note</button></div>
  ${data.development.length?data.development.slice().reverse().map(n=>`<div class="card"><h3>${esc(playerName(n.playerId))}</h3><p>${fmtDate(n.date)} • <span class="badge">${esc(n.category)}</span></p><p>${esc(n.note)}</p></div>`).join(""):`<div class="card muted">Add short observations throughout the season.</div>`}`;
}
function openDevelopment(){
  openModal("Development note",`
    <label>Player<select name="playerId">${data.players.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select></label>
    <label>Date<input name="date" type="date"></label>
    <label>Category<select name="category">${["Technical","Tactical","Physical","Mental","Teamwork","Decision-making"].map(x=>`<option>${x}</option>`).join("")}</select></label>
    <label>Note<textarea name="note"></textarea></label>`,
    form=>{data.development.push({id:crypto.randomUUID(),playerId:form.playerId.value,date:form.date.value,category:form.category.value,note:form.note.value.trim()});save();}
  );
}

function renderEquipment(){
  const el=document.getElementById("equipment");
  el.innerHTML=`<div class="row"><h2>Equipment</h2><button onclick="openEquipment()">Add item</button></div>
  ${data.equipment.map(x=>`<div class="card"><div class="row"><div><h3>${esc(x.item)}</h3><p>${esc(x.qty)} • ${esc(x.status)}</p></div></div>${x.notes?`<p>${esc(x.notes)}</p>`:""}</div>`).join("")}`;
}
function openEquipment(){
  openModal("Equipment",`
    <label>Item<input name="item" required></label><label>Quantity<input name="qty" type="number"></label>
    <label>Status<select name="status"><option>Good</option><option>Replace soon</option><option>Missing</option></select></label>
    <label>Notes<textarea name="notes"></textarea></label>`,
    form=>{data.equipment.push({id:crypto.randomUUID(),item:form.item.value.trim(),qty:form.qty.value,status:form.status.value,notes:form.notes.value.trim()});save();}
  );
}

function renderSettings(){
  const el=document.getElementById("settings");
  el.innerHTML=`<h2>More</h2>
  <div class="quick-actions"><button onclick="showView('attendance')">Attendance</button><button onclick="showView('development')">Development</button><button onclick="showView('equipment')">Equipment</button></div>
  <div class="card"><h3>Team settings</h3>
    <label>Team name<input id="setTeam" value="${esc(data.meta.teamName)}"></label>
    <label>Season<input id="setSeason" value="${esc(data.meta.season)}"></label>
    <button onclick="updateSettings()">Save settings</button>
  </div>
  <div class="card"><h3>Backup and handoff</h3>
    <p class="muted">Everything is stored only on this device unless you export a backup.</p>
    <div class="quick-actions"><button onclick="exportData()">Export backup</button><button class="secondary" onclick="document.getElementById('importFile').click()">Import backup</button></div>
  </div>
  <div class="card"><h3>Reset</h3><button class="danger" onclick="resetData()">Erase local data</button></div>`;
}
function updateSettings(){data.meta.teamName=document.getElementById("setTeam").value.trim();data.meta.season=document.getElementById("setSeason").value.trim();save();}
function exportData(){
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`Touchline_Binder_${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(a.href);
}
document.getElementById("importFile").addEventListener("change",async e=>{
  const f=e.target.files[0]; if(!f)return;
  try{const parsed=JSON.parse(await f.text()); data=parsed; save(); alert("Backup imported.");}catch{alert("That file could not be imported.");}
});
function resetData(){if(confirm("Erase all local data and restore the starter roster?")){data=structuredClone(initialData);save();}}

function showView(id){
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===id));
  document.querySelectorAll(".bottom-nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===id));
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".bottom-nav button").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));

function openModal(title,fields,onSave){
  const modal=document.getElementById("modal");
  document.getElementById("modalContent").innerHTML=`<h2>${esc(title)}</h2><div class="stack">${fields}</div>`;
  const form=document.getElementById("modalForm");
  const saveBtn=document.getElementById("modalSave");
  saveBtn.onclick=e=>{e.preventDefault(); if(!form.reportValidity()) return; onSave(form.elements); modal.close();};
  modal.showModal();
}

window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;document.getElementById("installBtn").classList.remove("hidden");});
document.getElementById("installBtn").addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;document.getElementById("installBtn").classList.add("hidden");});
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
renderAll(); showView("dashboard");
