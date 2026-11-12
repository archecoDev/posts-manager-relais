// Relais de retour de Posts Manager (connexion Meta) : Meta n'enregistre que des adresses de retour en https, alors que Posts Manager tourne en http sur l'ordinateur de la personne.
// Cette page (https) reçoit le retour de Meta et renvoie le navigateur, tout de suite, vers Posts Manager sur CE MÊME ordinateur : http://localhost:<port>/connexion/retour.
// Elle ne stocke rien, ne contacte rien, n'a aucun script tiers : le code d'autorisation ne fait que passer dans l'adresse. Sans la clé secrète de l'application de la personne, ce code ne sert à rien.
// Ne renvoie QUE vers localhost, sur le chemin /connexion/retour, avec le port lu au début du paramètre « state » (« <port>.<aléatoire> », posé par Posts Manager). Jamais vers un autre hôte.
(function (g) {
  const PORT_MIN = 1024, PORT_MAX = 65535, CLES = ["code", "state", "error", "error_reason", "error_description", "error_code", "error_message"];
  // Rend l'adresse locale vers laquelle renvoyer, ou null si le retour n'a pas la forme attendue. Pure : testée sans navigateur (tests/relais.test.mjs de Posts Manager).
  function cibleLocale(search) {
    const p = new URLSearchParams(String(search || "")), m = /^(\d{4,5})\.[A-Za-z0-9_-]{16,128}$/.exec(p.get("state") || "");
    if (!m) return null;
    const port = Number(m[1]); if (!Number.isInteger(port) || port < PORT_MIN || port > PORT_MAX) return null;
    const garde = new URLSearchParams();
    for (const k of CLES) if (p.has(k)) garde.set(k, String(p.get(k)).slice(0, 2000));
    return `http://localhost:${port}/connexion/retour?${garde.toString()}`;
  }
  g.cibleLocale = cibleLocale;
  if (typeof document === "undefined" || typeof location === "undefined") return;
  const TXT = {
    fr: { ok: "Retour vers Posts Manager sur ton ordinateur… Si rien ne s'ouvre, Posts Manager n'est pas lancé : lance-le puis recommence la connexion.", ko: "Retour inattendu : cette page ne sert qu'à Posts Manager. Tu peux la fermer." },
    en: { ok: "Going back to Posts Manager on your computer… If nothing opens, Posts Manager is not running: start it, then try connecting again.", ko: "Unexpected return: this page is only used by Posts Manager. You can close it." },
    ja: { ok: "お使いのパソコンのPosts Managerに戻ります…何も開かない場合はPosts Managerが起動していません。起動してからもう一度接続してください。", ko: "想定外のアクセスです。このページはPosts Manager専用です。閉じて構いません。" },
  };
  const lang = ["fr", "en", "ja"].find(l => (navigator.language || "").toLowerCase().startsWith(l)) || "fr", cible = cibleLocale(location.search);
  document.documentElement.lang = lang; document.getElementById("msg").textContent = TXT[lang][cible ? "ok" : "ko"];
  if (cible) location.replace(cible);          // replace : l'adresse qui porte le code ne reste pas dans l'historique
})(typeof globalThis !== "undefined" ? globalThis : this);
