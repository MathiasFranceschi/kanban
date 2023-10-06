/* eslint-disable no-alert */
/* eslint-disable no-use-before-define */
import { closeModals } from './utils';
import {
  createCard,
  updateCard,
  deleteCard,
  associateCardToLabel,
  unassociateCardOfLabel,
  getOneCard,
} from './api';

// --------------------------------------
// Event Listening (sélection d'élément et mise en écoute d'évènement)
// --------------------------------------

export function listenToSubmitOnAddCardForm() {
  const addCardFormElement = document.querySelector('#add-card-modal form');

  addCardFormElement.addEventListener('submit', handleAddCardFormSubmit);
}

export function listenToClickOnAddCardButton(listId) {
  const addCardButtonElement = document.querySelector(
    `#list-${listId} [slot='add-card-button']`,
  );
  addCardButtonElement.addEventListener('click', handleAddCardButtonClick);
}

function listenToCardEditButton(cardButton) {
  cardButton.addEventListener('click', handleEditCardButtonClick);
}

function listenToCardDeleteButton(cardDeleteButton) {
  cardDeleteButton.addEventListener('click', handleDeleteCardButtonClick);
}

export function listenToCardDeleteButtonSubmit() {
  const deleteCardFormElement = document.querySelector('#delete-card-modal');
  deleteCardFormElement.addEventListener(
    'submit',
    handleDeleteCardButtonSubmit,
  );
}

export function listenToSubmitCardName() {
  const editCardFormElement = document.querySelector('#edit-card-modal form');

  editCardFormElement.addEventListener('submit', handleSubmitModifyCardName);
}

// --------------------------------------
// Event Handler (écouteurs d'évènements)
// --------------------------------------

async function handleAddCardFormSubmit(event) {
  event.preventDefault();

  const addCardFormElement = document.querySelector('#add-card-modal form');

  const addCardFormData = new FormData(addCardFormElement);
  const cardToAdd = Object.fromEntries(addCardFormData);

  if (!cardToAdd.color) {
    cardToAdd.color = '#f0f';
  }
  const createdCard = await createCard(cardToAdd);
  if (createdCard) {
    addCardToList(createdCard);
    addCardFormElement.reset();
    closeModals();
  } else {
    alert('un problème est survenu lors de la création de la liste...');
  }
}

function handleEditCardButtonClick(event) {
  const clickedButtonElement = event.currentTarget;
  const listIdElement = clickedButtonElement.closest('[slot=card-id]');
  const idValue = listIdElement.id;
  const cardId = Number(idValue.substring(5));
  openEditCardModal(cardId);
}

function handleDeleteCardButtonClick(event) {
  const clickedButtonElement = event.currentTarget;
  const listIdElement = clickedButtonElement.closest('[slot=card-id]');
  const idValue = listIdElement.id;
  const cardId = Number(idValue.substring(5));
  opendeleteCardModal(cardId);
}

async function handleDeleteCardButtonSubmit(event) {
  event.preventDefault();
  const deleteCardModal = document.querySelector('#delete-card-modal form');
  const deleteModalFormData = new FormData(deleteCardModal);
  const modalToDelete = Object.fromEntries(deleteModalFormData);
  const cardId = modalToDelete.card_id;
  const cardDelete = await deleteCard(cardId);

  if (cardDelete) {
    deleteCardFromList(cardId);
    closeModals();
  } else {
    alert('un problème est survenu lors de la suppression de la liste...');
  }
}

function handleAddCardButtonClick(event) {
  const clickedButtonElement = event.currentTarget;
  const listIdElement = clickedButtonElement.closest('[slot=list-id]');
  const idValue = listIdElement.id;
  const listId = Number(idValue.substring(5));
  openAddCardModal(listId);
}

async function handleSubmitModifyCardName(event) {
  event.preventDefault();

  const editCardFormElement = document.querySelector('#edit-card-modal form');
  const editCardLabelFormElementoption = document.querySelector(
    '#edit-card-modal form select',
  );

  const editCardFormData = new FormData(editCardFormElement);
  const cardToEdit = Object.fromEntries(editCardFormData);
  const labelContainerElement = document.querySelector(
    `#card-${cardToEdit.card_id}`,
  );
  const labelContainerToAddElement = labelContainerElement.querySelector(
    "[slot='card-label']",
  );
  if (
    editCardLabelFormElementoption.value !== 'Choisissez un label !'
        && !labelContainerToAddElement.value
        && event.submitter.value === 'success'
  ) {
    const labelData = JSON.parse(editCardLabelFormElementoption.value);
    labelData.card_id = cardToEdit.card_id;
    const associateCard = await associateCardToLabel(labelData);
    if (associateCard) {
      addAssociatedLabelToCard(labelData, associateCard);
      editCardFormElement.reset();
      closeModals();
    } else {
      alert(
        'un problème est survenu lors de la modification de la liste...',
      );
    }
  }
  if (event.submitter.value === 'success') {
    const cardEdited = await updateCard(cardToEdit);
    if (cardEdited) {
      editCardName(cardEdited);
      editCardFormElement.reset();
      closeModals();
    } else {
      alert(
        'un problème est survenu lors de la modification de la liste...',
      );
    }
  }
  if (event.submitter.value === 'delete') {
    const card = await getOneCard(cardToEdit.card_id);
    const unassociate = { card_id: card.id, label_id: card.labels[0].id };
    const labelToUnassociate = await unassociateCardOfLabel(unassociate);
    if (labelToUnassociate) {
      removeAssociatedLabelFromCard(unassociate);
      editCardFormElement.reset();
      closeModals();
    } else {
      alert(
        "un problème est survenu lors de la modification de l'association...",
      );
    }
  }
}

