// point d'entrée, initialisation de l'application

// un module va pouvoir utiliser un "objet" mis à disposition par un autre module grâce à l'insctruction import
// Ici, on indique que l'on veut importer l'"objet" apiBaseUrl défini dans le module config.js en vue de l'utiliser dans le module courant
import { apiBaseUrl } from "./config.js";
import { initLists, listenToClickOnAddListButton, listenToSubmitOnAddListForm, listenToSubmitListName, listenToListDeleteButtonSubmit, listenToDragOnList } from "./list.js";
import { listenToClickOnModalClosingElements } from "./utils.js";
import { listenToSubmitOnAddCardForm, listenToSubmitCardName, listenToCardDeleteButtonSubmit } from "./card.js";
import { listenToClickOnLabelButton, listenToSubmitOnLabelButton, listenToClickOnLabelEditButton, listenToSubmitOnEditLabelButton, initLabels } from "./label.js"

// Ton code JavaScript ici !
console.log(apiBaseUrl);

// --------------------------------------
// Lancement des fonctions d'event listening
// --------------------------------------
function listenToUserActions(){
  listenToClickOnAddListButton();
  listenToClickOnModalClosingElements();
  listenToSubmitOnAddListForm();
  listenToSubmitOnAddCardForm();
  listenToSubmitListName();
  listenToSubmitCardName();
  listenToCardDeleteButtonSubmit();
  listenToListDeleteButtonSubmit();
  listenToClickOnLabelButton();
  listenToSubmitOnLabelButton();
  listenToClickOnLabelEditButton();
  listenToSubmitOnEditLabelButton();
  listenToDragOnList();
  
}

// --------------------------------------
// Initialisation de l'application
// --------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  await initLists();
  await initLabels();
  listenToUserActions();
});
