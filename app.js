const P = window.CAAP_PHOTOS || {GROUP_PHOTOS:{},SECTION_PHOTOS:{},RESOURCE_PHOTOS:{}};

const GROUPS = {
  comprendre:{
    title:'Comprendre & s’inspirer',
    subtitle:'Pourquoi bouger aide à apprendre et à se sentir mieux',
    image:P.GROUP_PHOTOS.comprendre,
    sections:['Le projet','Ressources académiques','Inspiration Pays nordiques','Un peu de lecture…','Vidéos et Podcasts']
  },
  apprendre:{
    title:'Bouger pour apprendre',
    subtitle:'Mettre le mouvement au service des apprentissages',
    image:P.GROUP_PHOTOS.apprendre,
    sections:['Espace inter-disciplinaires','Espaces pédagogiques']
  },
  amenager:{
    title:'Aménager les espaces',
    subtitle:'Faire de l’établissement un environnement qui invite à bouger',
    image:P.GROUP_PHOTOS.amenager,
    sections:['Espace dédié à la vie scolaire','Espaces de restauration et de pause','Espaces de circulation','Espaces extérieurs']
  },
  eps:{
    title:'EPS & activité physique',
    subtitle:'Développer les aptitudes et donner envie de bouger davantage',
    image:P.GROUP_PHOTOS.eps,
    sections:['EPS','Tests de qualités physiques']
  },
  personnels:{
    title:'Mobiliser les personnels',
    subtitle:'Prendre soin de ceux qui font vivre l’établissement',
    image:P.GROUP_PHOTOS.personnels,
    sections:['Actions pour le personnel']
  },
  tempsforts:{
    title:'Faire vivre le projet',
    subtitle:'Créer des temps forts qui mobilisent toute la communauté',
    image:P.GROUP_PHOTOS.tempsforts,
    sections:['Semaines à thème']
  },
  pilotage:{
    title:'Piloter & communiquer',
    subtitle:'Construire une dynamique collective dans l’établissement',
    image:P.GROUP_PHOTOS.pilotage,
    sections:['Espace de dialogue et gouvernance','Espaces numériques et de communication']
  },
  evaluation:{
    title:'Évaluer & progresser',
    subtitle:'Mesurer les effets pour faire évoluer les actions',
    image:P.GROUP_PHOTOS.evaluation,
    sections:['Evaluation']
  }
};

const coreResources=[...(window.CAAP_RESOURCES||[])];
let resources=[...coreResources];
const favoriteIds=new Set(JSON.parse(localStorage.getItem('caapFavs')||'[]'));

