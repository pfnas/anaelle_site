(() => {
  const ADMIN_KEY = 'anaelle_admin_mode';
  const CONTENT_KEY = 'anaelle_content';
  const EVENTS_KEY = 'anaelle_events';

  let isAdmin = localStorage.getItem(ADMIN_KEY) === 'true';
  const toggleBtn = document.getElementById('toggle-admin');
  const editableEls = document.querySelectorAll('.editable');
  const eventsList = document.getElementById('events-list');

  // Charger textes sauvegardés
  const saved = JSON.parse(localStorage.getItem(CONTENT_KEY) || '{}');
  editableEls.forEach(el => { const k=el.dataset.key; if(saved[k]) el.innerText=saved[k]; });

  editableEls.forEach(el => {
    el.addEventListener('input', () => {
      const k=el.dataset.key;
      const obj=JSON.parse(localStorage.getItem(CONTENT_KEY)||'{}');
      obj[k]=el.innerText;
      localStorage.setItem(CONTENT_KEY,JSON.stringify(obj));
    });
  });

  // Evénements
  let events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
  function saveEvents(){ localStorage.setItem(EVENTS_KEY, JSON.stringify(events)); }
  function renderEvents(){
    if(!eventsList) return;
    eventsList.innerHTML='';
    events.forEach((e,i)=>{
      const div=document.createElement('div');
      div.className='event-card';
      div.innerHTML=`<strong>${e.title}</strong> — ${e.date||''} ${e.time||''}<div>${e.desc||''}</div>`;
      if(isAdmin){
        const del=document.createElement('button');
        del.textContent='Supprimer';
        del.onclick=()=>{events.splice(i,1);saveEvents();renderEvents();};
        div.appendChild(del);
      }
      eventsList.appendChild(div);
    });
    if(isAdmin){
      const btn=document.createElement('button');
      btn.textContent='➕ Ajouter un évènement';
      btn.onclick=()=>{
        const t=prompt('Titre :'); if(!t) return;
        events.unshift({title:t,date:prompt('Date :'),time:prompt('Heure :'),desc:prompt('Description :')});
        saveEvents(); renderEvents();
      };
      eventsList.appendChild(btn);
    }
  }

  function applyMode(){
    editableEls.forEach(e=>e.contentEditable=isAdmin);
    toggleBtn.textContent=isAdmin?'🔒 Désactiver':'🪄 Activer';
    renderEvents();
  }

  toggleBtn.onclick=()=>{
    if(!isAdmin){ window.location='admin.html'; return; }
    localStorage.setItem(ADMIN_KEY,'false');
    isAdmin=false; applyMode();
  };

  window.addEventListener('storage',e=>{
    if(e.key===ADMIN_KEY){ isAdmin=e.newValue==='true'; applyMode(); }
  });

  applyMode();
})();
