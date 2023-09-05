// ensemble de fonction permettant la gestion des cartes
import { closeModals } from "./utils.js";
import {
    createCard,
    updateCard,
    deleteCard,
    associateCardToLabel,
    unassociateCardOfLabel,
} from "./api.js";

// --------------------------------------
// Event Listening (sélection d'élément et mise en écoute d'évènement)
// --------------------------------------

export function listenToSubmitOnAddCardForm() {
    const addCardFormElement = document.querySelector("#add-card-modal form");

    addCardFormElement.addEventListener("submit", handleAddCardFormSubmit);
}

export function listenToClickOnAddCardButton(listId) {
    // je récupère le bouton + de la liste,
    const addCardButtonElement = document.querySelector(
        `#list-${listId} [slot='add-card-button']`
    );

    // on associe l'écouteur d'évènement au click sur ce bouton
    addCardButtonElement.addEventListener("click", handleAddCardButtonClick);
}

function listenToCardEditButton(cardButton) {
    cardButton.addEventListener("click", handleEditCardButtonClick);
}

function listenToCardDeleteButton(cardDeleteButton) {
    cardDeleteButton.addEventListener("click", handleDeleteCardButtonClick);
}

export function listenToCardDeleteButtonSubmit() {
    const deleteCardFormElement = document.querySelector("#delete-card-modal");
    deleteCardFormElement.addEventListener(
        "submit",
        handleDeleteCardButtonSubmit
    );
}

export function listenToSubmitCardName() {
    const editCardFormElement = document.querySelector("#edit-card-modal form");

    editCardFormElement.addEventListener("submit", handleSubmitModifyCardName);
}

// --------------------------------------
// Event Handler (écouteurs d'évènements)
// --------------------------------------

async function handleAddCardFormSubmit(event) {
    event.preventDefault();

    const addCardFormElement = document.querySelector("#add-card-modal form");

    const addCardFormData = new FormData(addCardFormElement);
    const cardToAdd = Object.fromEntries(addCardFormData);

    if (!cardToAdd.color) {
        cardToAdd.color = "#f0f";
    }
    const createdCard = await createCard(cardToAdd);
    if (createdCard) {
        addCardToList(createdCard);
        // on réinitialise le formulaire
        addCardFormElement.reset();
        // on ferme les modales
        closeModals();
    } else {
        alert("un problème est survenu lors de la création de la liste...");
    }
}

function handleEditCardButtonClick(event) {
    ///////////////////////////
    const clickedButtonElement = event.currentTarget;
    const listIdElement = clickedButtonElement.closest("[slot=card-id]");
    const idValue = listIdElement.id;
    const cardId = Number(idValue.substring(5));
    // on demande l'affichage de la modal en précisant à quelle liste elle permet d'ajouter une carte
    openEditCardModal(cardId);
}

function handleDeleteCardButtonClick(event) {
    ///////////////////////////
    const clickedButtonElement = event.currentTarget;
    const listIdElement = clickedButtonElement.closest("[slot=card-id]");
    const idValue = listIdElement.id;
    const cardId = Number(idValue.substring(5));
    console.log(cardId);
    // on demande l'affichage de la modal en précisant à quelle liste elle permet d'ajouter une carte
    opendeleteCardModal(cardId);
}

async function handleDeleteCardButtonSubmit(event) {
    event.preventDefault();

    // on récupère la modale de suppression avec la valeur de la carte juste créer dans l'input caché du formulaire
    const deleteCardModal = document.querySelector("#delete-card-modal form");
    // on récupère les données cachées du form
    const deleteModalFormData = new FormData(deleteCardModal);
    const modalToDelete = Object.fromEntries(deleteModalFormData);

    const cardId = modalToDelete.card_id;
    // on delete avec les données trouvées
    const cardDelete = await deleteCard(cardId);

    if (cardDelete) {
        // on supprime la carte
        deleteCardFromList(cardId);

        // on ferme les modales
        closeModals();
    } else {
        alert("un problème est survenu lors de la suppression de la liste...");
    }
}

