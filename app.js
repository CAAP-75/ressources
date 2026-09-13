const P = window.CAAP_PHOTOS || {GROUP_PHOTOS:{},SECTION_PHOTOS:{},RESOURCE_PHOTOS:{}};

const INTENTS = {
  comprendre:{title:'Je veux comprendre',subtitle:'Connaître le dispositif et m’inspirer de ce qui fonctionne',sections:['Le projet','Ressources académiques','Un peu de lecture…','Vidéos et Podcasts','Inspiration Pays nordiques'],tone:'blue'},
  bouger:{title:'Je veux faire bouger les élèves',subtitle:'Mettre le mouvement au service des apprentissages',sections:['Espace inter-disciplinaires','Espaces pédagogiques','EPS','Tests de qualités physiques'],tone:'green'},
  amenager:{title:'Je veux aménager les espaces',subtitle:'Créer un environnement qui invite à bouger au quotidien',sections:['Espaces de restauration et de pause','Espaces de circulation','Espaces extérieurs'],tone:'orange'},
  bienetre:{title:'Je veux agir sur le bien-être',subtitle:'Favoriser la santé, la motivation et le climat scolaire',sections:['Semaines à thème','Espace dédié à la vie scolaire'],tone:'pink'},
  personnels:{title:'Je veux mobiliser les personnels',subtitle:'Prendre soin de ceux qui font vivre l’établissement',sections:['Actions pour le personnel'],tone:'violet'},
  pilotage:{title:'Je veux piloter le projet',subtitle:'Construire une dynamique collective',sections:['Espace de dialogue et gouvernance','Espaces numériques et de communication'],tone:'cyan'},
  evaluation:{title:'Je veux évaluer',subtitle:'Mesurer les effets et faire évoluer nos actions',sections:['Evaluation'],tone:'red'}
};

const INTENT_ORDER=['comprendre','bouger','amenager','bienetre','personnels','pilotage','evaluation'];
const coreResources=[...(window.CAAP_RESOURCES||[])];
let resources=[...coreResources];
let activeIntent=null;
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

function primaryIntentFor(r){
  const s=sectionFor(r);
  if(['Le projet','Ressources académiques','Un peu de lecture…','Vidéos et Podcasts','Inspiration Pays nordiques'].includes(s)) return 'comprendre';
  if(['Espace inter-disciplinaires','Espaces pédagogiques','EPS','Tests de qualités physiques'].includes(s)) return 'bouger';
  if(['Espaces de restauration et de pause','Espaces de circulation','Espaces extérieurs'].includes(s)) return 'amenager';
  if(['Semaines à thème','Espace dédié à la vie scolaire'].includes(s)) return 'bienetre';
  if(s==='Actions pour le personnel') return 'personnels';
  if(['Espace de dialogue et gouvernance','Espaces numériques et de communication'].includes(s)) return 'pilotage';
  if(s==='Evaluation') return 'evaluation';
  return 'comprendre';
}

function photoFor(r){return P.RESOURCE_PHOTOS?.[r.title] || P.SECTION_PHOTOS?.[sectionFor(r)] || 'assets/res-outils.jpg'}
function intentCount(key){return resources.filter(r=>primaryIntentFor(r)===key).length}

function switchView(name){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active-view'));
  const target=document.getElementById(name+'View'); if(!target)return;
  target.classList.add('active-view');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
  window.scrollTo({top:0,behavior:'smooth'});
  if(name==='favorites')renderFavorites();
  if(name==='resources')renderResources(activeIntent);
}

function renderHomeIntents(){
  const grid=document.getElementById('homeIntentGrid');
  grid.innerHTML=INTENT_ORDER.map(k=>{const i=INTENTS[k];return `<button class="home-intent-card tone-${i.tone}" data-intent="${k}"><div class="home-intent-copy"><h3>${esc(i.title)}</h3><p>${esc(i.subtitle)}</p></div><span class="home-intent-count">${intentCount(k)} ressources</span><span class="home-intent-arrow">›</span></button>`}).join('');
  grid.querySelectorAll('[data-intent]').forEach(b=>b.onclick=()=>openIntent(b.dataset.intent));
}

function resourceRowHtml(r){
  const id=rid(r),fav=favoriteIds.has(id),type=(r.type||'ressource').toUpperCase();
  let desc=(r.body||'').split('\n')[0]; if(desc.length>170)desc=desc.slice(0,167)+'…';
  return `<article class="text-resource-row"><div class="text-resource-main"><h4>${esc(r.title)}</h4>${desc?`<p>${esc(desc)}</p>`:''}<div class="resource-meta"><span>${esc(type)}</span><span>${esc(sectionFor(r))}</span></div></div><div class="text-resource-actions"><button class="open-resource" data-id="${id}">Voir →</button><button class="favorite" data-fav="${id}" aria-label="Ajouter aux favoris">${fav?'♥':'♡'}</button></div></article>`;
}
function attach(container){
  container.querySelectorAll('.open-resource').forEach(b=>b.onclick=()=>showResource(b.dataset.id));
  container.querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>{const id=b.dataset.fav;favoriteIds.has(id)?favoriteIds.delete(id):favoriteIds.add(id);saveFavs();b.textContent=favoriteIds.has(id)?'♥':'♡'});
}