function rid(r){return btoa(unescape(encodeURIComponent((r.cat||'')+'|'+(r.title||'')))).replace(/=/g,'')}
function saveFavs(){localStorage.setItem('caapFavs',JSON.stringify([...favoriteIds]))}
function esc(s){return (s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function blob(r){return `${r.title||''} ${r.body||''}`.toLowerCase()}

function sectionFor(r){
  const t=blob(r);
  if(r.cat==='projet') return 'Le projet';
  if(r.cat==='semaines') return 'Semaines à thème';
  if(r.cat==='personnels') return 'Actions pour le personnel';
  if(r.cat==='eps') return /test|endurance|vitesse|sprint|qualit.? physique|etages express|tour de la maison|chaussettes/.test(t)?'Tests de qualités physiques':'EPS';
  if(r.cat==='evaluation') return 'Evaluation';
  if(r.cat==='pilotage') return /numérique|ecran|écran|ent|site web|réseaux sociaux|carnet de santé|communication/.test(t)?'Espaces numériques et de communication':'Espace de dialogue et gouvernance';
  if(r.cat==='viescolaire') return 'Espace dédié à la vie scolaire';
  if(r.cat==='enseignements') return /allemand|math|fléchette|interdisciplin/.test(t)?'Espace inter-disciplinaires':'Espaces pédagogiques';
  if(r.cat==='amenager'){
    if(/petit déjeuner|fruit|légume|restauration|cantine|alimentation|repas|hydratation/.test(t)) return 'Espaces de restauration et de pause';
    if(/escalier|couloir|circulation|hall|marquage|mur du|affichage|exposition/.test(t)) return 'Espaces de circulation';
    if(/extérieur|cour|jardin|récréation|marelle|piste|vert|prêt de matériel/.test(t)) return 'Espaces extérieurs';
    if(/permanence|foyer|vie scolaire|cpe|infirm|climat scolaire|heure de colle|bienveillance/.test(t)) return 'Espace dédié à la vie scolaire';
    return 'Espaces pédagogiques';
  }
  if(r.cat==='ressources'||r.cat==='documents'){
    if(/suède|suédois|nordique|erasmus|chine|rudbeck/.test(t)) return 'Inspiration Pays nordiques';
    if(['video','podcast'].includes(r.type)||/arte|youtube|radio france|france culture|documentaire|podcast|replay/.test(t)) return 'Vidéos et Podcasts';
    if(/colloque|académi|bassin|sorbonne|edusant|école promotrice|santé scolaire|onaps|rapport delandre/.test(t)) return 'Ressources académiques';
    return 'Un peu de lecture…';
  }
  return 'Un peu de lecture…';
}

function groupFor(r){
  const section=sectionFor(r);
  return Object.keys(GROUPS).find(k=>GROUPS[k].sections.includes(section)) || 'comprendre';
}

function photoFor(r){
  return P.RESOURCE_PHOTOS?.[r.title] || P.SECTION_PHOTOS?.[sectionFor(r)] || GROUPS[groupFor(r)]?.image || 'assets/res-outils.jpg';
}

function switchView(name){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active-view'));
  document.getElementById(name+'View').classList.add('active-view');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
  window.scrollTo({top:0,behavior:'smooth'});
  if(name==='favorites')renderFavorites();
  if(name==='resources')showGroupOverview();
}

function renderCategories(){
  const grid=document.getElementById('categoryGrid');
  grid.innerHTML=Object.entries(GROUPS).map(([k,g])=>`<button class="home-card" data-group="${k}"><img src="${g.image}" alt=""><div class="home-card-copy"><h3>${g.title}</h3><p>${g.subtitle}</p></div></button>`).join('');
  grid.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>openGroup(b.dataset.group));
}

function renderGroupOverview(){
  const box=document.getElementById('resourceGroups');
  box.innerHTML=Object.entries(GROUPS).map(([k,g])=>`<button class="group-card" data-group="${k}"><img src="${g.image}" alt=""><div class="group-card-copy"><h3>${g.title}</h3><p>${g.subtitle}</p></div></button>`).join('');
  box.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>openGroup(b.dataset.group));
}

function showGroupOverview(){
  document.getElementById('resourceGroups').classList.remove('hidden');
  document.getElementById('groupSection').classList.add('hidden');
  renderGroupOverview();
}

function cardHtml(r){
  const id=rid(r),fav=favoriteIds.has(id);
  return `<article class="resource-card"><img class="thumb" src="${photoFor(r)}" alt=""><div class="card-body"><h3>${esc(r.title)}</h3>${r.body?`<p>${esc(r.body)}</p>`:''}<div class="resource-actions"><button class="open-resource" data-id="${id}">Ouvrir</button><button class="favorite" data-fav="${id}" title="Ajouter aux favoris">${fav?'♥':'♡'}</button></div></div></article>`;
}

function attach(container){
  container.querySelectorAll('.open-resource').forEach(b=>b.onclick=()=>showResource(b.dataset.id));
  container.querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.fav;
    favoriteIds.has(id)?favoriteIds.delete(id):favoriteIds.add(id);
    saveFavs();
    b.textContent=favoriteIds.has(id)?'♥':'♡';
  });
}

function openGroup(key){
  const g=GROUPS[key]; if(!g)return;
  switchView('resources');
  document.getElementById('resourceGroups').classList.add('hidden');
  document.getElementById('groupSection').classList.remove('hidden');
  document.getElementById('groupTitle').textContent=g.title;
  document.getElementById('groupSubtitle').textContent=g.subtitle;
  const container=document.getElementById('groupContent');
  const chunks=[];
  g.sections.forEach(section=>{
    const list=resources.filter(r=>sectionFor(r)===section);
    if(!list.length)return;
    chunks.push(`<section class="section-block"><h3 class="section-title">${section}</h3><div class="resource-list">${list.map(cardHtml).join('')}</div></section>`);
  });
  container.innerHTML=chunks.join('')||'<p>Aucune ressource dans cette entrée.</p>';
  attach(container);
  setTimeout(()=>document.getElementById('groupSection').scrollIntoView({behavior:'smooth',block:'start'}),50);
}

