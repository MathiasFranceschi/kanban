/* eslint-disable no-await-in-loop */
/* eslint-disable no-alert */
/* eslint-disable no-use-before-define */
import Sortable from 'sortablejs';
import { closeModals } from './utils';
import { listenToClickOnAddCardButton, addCardToList } from './card';
import {
  getLists, createList, updateList, deleteList, updateCard,
} from './api';

// --------------------------------------
// Event Listening (sélection d'élément et mise en écoute d'évènement)
// --------------------------------------
export function listenToClickOnAddListButton() {
  const addListButtonElement = document.querySelector('#addlist-button');
  addListButtonElement.addEventListener('click', handleAddListButtonClick);
}

export function listenToSubmitOnAddListForm() {
  const addListFormElement = document.querySelector('#add-list-modal form');
  addListFormElement.addEventListener('submit', handleAddListFormSubmit);
}

function listenToListName(listName) {
  listName.addEventListener('click', handleEditListButtonClick);
}

function listenToListDeleteButtonClick(list) {
  list.addEventListener('click', handleDeleteListButtonClick);
}

export function listenToListDeleteButtonSubmit() {
  const deleteListFormElement = document.querySelector(
    '#delete-list-modal form',
  );

  deleteListFormElement.addEventListener('submit', handleSubmitDeleteList);
}

export function listenToSubmitListName() {
  const editListFormElement = document.querySelector('#edit-list-modal form');
  editListFormElement.addEventListener('submit', handleSubmitModifyListName);
}

export function listenToDragOnList() {
  const listsContainerElement = document.querySelector('#lists-container');
  Sortable.create(listsContainerElement, {
    animation: 250,
    handle: '.message-header',
    onEnd: handleListDragEnd,
  });
}

// --------------------------------------
// Event Handler (écouteurs d'évènements)
// --------------------------------------
function handleAddListButtonClick() {
  openAddListModal();
}

function handleEditListButtonClick(event) {
  const clickedButtonElement = event.currentTarget;
  const listIdElement = clickedButtonElement.closest('[slot=list-id]');
  const idValue = listIdElement.id;
  const listId = Number(idValue.substring(5));
  openEditListModal(listId);
}

function handleDeleteListButtonClick(event) {
  const clickedButtonElement = event.currentTarget;
  const listIdElement = clickedButtonElement.closest('[slot=list-id]');
  const idValue = listIdElement.id;
  const listId = Number(idValue.substring(5));
  opendeleteListModal(listId);
}

async function handleAddListFormSubmit(event) {
  event.preventDefault();
  const addListFormElement = document.querySelector('#add-list-modal form');
  const addListFormData = new FormData(addListFormElement);
  const listToAdd = Object.fromEntries(addListFormData);
  const newList = await createList(listToAdd);

  if (newList) {
    addListToListsContainer(newList);

    addListFormElement.reset();
    closeModals();
    orderLists();
  } else {
    alert('un problème est survenu lors de la création de la liste...');
  }
}

async function handleSubmitModifyListName(event) {
  event.preventDefault();

  const editListFormElement = document.querySelector('#edit-list-modal form');

  const editListFormData = new FormData(editListFormElement);
  const listToEdit = Object.fromEntries(editListFormData);
  const listEdited = await updateList(listToEdit);
  if (listEdited) {
    editListName(listEdited);
    editListFormElement.reset();
    closeModals();
  } else {
    alert('un problème est survenu lors de la modification de la liste...');
  }
}

async function handleSubmitDeleteList(event) {
  event.preventDefault();
  const deleteCardModalElement = document.querySelector(
    '#delete-list-modal form',
  );
  const deleteListModalFormData = new FormData(deleteCardModalElement);
  const modalListToDelete = Object.fromEntries(deleteListModalFormData);
  const listId = modalListToDelete.list_id;
  const listDelete = await deleteList(listId);

  if (listDelete) {
    deleteListFrom(listId);

    closeModals();
  } else {
    alert('un problème est survenu lors de la modification de la liste...');
  }
}

