const PH=window.CAAP_PHOTOS||{};
const photo=(key,fallback)=>PH[key]||fallback;
const CAT={
 projet:{label:'Le projet',cls:'c1',img:photo('home_projet','assets/home-projet.jpg')},
 ressources:{label:'Ressources & comprendre',cls:'c2',img:photo('home_ressources','assets/home-ressources.jpg')},
 enseignements:{label:'Agir dans les enseignements',cls:'c3',img:photo('home_enseignements','assets/home-enseignements.jpg')},
 amenager:{label:"Aménager l’établissement",cls:'c4',img:photo('home_amenager','assets/home-amenager.jpg')},
 viescolaire:{label:'Vie scolaire & climat scolaire',cls:'c5',img:photo('home_viescolaire','assets/home-viescolaire.jpg')},
 eps:{label:'EPS & activité physique',cls:'c6',img:photo('home_eps','assets/home-eps.jpg')},
 semaines:{label:'Semaines & temps forts',cls:'c7',img:photo('home_semaines','assets/home-semaines.jpg')},
 personnels:{label:'Personnels',cls:'c8',img:photo('home_personnels','assets/home-personnels.jpg')},
 pilotage:{label:'Pilotage & communication',img:photo('res_pilotage',photo('res_pilotage','assets/res-pilotage.jpg'))},
 evaluation:{label:'Évaluer',img:photo('res_evaluation',photo('res_evaluation','assets/res-evaluation.jpg'))},
 documents:{label:'Outils et documents',img:photo('res_outils',photo('res_outils','assets/res-outils.jpg'))}
};
const coreResources=[...(window.CAAP_RESOURCES||[])];let resources=[...coreResources];
const favoriteIds=new Set(JSON.parse(localStorage.getItem('caapFavs')||'[]'));
const topics=[
 ['Ressources académiques',photo('res_academiques','assets/res-academiques.jpg'),r=>/sorbonne|académi|bassin|affiche promotion|jean zay/i.test(r.title+' '+(r.body||''))],
 ['École promotrice de santé',photo('res_ecole_sante','assets/res-ecole-sante.jpg'),r=>/edusant|école promotrice|santé scolaire|Delandre/i.test(r.title+' '+(r.body||''))],
 ['Activité physique, santé et sédentarité',photo('res_activite_sedentarite','assets/res-activite-sedentarite.jpg'),r=>/sédentar|activité physique|chaise tue|santé mentale/i.test(r.title+' '+(r.body||''))],
 ['Apprendre et bouger',photo('res_apprendre','assets/res-apprendre.jpg'),r=>/apprendre|réussite|cognit|classe flexible|notes/i.test(r.title+' '+(r.body||''))],
 ['Vidéos & podcasts',photo('res_videos','assets/res-videos.jpg'),r=>['video','podcast'].includes(r.type)],
 ['Inspirations internationales',photo('res_international','assets/res-international.jpg'),r=>/suède|suédois|chine|erasmus|international/i.test(r.title+' '+(r.body||''))],
 ['Interdisciplinarité',photo('res_interdisciplinarite','assets/res-interdisciplinarite.jpg'),r=>/allemand|math|interdisciplin/i.test(r.title+' '+(r.body||''))],
 ['Bouger en classe',photo('res_bouger_classe','assets/res-bouger-classe.jpg'),r=>/chaise|pause active|bouger en classe|pédalier|break activities/i.test(r.title+' '+(r.body||''))],
 ['Bien-être et rythmes',photo('res_bienetre','assets/res-bienetre.jpg'),r=>/bien-être|stress|cohérence cardiaque|sieste|rythme/i.test(r.title+' '+(r.body||''))],
 ['Espaces pédagogiques',photo('res_espaces_pedagogiques','assets/res-espaces-pedagogiques.jpg'),r=>r.cat==='enseignements'||/mobilier|table|tabouret|fauteuil/i.test(r.title+' '+(r.body||''))],
 ['Espaces de circulation',photo('res_circulation','assets/res-circulation.jpg'),r=>/escalier|couloir|circulation|marquage/i.test(r.title+' '+(r.body||''))],
 ['Espaces extérieurs',photo('res_exterieurs','assets/res-exterieurs.jpg'),r=>/extérieur|cour|jardin|récréation|marelle/i.test(r.title+' '+(r.body||''))],
 ['Restauration et pauses',photo('res_restauration','assets/res-restauration.jpg'),r=>/petit déjeuner|fruit|restauration|alimentation|cantine/i.test(r.title+' '+(r.body||''))],
 ['Vie scolaire et climat scolaire',photo('res_viescolaire','assets/res-viescolaire.jpg'),r=>r.cat==='viescolaire'],
 ['Semaines & temps forts',photo('res_semaines','assets/res-semaines.jpg'),r=>r.cat==='semaines'],
 ['EPS et activité physique',photo('res_eps','assets/res-eps.jpg'),r=>r.cat==='eps'],
 ['Personnels',photo('res_personnels','assets/res-personnels.jpg'),r=>r.cat==='personnels'],
 ['Pilotage et communication',photo('res_pilotage','assets/res-pilotage.jpg'),r=>r.cat==='pilotage'],
 ['Outils et documents',photo('res_outils','assets/res-outils.jpg'),r=>r.type==='pdf'||r.type==='document'||r.cat==='documents'],
 ['Évaluer',photo('res_evaluation','assets/res-evaluation.jpg'),r=>r.cat==='evaluation']
];
function rid(r){return btoa(unescape(encodeURIComponent((r.cat||'')+'|'+(r.title||'')))).replace(/=/g,'')}
function saveFavs(){localStorage.setItem('caapFavs',JSON.stringify([...favoriteIds]))}
function esc(s){return (s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function switchView(name){document.querySelectorAll('.view').forEach(v=>v.classList.remove('active-view'));document.getElementById(name+'View').classList.add('active-view');document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));window.scrollTo({top:0,behavior:'smooth'});if(name==='favorites')renderFavorites();if(name==='resources')renderTopics()}
function renderCategories(){const keys=['projet','ressources','enseignements','amenager','viescolaire','eps','semaines','personnels'];document.getElementById('categoryGrid').innerHTML=keys.map(k=>`<button class="home-card ${CAT[k].cls}" data-homecat="${k}"><h3>${CAT[k].label}</h3><img src="${CAT[k].img}" alt=""></button>`).join('');document.querySelectorAll('[data-homecat]').forEach(b=>b.onclick=()=>openCategory(b.dataset.homecat))}
function imageFor(r){const t=topics.find(t=>t[2](r));return t?t[1]:(CAT[r.cat]?.img||photo('res_outils','assets/res-outils.jpg'))}
function cardHtml(r){const id=rid(r),fav=favoriteIds.has(id);return `<article class="resource-card"><img class="thumb" src="${imageFor(r)}" alt=""><div class="card-body"><h3>${esc(r.title)}</h3>${r.body?`<p>${esc(r.body)}</p>`:''}<div class="resource-actions"><button class="open-resource" data-id="${id}">Ouvrir</button><button class="favorite" data-fav="${id}" title="Ajouter aux favoris">${fav?'♥':'♡'}</button></div></div></article>`}
function attach(container){container.querySelectorAll('.open-resource').forEach(b=>b.onclick=()=>showResource(b.dataset.id));container.querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>{const id=b.dataset.fav;favoriteIds.has(id)?favoriteIds.delete(id):favoriteIds.add(id);saveFavs();b.textContent=favoriteIds.has(id)?'♥':'♡'})}
function showResource(id){const r=resources.find(x=>rid(x)===id);if(!r)return;document.getElementById('modalBody').innerHTML=`<img src="${imageFor(r)}" alt="" style="width:100%;height:220px;object-fit:cover;border-radius:12px"><h2>${esc(r.title)}</h2>${r.body?`<div class="fullbody">${esc(r.body)}</div>`:''}${r.url?`<p><a href="${r.url}" target="_blank" rel="noopener">Ouvrir la ressource ↗</a></p>`:''}`;document.getElementById('modal').classList.add('open')}
function renderTopics(){const box=document.getElementById('resourceTopics');box.innerHTML=topics.map((t,i)=>`<button class="topic-card" data-topic="${i}"><img src="${t[1]}" alt=""><div class="topic-label">${t[0]}</div></button>`).join('');box.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>openTopic(+b.dataset.topic));document.getElementById('resourceSection').classList.add('hidden')}
function openTopic(i){const [label,,fn]=topics[i],list=resources.filter(fn);document.getElementById('resourceTitle').textContent=label;const c=document.getElementById('resourceList');c.innerHTML=list.length?list.map(cardHtml).join(''):'<p>Aucune ressource dans cette rubrique.</p>';attach(c);document.getElementById('resourceSection').classList.remove('hidden');document.getElementById('resourceSection').scrollIntoView({behavior:'smooth',block:'start'})}
function openCategory(cat){switchView('resources');const pseudo=resources.filter(r=>r.cat===cat);document.getElementById('resourceTitle').textContent=CAT[cat].label;const c=document.getElementById('resourceList');c.innerHTML=pseudo.map(cardHtml).join('');attach(c);document.getElementById('resourceSection').classList.remove('hidden');setTimeout(()=>document.getElementById('resourceSection').scrollIntoView({behavior:'smooth'}),50)}
function renderFavorites(){const list=resources.filter(r=>favoriteIds.has(rid(r))),c=document.getElementById('favoriteList');c.innerHTML=list.length?list.map(cardHtml).join(''):'<p>Vous n’avez pas encore ajouté de favori.</p>';attach(c)}
const ideas={'Faire davantage bouger les élèves':['eps','enseignements','semaines'],'Réduire la sédentarité':['ressources','enseignements','amenager'],'Améliorer le bien-être':['ressources','viescolaire','personnels'],'Agir sur le climat scolaire':['viescolaire','pilotage'],'Aménager une salle de classe':['enseignements','amenager'],'Aménager les couloirs':['amenager'],'Aménager la cour':['amenager'],'Agir sur les écrans':['enseignements','evaluation','pilotage'],'Agir sur l’alimentation':['amenager'],'Mobiliser les personnels':['personnels','pilotage'],'Associer les parents':['semaines','pilotage'],'Organiser un temps fort':['semaines','eps'],'Évaluer mon action':['evaluation']};
function renderIdeas(){const g=document.getElementById('ideaButtons');g.innerHTML=Object.keys(ideas).map(x=>`<button data-idea="${esc(x)}">${esc(x)}</button>`).join('');g.querySelectorAll('button').forEach(b=>b.onclick=()=>{const cats=ideas[b.dataset.idea],c=document.getElementById('ideaResults');c.innerHTML=resources.filter(r=>cats.includes(r.cat)).map(cardHtml).join('');attach(c)})}
async function loadRemote(){const url=window.CAAP_CONFIG?.REMOTE_FEED_URL;if(!url)return;try{const res=await fetch(url,{cache:'no-store'}),data=await res.json(),arr=Array.isArray(data)?data:(data.resources||[]);resources=[...coreResources,...arr]}catch(e){}}
document.querySelectorAll('.nav-btn').forEach(b=>b.onclick=()=>switchView(b.dataset.view));document.querySelectorAll('[data-quick]').forEach(b=>b.onclick=()=>switchView(b.dataset.quick==='favorites'?'favorites':'ideas'));document.getElementById('closeTopic').onclick=()=>document.getElementById('resourceSection').classList.add('hidden');document.getElementById('modalClose').onclick=()=>document.getElementById('modal').classList.remove('open');document.getElementById('modal').onclick=e=>{if(e.target.id==='modal')e.currentTarget.classList.remove('open')};renderCategories();renderTopics();renderIdeas();loadRemote();if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
