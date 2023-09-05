// fonction communes - par exemple la fermeture de l'ensemble des modales

// --------------------------------------
// Event Listening (sélection d'élément et mise en écoute d'évènement)
// --------------------------------------
export function listenToClickOnModalClosingElements(){
  // récupérer les boutons concernés
  const closeElementList = document.querySelectorAll('.modal .close, .modal .modal-background');

  // associer un écouteur d'évènement
  closeElementList.forEach((closeElement) => {
    closeElement.addEventListener('click', handleCloseModalClick);
  });
}

// --------------------------------------
// Event Handler (écouteurs d'évènements)
// --------------------------------------

export function handleCloseModalClick(){
  closeModals();
}

// --------------------------------------
// DOM Modifier (modificateurs du DOM)
// --------------------------------------
export function closeModals(){
  const modalElementList = document.querySelectorAll('.modal');

  modalElementList.forEach((modalElement) => {
    modalElement.classList.remove('is-active');
  });
}
