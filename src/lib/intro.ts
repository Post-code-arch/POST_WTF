/** clé de session : l'intro ne se joue qu'à la première visite */
export const INTRO_KEY = "post:intro";

/** à placer dans <head> : masque l'intro avant le premier rendu si elle n'a
 *  pas lieu d'être (déjà vue dans la session, ou portfolio /kamil-grimes) */
export const INTRO_SCRIPT = `try{if(sessionStorage.getItem("${INTRO_KEY}")||location.pathname.indexOf("/kamil-grimes")===0)document.documentElement.dataset.intro="done"}catch(e){}`;
