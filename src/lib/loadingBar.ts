/** clé de session : la barre de chargement ne passe qu'à la première visite */
export const LOADING_BAR_KEY = "post:loaded";

/** à placer dans <head> : masque la barre avant le premier rendu si elle
 *  n'a pas lieu d'être (déjà vue dans la session, ou portfolio /kamil-grimes) */
export const LOADING_BAR_SCRIPT = `try{if(sessionStorage.getItem("${LOADING_BAR_KEY}")||location.pathname.indexOf("/kamil-grimes")===0)document.documentElement.dataset.pl="done"}catch(e){}`;