// --------------------------------------
// DOM Modifier (modificateurs du DOM)
// --------------------------------------
function openAddCardModal(listId) {
  const addListModalElement = document.querySelector('#add-card-modal');
  addListModalElement.classList.add('is-active');
  const listIdFormInputElement = addListModalElement.querySelector("[name='list_id']");
  listIdFormInputElement.value = listId;
}

function openEditCardModal(cardId) {
  const editCardModalElement = document.querySelector('#edit-card-modal');
  editCardModalElement.classList.add('is-active');
  const cardIdFormInputElement = editCardModalElement.querySelector("[name='card_id']");
  cardIdFormInputElement.value = cardId;
}

function opendeleteCardModal(cardId) {
  const editCardModalElement = document.querySelector('#delete-card-modal');
  editCardModalElement.classList.add('is-active');
  const cardIdFormInputElement = editCardModalElement.querySelector("[name='card_id']");
  cardIdFormInputElement.value = cardId;
}

export function addCardToList(card) {
  const cardsContainerElement = document.querySelector(
    `#list-${card.list_id} [slot='list-content']`,
  );
  const cardTemplate = document.querySelector('#card-template');
  const cardTemplateContent = cardTemplate.content;
  const clonedCardTemplate = cardTemplateContent.cloneNode(true);
  const slotCardDescriptionElement = clonedCardTemplate.querySelector(
    "[slot='card-description']",
  );
  slotCardDescriptionElement.textContent = card.description;

  if (card.labels /* ?.[0] */) {
    // eslint-disable-next-line no-restricted-syntax
    for (const label of card.labels) {
      const templateCardLabel = document.querySelector(
        '#label-in-card-template',
      );
      const templateCardLabelContent = templateCardLabel.content;
      const clonedLabelTemplate = templateCardLabelContent.cloneNode(true);
      const slotOftemplateCardLabel = clonedLabelTemplate.querySelector(
        "[slot='label-in-card']",
      );

      const slotCardLabelElement = clonedCardTemplate.querySelector(
        "[slot='card-label']",
      );
      slotOftemplateCardLabel.textContent = label.name;
      slotOftemplateCardLabel.value = label.name;
      slotOftemplateCardLabel.style.backgroundColor = label.color;
      slotOftemplateCardLabel.classList.add(
        'card-header-title',
        'has-text-weight-medium',
        `label-${label.card_has_label.label_id}`,
        'label-style',
      );
      slotOftemplateCardLabel.setAttribute(
        'id',
        `label-${label.card_has_label.label_id}`,
      );
      slotCardLabelElement.append(clonedLabelTemplate);
    }
  }
  const slotCardIdElement = clonedCardTemplate.querySelector("[slot='card-id']");
  slotCardIdElement.setAttribute('id', `card-${card.id}`);
  const cardEditButton = clonedCardTemplate.querySelector(
    "[slot='edit-card-button']",
  );
  const cardDeleteButton = clonedCardTemplate.querySelector(
    "[slot='remove-card-button']",
  );
  cardsContainerElement.append(clonedCardTemplate);

  const cardContainerElementColor = document.querySelector(
    `#card-${card.id}`,
  );
  cardContainerElementColor.style.backgroundColor = card.color;
  listenToCardEditButton(cardEditButton);
  listenToCardDeleteButton(cardDeleteButton);
  listenToSubmitCardName();
}

function editCardName(cardName) {
  const cardContainerElement = document.querySelector(
    `#card-${cardName.id} [slot='card-description']`,
  );
  cardContainerElement.textContent = cardName.description;
  const cardContainerElementColor = document.querySelector(
    `#card-${cardName.id}`,
  );
  cardContainerElementColor.style.backgroundColor = cardName.color;
}

function deleteCardFromList(cardToDelete) {
  const cardContainerElement = document.querySelector(
    `#card-${cardToDelete}`,
  );
  cardContainerElement.remove();
}

function addAssociatedLabelToCard(cardToAssociate, cardReceived) {
  const labelContainerElement = document.querySelector(
    `#card-${cardToAssociate.card_id}`,
  );
  const labelContainerToAddElement = labelContainerElement.querySelector(
    "[slot='card-label']",
  );
  const div = document.createElement('div');

  div.textContent = cardToAssociate.name;
  div.classList.add(
    'card-header-title',
    'has-text-weight-medium',
    `label-${cardReceived.foundTag.id}`,
    'label-style',
  );
  div.classList.add('card-header-title', 'has-text-weight-medium');
  div.style.backgroundColor = cardReceived.foundTag.color;
  labelContainerToAddElement.append(div);
}

function removeAssociatedLabelFromCard(labelReceived) {
  const labelContainerElement = document.querySelector(
    `.label-${labelReceived.label_id}`,
  );

  labelContainerElement.remove();
}