function renderResources(intentKey=null){
  const c=document.getElementById('resourcesContent');
  const sub=document.getElementById('resourcesSubtitle');
  const allBtn=document.getElementById('showAllResources');
  const keys=intentKey?[intentKey]:INTENT_ORDER;
  activeIntent=intentKey;
  if(intentKey){sub.textContent=INTENTS[intentKey].subtitle+'.';allBtn.classList.remove('hidden')} else {sub.textContent='Toutes les ressources du dispositif, classées selon vos besoins.';allBtn.classList.add('hidden')}
  c.innerHTML=keys.map(k=>{
    const i=INTENTS[k];
    const list=resources.filter(r=>primaryIntentFor(r)===k);
    if(!list.length)return '';
    return `<section class="resource-intent-section tone-border-${i.tone}"><div class="resource-intent-head tone-${i.tone}"><div><h3>${esc(i.title)}</h3><p>${esc(i.subtitle)}</p></div><span>${list.length} ressource${list.length>1?'s':''}</span></div><div class="text-resource-list">${list.map(resourceRowHtml).join('')}</div></section>`;
  }).join('') || '<p>Aucune ressource dans cette entrée.</p>';
  attach(c);
}
function openIntent(key){if(!INTENTS[key])return;activeIntent=key;switchView('resources')}

function showProject(){activeIntent='comprendre';switchView('resources')}
function showResource(id){
  const r=resources.find(x=>rid(x)===id);if(!r)return;
  document.getElementById('modalBody').innerHTML=`<h2>${esc(r.title)}</h2>${r.body?`<div class="fullbody">${esc(r.body)}</div>`:''}${r.url?`<p><a href="${r.url}" target="_blank" rel="noopener">Ouvrir la ressource ↗</a></p>`:''}`;
  document.getElementById('modal').classList.add('open');
}
function renderFavorites(){const list=resources.filter(r=>favoriteIds.has(rid(r))),c=document.getElementById('favoriteList');c.className='text-resource-list';c.innerHTML=list.length?list.map(resourceRowHtml).join(''):'<p>Vous n’avez pas encore ajouté de favori.</p>';attach(c)}

const ideas={
  'Faire davantage bouger les élèves':['bouger'],
  'Réduire la sédentarité':['comprendre','bouger','amenager'],
  'Améliorer le bien-être':['bienetre'],
  'Agir sur le climat scolaire':['bienetre','pilotage'],
  'Aménager une salle de classe':['bouger','amenager'],
  'Aménager les couloirs':['amenager'],
  'Aménager la cour':['amenager'],
  'Agir sur les écrans':['pilotage','evaluation'],
  'Agir sur l’alimentation':['amenager'],
  'Mobiliser les personnels':['personnels'],
  'Associer les parents':['pilotage','bienetre'],
  'Organiser un temps fort':['bienetre','bouger'],
  'Évaluer mon action':['evaluation']
};
function renderIdeas(){
  const g=document.getElementById('ideaButtons');
  g.innerHTML=Object.keys(ideas).map(x=>`<button data-idea="${esc(x)}">${esc(x)}</button>`).join('');
  g.querySelectorAll('button').forEach(b=>b.onclick=()=>{const ks=ideas[b.dataset.idea],c=document.getElementById('ideaResults');const list=resources.filter(r=>ks.includes(primaryIntentFor(r)));c.className='text-resource-list';c.innerHTML=list.slice(0,24).map(resourceRowHtml).join('');attach(c)});
}
async function loadRemote(){const url=window.CAAP_CONFIG?.REMOTE_FEED_URL;if(!url)return;try{const res=await fetch(url,{cache:'no-store'}),data=await res.json(),arr=Array.isArray(data)?data:(data.resources||[]);resources=[...coreResources,...arr];renderHomeIntents();renderResources(activeIntent)}catch(e){}}

document.querySelectorAll('.nav-btn').forEach(b=>b.onclick=()=>{if(b.dataset.view==='resources')activeIntent=null;switchView(b.dataset.view)});
document.querySelector('.brand-home').onclick=()=>switchView('home');
document.querySelectorAll('[data-quick]').forEach(b=>b.onclick=()=>switchView('ideas'));
document.getElementById('discoverProject').onclick=showProject;
document.getElementById('showAllResources').onclick=()=>{activeIntent=null;renderResources(null)};
document.getElementById('modalClose').onclick=()=>document.getElementById('modal').classList.remove('open');
document.getElementById('modal').onclick=e=>{if(e.target.id==='modal')e.currentTarget.classList.remove('open')};
document.querySelectorAll('[data-view="legal"]').forEach(b=>b.onclick=()=>switchView('legal'));
document.querySelectorAll('#legalView [data-view="home"]').forEach(b=>b.onclick=()=>switchView('home'));

renderHomeIntents();renderResources();renderIdeas();loadRemote();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