async function handleListDragEnd() {
  orderLists();
}

// --------------------------------------
// DOM Modifier (modificateurs du DOM)
// --------------------------------------
export async function initLists() {
  const lists = await getLists();
  lists.forEach((list) => {
    addListToListsContainer(list);
  });
}

function opendeleteListModal(listId) {
  const deleteListModalElement = document.querySelector('#delete-list-modal');
  deleteListModalElement.classList.add('is-active');
  const listIdFormInputElement = deleteListModalElement.querySelector("[name='list_id']");
  listIdFormInputElement.value = listId;
}

function openAddListModal() {
  const addListModalElement = document.querySelector('#add-list-modal');
  addListModalElement.classList.add('is-active');
}

function openEditListModal(listId) {
  const editListModalElement = document.querySelector('#edit-list-modal');
  editListModalElement.classList.add('is-active');
  const listIdFormInputElement = editListModalElement.querySelector("[name='label_id']");
  listIdFormInputElement.value = listId;
}

function addListToListsContainer(list) {
  const listTemplate = document.querySelector('#list-template');
  const listTemplateContent = listTemplate.content;
  const clonedListTemplate = listTemplateContent.cloneNode(true);
  const clonedListElement = clonedListTemplate.querySelector('.list');
  const slotListNameElement = clonedListTemplate.querySelector("[slot='list-name']");
  slotListNameElement.textContent = list.name;
  const slotListIdElement = clonedListTemplate.querySelector("[slot='list-id']");
  slotListIdElement.setAttribute('id', `list-${list.id}`);
  const listsContainerElement = document.querySelector('#lists-container');
  const listTextName = clonedListTemplate.querySelector("[slot='list-name']");
  const listDeleteButton = clonedListTemplate.querySelector(
    "[slot='remove-list-button']",
  );

  listenToListDeleteButtonClick(listDeleteButton);
  listsContainerElement.append(clonedListTemplate);
  listenToListName(listTextName);
  listenToClickOnAddCardButton(list.id);
  if (list.cards) {
    list.cards.forEach((card) => {
      addCardToList(card);
    });
  }

  const cardsContainerElement = clonedListElement.querySelector(
    '.message-body',
  );
  Sortable.create(cardsContainerElement, {
    animation: 250,
    group: 'cards',
    onEnd: (event) => {
      orderCards(event.to);
      if (event.from !== event.to) {
        orderCards(event.from);
      }
    },
  });
}

async function orderLists() {
  const listElementList = document.querySelectorAll('.list');
  let position = 1;

  // eslint-disable-next-line no-restricted-syntax
  for (const listElement of listElementList) {
    const idListElement = listElement.id;
    const listId = idListElement.substring(5);
    const listIdObject = {
      list_id: listId,
      position,
    };
    const updatedList = await updateList(listIdObject);

    if (!updatedList) {
      alert('Un problème est survenu lors du réordonnement des listes');
      break;
    }

    position = +1;
  }
}

export async function orderCards(cardContainer) {
  const cardElementList = cardContainer.querySelectorAll('.card');
  const listElement = cardContainer.closest('.list');
  const idListElement = listElement.id;
  const listId = idListElement.substring(5);

  let position = 1;

  // eslint-disable-next-line no-restricted-syntax
  for (const cardElement of cardElementList) {
    const idCard = cardElement.id;
    const cardId = idCard.substring(5);
    const cardIdObject = { card_id: cardId, position, list_id: listId };
    const updatedCard = await updateCard(cardIdObject);
    if (!updatedCard) {
      alert('Un problème est survenu lors du réordonnement des listes');
      break;
    }

    position = +1;
  }
}

function editListName(listName) {
  const listContainerElement = document.querySelector(
    `#list-${listName.id} [slot='list-name']`,
  );
  listContainerElement.textContent = listName.name;
}

function deleteListFrom(listToDelete) {
  const listContainerElement = document.querySelector(
    `#list-${listToDelete}`,
  );
  listContainerElement.remove();
}
