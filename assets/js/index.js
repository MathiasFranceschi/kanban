import {
  initLists, listenToClickOnAddListButton, listenToSubmitOnAddListForm, listenToSubmitListName,
  listenToListDeleteButtonSubmit, listenToDragOnList,
} from './list';
import { listenToClickOnModalClosingElements } from './utils';
import { listenToSubmitOnAddCardForm, listenToSubmitCardName, listenToCardDeleteButtonSubmit } from './card';
import {
  listenToClickOnLabelButton, listenToSubmitOnLabelButton, listenToClickOnLabelEditButton,
  listenToSubmitOnEditLabelButton, initLabels,
} from './label';

// --------------------------------------
// Lancement des fonctions d'event listening
// --------------------------------------
function listenToUserActions() {
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