function showProject(){
  switchView('resources');
  document.getElementById('resourceGroups').classList.add('hidden');
  document.getElementById('groupSection').classList.remove('hidden');
  document.getElementById('groupTitle').textContent='Le projet';
  document.getElementById('groupSubtitle').textContent='Présentation du dispositif et calendrier.';
  const list=resources.filter(r=>sectionFor(r)==='Le projet');
  const c=document.getElementById('groupContent');
  c.innerHTML=`<section class="section-block"><div class="resource-list">${list.map(cardHtml).join('')}</div></section>`;
  attach(c);
}

function showResource(id){
  const r=resources.find(x=>rid(x)===id); if(!r)return;
  document.getElementById('modalBody').innerHTML=`<img src="${photoFor(r)}" alt="" class="modal-hero"><h2>${esc(r.title)}</h2>${r.body?`<div class="fullbody">${esc(r.body)}</div>`:''}${r.url?`<p><a href="${r.url}" target="_blank" rel="noopener">Ouvrir la ressource ↗</a></p>`:''}`;
  document.getElementById('modal').classList.add('open');
}

function renderFavorites(){
  const list=resources.filter(r=>favoriteIds.has(rid(r))),c=document.getElementById('favoriteList');
  c.innerHTML=list.length?list.map(cardHtml).join(''):'<p>Vous n’avez pas encore ajouté de favori.</p>';
  attach(c);
}

const ideas={
  'Faire davantage bouger les élèves':['apprendre','eps','tempsforts'],
  'Réduire la sédentarité':['comprendre','apprendre','amenager'],
  'Améliorer le bien-être':['comprendre','amenager','personnels'],
  'Agir sur le climat scolaire':['amenager','pilotage'],
  'Aménager une salle de classe':['apprendre','amenager'],
  'Aménager les couloirs':['amenager'],
  'Aménager la cour':['amenager'],
  'Agir sur les écrans':['pilotage','evaluation'],
  'Agir sur l’alimentation':['amenager'],
  'Mobiliser les personnels':['personnels','pilotage'],
  'Associer les parents':['tempsforts','pilotage'],
  'Organiser un temps fort':['tempsforts','eps'],
  'Évaluer mon action':['evaluation']
};

function renderIdeas(){
  const g=document.getElementById('ideaButtons');
  g.innerHTML=Object.keys(ideas).map(x=>`<button data-idea="${esc(x)}">${esc(x)}</button>`).join('');
  g.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    const groups=ideas[b.dataset.idea],c=document.getElementById('ideaResults');
    const list=resources.filter(r=>groups.includes(groupFor(r)));
    c.innerHTML=list.slice(0,24).map(cardHtml).join('');attach(c);
  });
}

async function loadRemote(){
  const url=window.CAAP_CONFIG?.REMOTE_FEED_URL;if(!url)return;
  try{const res=await fetch(url,{cache:'no-store'}),data=await res.json(),arr=Array.isArray(data)?data:(data.resources||[]);resources=[...coreResources,...arr]}catch(e){}
}

document.querySelectorAll('.nav-btn').forEach(b=>b.onclick=()=>switchView(b.dataset.view));
document.querySelector('.brand-home').onclick=()=>switchView('home');
document.querySelectorAll('[data-quick]').forEach(b=>b.onclick=()=>switchView(b.dataset.quick==='favorites'?'favorites':'ideas'));
document.getElementById('discoverProject').onclick=showProject;
document.getElementById('backToGroups').onclick=showGroupOverview;
document.getElementById('modalClose').onclick=()=>document.getElementById('modal').classList.remove('open');
document.getElementById('modal').onclick=e=>{if(e.target.id==='modal')e.currentTarget.classList.remove('open')};

renderCategories();renderGroupOverview();renderIdeas();loadRemote();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