function handleAddCardButtonClick(event) {
    // on récupère l'id de la liste pour laquelle on veut créer une carte
    const clickedButtonElement = event.currentTarget;
    const listIdElement = clickedButtonElement.closest("[slot=list-id]");
    const idValue = listIdElement.id;
    const listId = Number(idValue.substring(5));
    // on demande l'affichage de la modal en précisant à quelle liste elle permet d'ajouter une carte
    openAddCardModal(listId);
}

async function handleSubmitModifyCardName(event) {
    /////////////////
    event.preventDefault();

    const editCardFormElement = document.querySelector("#edit-card-modal form");
    const editCardLabelFormElementoption = document.querySelector(
        "#edit-card-modal form select"
    );
    const editCardFormData = new FormData(editCardFormElement);
    const cardToEdit = Object.fromEntries(editCardFormData);
    const labelContainerElement = document.querySelector(
        `#card-${cardToEdit.card_id}`
    );
    const labelContainerToAddElement = labelContainerElement.querySelector(
        "[slot='card-label']"
    );
    const labelData = JSON.parse(editCardLabelFormElementoption.value);
    labelData.card_id = cardToEdit.card_id;
    const associateCard = await associateCardToLabel(labelData);
    if (
        editCardLabelFormElementoption.value !== "Choisissez un label !" &&
        !labelContainerToAddElement.value &&
        event.submitter.value === "success"
    ) {
        if (associateCard) {
            // on met à jour l'interface utilisateur avec les données retournée par l'API
            // Créer ou récupérer une fonction pour ajouter l'association sur le dom directement, finir la 'désassociation" de carte
            addAssociatedLabelToCard(labelData, associateCard);
            // on réinitialise le formulaire
            //addCardToList(associateCard);
            editCardFormElement.reset();
            // on ferme les modales
            closeModals();
        } else {
            alert(
                "un problème est survenu lors de la modification de la liste..."
            );
        }
    }
    if (event.submitter.value === "success") {
        const cardEdited = await updateCard(cardToEdit);
        if (cardEdited) {
            // on met à jour l'interface utilisateur avec les données retournée par l'API
            editCardName(cardEdited);

            // on réinitialise le formulaire
            editCardFormElement.reset();
            // on ferme les modales
            closeModals();
        } else {
            alert(
                "un problème est survenu lors de la modification de la liste..."
            );
        }
    }
    if (event.submitter.value === "delete") {
        const labelToUnassociate = await unassociateCardOfLabel(associateCard);
        if (labelToUnassociate) {
            // on met à jour l'interface utilisateur avec les données retournée par l'API
            // Créer ou récupérer une fonction pour ajouter l'association sur le dom directement, finir la 'désassociation" de carte
            removeAssociatedLabelFromCard(associateCard);
            // on réinitialise le formulaire
            //addCardToList(associateCard);
            editCardFormElement.reset();
            // on ferme les modales
            closeModals();
        } else {
            alert(
                "un problème est survenu lors de la modification de l'association..."
            );
        }
    }
}

// --------------------------------------
// DOM Modifier (modificateurs du DOM)
// --------------------------------------
function openAddCardModal(listId) {
    // on affiche la modale
    const addListModalElement = document.querySelector("#add-card-modal");
    addListModalElement.classList.add("is-active");

    // on indique l'identifiant de la liste dans le champ caché du formulaire
    const listIdFormInputElement =
        addListModalElement.querySelector("[name='list_id']");
    listIdFormInputElement.value = listId;
}

function openEditCardModal(cardId) {
    // on sélectionne l'élément que l'on souhaite modifie
    const editCardModalElement = document.querySelector("#edit-card-modal");
    // on le modifie
    editCardModalElement.classList.add("is-active");
    const cardIdFormInputElement =
        editCardModalElement.querySelector("[name='card_id']");
    cardIdFormInputElement.value = cardId;
    // rajouter dans la modale, un select option pour associer un label ou le supprimer
}

function opendeleteCardModal(cardId) {
    const editCardModalElement = document.querySelector("#delete-card-modal");
    editCardModalElement.classList.add("is-active");
    const cardIdFormInputElement =
        editCardModalElement.querySelector("[name='card_id']");
    cardIdFormInputElement.value = cardId;
}

