/**
 * FLUX GOOGLE DRIVE POUR LA PWA "COLLÈGE ACTIF, AVENIR POSITIF"
 * 1) Créez dans Google Drive un dossier principal et des sous-dossiers portant les noms ci-dessous.
 * 2) Collez l'ID du dossier principal dans ROOT_FOLDER_ID.
 * 3) Déployez ce script comme "Application web" : exécuter en tant que vous, accès "Toute personne disposant du lien".
 * 4) Copiez l'URL se terminant par /exec dans config.js -> REMOTE_FEED_URL.
 * Ensuite, déposer un fichier dans un sous-dossier suffit : il apparaît automatiquement dans la PWA.
 */
const ROOT_FOLDER_ID = 'COLLEZ_ICI_ID_DU_DOSSIER_DRIVE';
const CATEGORY_BY_FOLDER = {
  'Le projet':'projet',
  'Ressources & comprendre':'ressources',
  'Agir dans les enseignements':'enseignements',
  'Aménager l’établissement':'amenager',
  'Vie scolaire & climat scolaire':'viescolaire',
  'EPS & activité physique':'eps',
  'Semaines & temps forts':'semaines',
  'Personnels':'personnels',
  'Pilotage & communication':'pilotage',
  'Évaluer':'evaluation'
};
function doGet(){
  const root=DriveApp.getFolderById(ROOT_FOLDER_ID); const out=[]; const folders=root.getFolders();
  while(folders.hasNext()){
    const folder=folders.next(); const cat=CATEGORY_BY_FOLDER[folder.getName()] || 'ressources'; const files=folder.getFiles();
    while(files.hasNext()){
      const f=files.next();
      out.push({cat:cat,title:f.getName(),type:typeFor_(f.getMimeType()),body:'Document ajouté depuis Google Drive',source:'Google Drive',url:f.getUrl(),modified:f.getLastUpdated().toISOString()});
    }
  }
  return ContentService.createTextOutput(JSON.stringify({resources:out})).setMimeType(ContentService.MimeType.JSON);
}
function typeFor_(mime){
  if(mime==='application/pdf')return 'pdf';
  if(mime.indexOf('video/')===0)return 'video';
  if(mime.indexOf('image/')===0)return 'image';
  return 'document';
}
