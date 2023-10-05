import { closeModals } from './utils.js';
import {
  createLabel, getLabels, updateLabel, deleteLabel,
} from './api.js';

// --------------------------------------
// Event Listening (sélection d'élément et mise en écoute d'évènement)
// --------------------------------------
export function listenToClickOnLabelButton() {
  const addLabelButtonElement = document.querySelector('#addlabel-button');
  addLabelButtonElement.addEventListener('click', handleAddListButtonClick);
}

export function listenToSubmitOnLabelButton() {
  const addLabelButtonElementModal = document.querySelector(
    '#add-label-modal form',
  );
  addLabelButtonElementModal.addEventListener(
    'submit',
    handleAddLabelFormSubmit,
  );
}

export function listenToClickOnLabelEditButton() {
  const editLabelButtonElement = document.querySelector('#editlabel-button');
  editLabelButtonElement.addEventListener('click', handleEditListButtonClick);
}

export function listenToSubmitOnEditLabelButton() {
  const editLabelButtonElementModal = document.querySelector(
    '#edit-label-modal form',
  );
  editLabelButtonElementModal.addEventListener(
    'submit',
    handleEditLabelFormSubmit,
  );
}

// --------------------------------------
// Event Handler (écouteurs d'évènements)
// --------------------------------------

function handleAddListButtonClick() {
  openAddLabelModal();
}

function handleEditListButtonClick() {
  openEditLabelModal();
}

export async function initLabels() {
  const labels = await getLabels();
  labels.forEach((label) => {
    addLabelToTemplateLabelModal(label);
  });
}

async function handleAddLabelFormSubmit(event) {
  event.preventDefault();
  const addLabelFormElement = document.querySelector('#add-label-modal form');
  const addLabelFormData = new FormData(addLabelFormElement);
  const labelToAdd = Object.fromEntries(addLabelFormData);
  const newLabel = await createLabel(labelToAdd);

  if (newLabel) {
    addLabelToTemplateLabelModal(newLabel);
    addLabelFormElement.reset();
    closeModals();
  } else {
    alert('un problème est survenu lors de la création de la liste...');
  }
}

async function handleEditLabelFormSubmit(event) {
  event.preventDefault();
  const editLabelFormElementoption = document.querySelector(
    '#edit-label-modal form select',
  );

  const editLabelFormElement = document.querySelector(
    '#edit-label-modal form',
  );
  const labelData = JSON.parse(editLabelFormElementoption.value);
  const formData = new FormData(editLabelFormElement);
  const labelUpdate = Object.fromEntries(formData);
  labelUpdate.id = labelData.id;
  if (event.submitter.value === 'delete') {
    const deletedLabel = await deleteLabel(labelUpdate);
    if (deletedLabel) {
      removeLabelFromDom(labelUpdate);
      deleteLabelFromCards(labelUpdate);
      editLabelFormElement.reset();
      closeModals();
    } else {
      alert('un problème est survenu lors de la création de la liste...');
    }
  } else {
    const editedLabel = await updateLabel(labelUpdate);

    if (editedLabel) {
      changeColorOfLabelEdited(editedLabel);
      removeLabelFromDom(editedLabel);
      addLabelToTemplateLabelModal(editedLabel);
      editLabelFormElement.reset();
      closeModals();
    } else {
      alert('un problème est survenu lors de la création de la liste...');
    }
  }
}
// --------------------------------------
// DOM Modifier (modificateurs du DOM)
// --------------------------------------

function openAddLabelModal() {
  const addListModalElement = document.querySelector('#add-label-modal');
  addListModalElement.classList.add('is-active');
}

function openEditLabelModal() {
  const editListModalElement = document.querySelector('#edit-label-modal');
  editListModalElement.classList.add('is-active');
}

export async function addLabelToTemplateLabelModal(label) {
  const modalFormSelectLabel = document.querySelectorAll('.select-label');
  (modalFormSelectLabel).forEach((element) => {
    const labelTemplate = document.querySelector('#label-template');
    const labelTemplateContent = labelTemplate.content;
    const clonedLabelTemplate = labelTemplateContent.cloneNode(true);
    const slotOptionElement = clonedLabelTemplate.querySelector(
      "[slot='label-option']",
    );
    slotOptionElement.setAttribute('id', `label-${label.id}`);
    slotOptionElement.textContent = label.name;
    slotOptionElement.value = `{ "name": "${label.name}", "id": "${label.id}" }`;
    element.append(clonedLabelTemplate);
  });
}

function removeLabelFromDom(label) {
  const removeLabelFromModal = document.querySelectorAll(`#label-${label.id}`);
  removeLabelFromModal.forEach((element) => {
    element.remove();
  });
}

function changeColorOfLabelEdited(label) {
  const labelsElement = document.querySelectorAll(`.label-${label.id}`);
  labelsElement.forEach((labelOfCard) => {
    labelOfCard.style.backgroundColor = label.color;
    labelOfCard.textContent = label.name;
  });
}

function deleteLabelFromCards(label) {
  const labelsElement = document.querySelectorAll(`.label-${label.id}`);
  labelsElement.forEach((labelOfCard) => {
    labelOfCard.remove();
  });
}