export function addCardToList(card) {
    // on récupère l'emplacement où insérer la carte
    const cardsContainerElement = document.querySelector(
        `#list-${card.list_id} [slot='list-content']`
    );
    // on récupèrele template
    const cardTemplate = document.querySelector("#card-template");
    // on accède à son contenu
    const cardTemplateContent = cardTemplate.content;
    // on en crée une copie
    const clonedCardTemplate = cardTemplateContent.cloneNode(true);
    // on modifie le template avec les infos de la carte à créer
    // description de la carte :
    const slotCardDescriptionElement = clonedCardTemplate.querySelector(
        "[slot='card-description']"
    );
    // ajout de la description à la carte
    slotCardDescriptionElement.textContent = card.description;

    //  séléction du label et insertion de son contenu au dom
    if (card.labels /* ?.[0] */) {
        for (const label of card.labels) {
            const templateCardLabel = document.querySelector(
                "#label-in-card-template"
            );
            const templateCardLabelContent = templateCardLabel.content;
            const clonedLabelTemplate =
                templateCardLabelContent.cloneNode(true);
            const slotOftemplateCardLabel = clonedLabelTemplate.querySelector(
                "[slot='label-in-card']"
            );

            const slotCardLabelElement = clonedCardTemplate.querySelector(
                "[slot='card-label']"
            );
            slotOftemplateCardLabel.textContent = label.name;
            slotOftemplateCardLabel.value = label.name;
            slotOftemplateCardLabel.style.backgroundColor = label.color;
            //slotOftemplateCardLabel.setAttribute('id', `label-${label.card_has_label.label_id}`);
            slotOftemplateCardLabel.classList.add(
                "card-header-title",
                "has-text-weight-medium",
                `label-${label.card_has_label.label_id}`
            );
            slotCardLabelElement.append(clonedLabelTemplate);
        }
    }
    // séléction id de la carte :
    const slotCardIdElement =
        clonedCardTemplate.querySelector("[slot='card-id']");
    // attribution id
    slotCardIdElement.setAttribute("id", `card-${card.id}`);
    // sélection edit card button
    const cardEditButton = clonedCardTemplate.querySelector(
        "[slot='edit-card-button']"
    );
    // sélection remove card button
    const cardDeleteButton = clonedCardTemplate.querySelector(
        "[slot='remove-card-button']"
    );
    // on ajoute la copie du template
    cardsContainerElement.append(clonedCardTemplate);

    const cardContainerElementColor = document.querySelector(
        `#card-${card.id}`
    );
    // sélection carte entière
    cardContainerElementColor.style.backgroundColor = card.color;
    // changement couleur de la carte
    listenToCardEditButton(cardEditButton);
    listenToCardDeleteButton(cardDeleteButton);
    /* listenToCardDeleteButtonSubmit();
  listenToSubmitCardName(); */
}

function editCardName(cardName) {
    ////////////:
    const cardContainerElement = document.querySelector(
        `#card-${cardName.id} [slot='card-description']`
    );
    cardContainerElement.textContent = cardName.description;
    const cardContainerElementColor = document.querySelector(
        `#card-${cardName.id}`
    );
    cardContainerElementColor.style.backgroundColor = cardName.color;
    // console.log(listContainerElement);
}

function deleteCardFromList(cardToDelete) {
    const cardContainerElement = document.querySelector(
        `#card-${cardToDelete}`
    );
    cardContainerElement.remove();
}

function addAssociatedLabelToCard(cardToAssociate, cardReceived) {
    const labelContainerElement = document.querySelector(
        `#card-${cardToAssociate.card_id}`
    );
    const labelContainerToAddElement = labelContainerElement.querySelector(
        "[slot='card-label']"
    );
    const div = document.createElement("div");

    div.textContent = cardToAssociate.name;
    div.classList.add(
        "card-header-title",
        "has-text-weight-medium",
        `label-${cardReceived.foundTag.id}`
    );
    div.classList.add("card-header-title", "has-text-weight-medium");
    div.style.backgroundColor = cardReceived.foundTag.color;
    //div.setAttribute("id", `label-${cardReceived.foundTag.id}`);
    labelContainerToAddElement.append(div);
}

function removeAssociatedLabelFromCard(labelReceived) {
    const labelContainerElement = document.querySelector(
        `.label-${labelReceived.label_id}`
    );

    labelContainerElement.remove();
}
