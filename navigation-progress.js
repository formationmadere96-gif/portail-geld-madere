const progress = document.createElement("div");
progress.className = "navigation-progress";
progress.setAttribute("aria-hidden", "true");
progress.hidden = true;
document.body.prepend(progress);

let resetTimer;
function clearProgress() {
  clearTimeout(resetTimer);
  progress.hidden = true;
}

window.addEventListener("pageshow", clearProgress);
document.addEventListener("click", event => {
  if (event.defaultPrevented || event.button !== 0) return;
  const link = event.target.closest?.("a[href]");
  if (!link || !["http:", "https:"].includes(link.protocol)) return;
  const destination = new URL(link.href);
  const current = new URL(location.href);
  if (destination.pathname === current.pathname && destination.origin === current.origin &&
      destination.search === current.search && destination.hash) return;

  const opensSeparately = link.target === "_blank" || link.hasAttribute("download") ||
    event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  clearTimeout(resetTimer);
  progress.hidden = false;
  resetTimer = setTimeout(clearProgress, opensSeparately ? 1200 : 10000);
});
