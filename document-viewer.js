const files = {
  "fiche-tasss.pdf": "TASSS",
  "fiche-systeme-feu.pdf": "SYSTÈME FEU",
  "fiche-phenomenes-thermiques.pdf": "PHÉNOMÈNES THERMIQUES",
  "fiche-gto-emv.pdf": "GTO ENGAGEMENT EN MILIEU VICIÉ",
  "fiche-parc-stationnement-couvert.pdf": "PARC DE STATIONNEMENT COUVERT",
  "fiche-techniques-respiration.pdf": "TECHNIQUES DE RESPIRATION",
  "fiche-techniques-lance.pdf": "TECHNIQUES DE LANCE",
  "fiche-missions.pdf": "MISSIONS",
  "fiche-composition.pdf": "COMPOSITION",
  "fiche-soiec.pdf": "SOIEC",
  "fiche-smes.pdf": "SMES",
  "fiche-equipement-epi.pdf": "EQUIPEMENT EPI",
  "fiche-lots-geld.pdf": "LOTS GELD",
  "fiche-ari-bi-bouteilles.pdf": "ARI BI BOUTEILLES",
  "fiche-rhinoevac.pdf": "RHINOEVAC",
  "fiche-camera-thermique.pdf": "CAMÉRA THERMIQUE",
  "fiche-camera-attaque.pdf": "CAMÉRA D'ATTAQUE",
  "fiche-halligan-tool.pdf": "HALLIGAN TOOL",
  "fiche-rideau-stop-fumees.pdf": "RIDEAU STOP FUMÉES",
  "fiche-batfan.pdf": "BATFAN",
  "fiche-spiraled.pdf": "SPIRALED",
  "fiche-cle-derivation.pdf": "CLÉ DE DÉRIVATION",
  "fiche-babouin.pdf": "BABOUIN",
  "fiche-fast-board.pdf": "FAST BOARD",
  "fiche-rit-pack.pdf": "RIT PACK",
  "fiche-securisation-point-penetration.pdf": "SÉCURISATION POINT DE PÉNÉTRATION",
  "fiche-balisage.pdf": "BALISAGE",
  "fiche-toxicite-fumees.pdf": "TOXICITÉ DES FUMÉES",
  "fiche-securisation-porte.pdf": "SÉCURISATION DE PORTE",
  "GUIDE-GELD.pdf": "GUIDE GELD",
  "GTO-Engagement-milieu-vicie.pdf": "GTO ENGAGEMENT EN MILIEU VICIÉ",
  "GTO-Sauvegarde-operationnelle.pdf": "GTO SAUVEGARDE OPÉRATIONNELLE",
  "RETEX-1.pdf": "RETEX 1",
  "RETEX-2.pdf": "RETEX 2",
  "Presentation-GELD.mp4": "PRESENTATION GELD",
  "Techniques-de-lance.mp4": "TECHNIQUES DE LANCE",
  "Rideau-stop-fumees.mp4": "RIDEAU STOP FUMÉES"
};
const name = new URLSearchParams(location.search).get("f");
const progress = document.querySelector("#loading");
const status = document.querySelector("#status");
const viewer = document.querySelector("#viewer");
const library = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/";

function showError() {
  progress.hidden = true;
  status.textContent = "Le document n’a pas pu être affiché.";
  if (Object.hasOwn(files, name)) {
    const link = document.createElement("a");
    link.href = name;
    link.textContent = "Ouvrir le fichier";
    status.append(" ", link);
  }
}

async function displayPdf() {
  const pdfjs = await import(library + "legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = library + "legacy/build/pdf.worker.mjs";
  const pdf = await pdfjs.getDocument({
    url: name,
    cMapUrl: library + "cmaps/",
    cMapPacked: true,
    standardFontDataUrl: library + "standard_fonts/",
    isEvalSupported: false,
  }).promise;
  for (let number = 1; number <= pdf.numPages; number++) {
    const page = await pdf.getPage(number);
    const naturalWidth = page.getViewport({scale: 1}).width;
    const viewport = page.getViewport({scale: viewer.clientWidth / naturalWidth});
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width * ratio);
    canvas.height = Math.ceil(viewport.height * ratio);
    canvas.setAttribute("aria-label", `Page ${number} sur ${pdf.numPages}`);
    await page.render({
      canvasContext: canvas.getContext("2d"),
      viewport,
      transform: [ratio, 0, 0, ratio, 0, 0],
    }).promise;
    viewer.append(canvas);
    progress.hidden = true;
  }
}

if (!Object.hasOwn(files, name)) {
  showError();
} else {
  document.title = files[name] + " · Portail GELD";
  if (name.endsWith(".mp4")) {
    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.preload = "auto";
    video.autoplay = true;
    video.addEventListener("loadedmetadata", () => { progress.hidden = true; }, {once: true});
    video.addEventListener("error", showError, {once: true});
    video.src = name;
    viewer.append(video);
    video.play().catch(error => {
      if (error.name !== "NotAllowedError") return;
      video.muted = true;
      video.play().catch(() => {});
    });
  } else {
    displayPdf().catch(showError);
  }
}

