// ensemble de fonction permettant la gestion des listes
import { closeModals } from "./utils.js";
import { listenToClickOnAddCardButton, addCardToList } from "./card.js";
import { getLists, createList, updateList, deleteList, updateCard } from "./api.js";
import { addLabelToTemplateLabelModal } from "./label.js";
import Sortable from "sortablejs";

// --------------------------------------
// Event Listening (sélection d'élément et mise en écoute d'évènement)
// --------------------------------------
export function listenToClickOnAddListButton() {
    // 1 - sélection de l'éléments sur lequel écouter
    const addListButtonElement = document.querySelector("#addlist-button");

    // 2 - association d'un écouteur dévènement pour un type d'évènement sur l'élément
    addListButtonElement.addEventListener("click", handleAddListButtonClick);
}

export function listenToSubmitOnAddListForm() {
    const addListFormElement = document.querySelector("#add-list-modal form");

    addListFormElement.addEventListener("submit", handleAddListFormSubmit);
}

function listenToListName(listName) {
    listName.addEventListener("click", handleEditListButtonClick);
}

function listenToListDeleteButtonClick(list) {
    list.addEventListener("click", handleDeleteListButtonClick);
}

export function listenToListDeleteButtonSubmit() {
    const deleteListFormElement = document.querySelector(
        "#delete-list-modal form"
    );

    deleteListFormElement.addEventListener("submit", handleSubmitDeleteList);
}

export function listenToSubmitListName() {
    const editListFormElement = document.querySelector("#edit-list-modal form");

    editListFormElement.addEventListener("submit", handleSubmitModifyListName);
}

export function listenToDragOnList() {
    const listsContainerElement = document.querySelector("#lists-container");

    // le deuxième argument de Sortable.create permet de définir certaines options concernant le drag'n'drop
    Sortable.create(listsContainerElement, {
        animation: 250, // vitesse de l'effet de déplacement des éléments triables
        handle: ".message-header",
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
    const listIdElement = clickedButtonElement.closest("[slot=list-id]");
    const idValue = listIdElement.id;
    const listId = Number(idValue.substring(5));
    openEditListModal(listId);
}

function handleDeleteListButtonClick(event) {
    const clickedButtonElement = event.currentTarget;
    const listIdElement = clickedButtonElement.closest("[slot=list-id]");
    const idValue = listIdElement.id;
    const listId = Number(idValue.substring(5));
    opendeleteListModal(listId);
}

async function handleAddListFormSubmit(event) {
    event.preventDefault();

    // 1 - on recueille les données de l'utilisateur
    const addListFormElement = document.querySelector("#add-list-modal form");

    const addListFormData = new FormData(addListFormElement);
    const listToAdd = Object.fromEntries(addListFormData);

    // 2 - on transmets les données saisies à l'API en lui inquant que faire de ces données (ici, d'ajouter une liste)
    // 3 - on récupère les données retournées par l'API (on connait maintenant l'id de la liste créée)
    // une fois que l'on a recueilli les données de la liste à créer, on peut demander la création de cette liste au backend.
    // ce dernier nous renverra les informations de la liste créées (avec notamment son id)
    // nous pourrons ainsi ajouter CETTE liste à notre interface utilisateur.
    const newList = await createList(listToAdd);

    if (newList) {
        // on met à jour l'interface utilisateur avec les données retournée par l'API
        addListToListsContainer(newList);

        // on réinitialise le formulaire
        addListFormElement.reset();
        // on ferme les modales
        closeModals();
        orderLists();
    } else {
        alert("un problème est survenu lors de la création de la liste...");
    }
}

async function handleSubmitModifyListName(event) {
    event.preventDefault();

    const editListFormElement = document.querySelector("#edit-list-modal form");

    const editListFormData = new FormData(editListFormElement);
    const listToEdit = Object.fromEntries(editListFormData);

    // 2 - on transmets les données saisies à l'API en lui inquant que faire de ces données (ici, d'ajouter une liste)
    // 3 - on récupère les données retournées par l'API (on connait maintenant l'id de la liste créée)
    // une fois que l'on a recueilli les données de la liste à créer, on peut demander la création de cette liste au backend.
    // ce dernier nous renverra les informations de la liste créées (avec notamment son id)
    // nous pourrons ainsi ajouter CETTE liste à notre interface utilisateur.
    const listEdited = await updateList(listToEdit);
    console.log(listEdited);
    if (listEdited) {
        // on met à jour l'interface utilisateur avec les données retournée par l'API
        editListName(listEdited);

        // on réinitialise le formulaire
        editListFormElement.reset();
        // on ferme les modales
        closeModals();
    } else {
        alert("un problème est survenu lors de la modification de la liste...");
    }
}

async function handleSubmitDeleteList(event) {
    /////////////////
    event.preventDefault();

    const deleteCardModalElement = document.querySelector(
        "#delete-list-modal form"
    );
    // const listIdFormInputElement = deleteCardModalElement.querySelector("[name='list_id']");

    const deleteListModalFormData = new FormData(deleteCardModalElement);
    const modalListToDelete = Object.fromEntries(deleteListModalFormData);

    const listId = modalListToDelete.list_id;
    // on delete avec les données trouvées
    // const Delete = await deleteCard(cardId);

    // const cardId = Number(listIdFormInputElement.value);
    const listDelete = await deleteList(listId);

    if (listDelete) {
        deleteListFrom(listId);

        closeModals();
    } else {
        alert("un problème est survenu lors de la modification de la liste...");
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
    /* const labels = await getLabels();
    labels.forEach((label) => { 
      addLabelToTemplateLabelModal(label);
    }) */
    lists.forEach((list) => {
        addListToListsContainer(list);
    });
}

function opendeleteListModal(listId) {
    const deleteListModalElement = document.querySelector("#delete-list-modal");
    deleteListModalElement.classList.add("is-active");
    const listIdFormInputElement =
        deleteListModalElement.querySelector("[name='list_id']");
    listIdFormInputElement.value = listId;
}

function openAddListModal() {
    // on sélectionne l'élément que l'on souhaite modifie
    const addListModalElement = document.querySelector("#add-list-modal");

    // on le modifie
    addListModalElement.classList.add("is-active");
}

function openEditListModal(listId) {
    // on sélectionne l'élément que l'on souhaite modifie
    const editListModalElement = document.querySelector("#edit-list-modal");
    // on le modifie
    editListModalElement.classList.add("is-active");
    const listIdFormInputElement =
        editListModalElement.querySelector("[name='list_id']");
    listIdFormInputElement.value = listId;
}

function addListToListsContainer(list) {
    // on récupèrele template
    const listTemplate = document.querySelector("#list-template");
    // on accède à son contenu
    const listTemplateContent = listTemplate.content;
    // on en crée une copie
    const clonedListTemplate = listTemplateContent.cloneNode(true);
    const clonedListElement = clonedListTemplate.querySelector(".list");

    // on modifie le template avec les infos de la liste à créer
    // nom de la liste :
    const slotListNameElement =
        clonedListTemplate.querySelector("[slot='list-name']");
    slotListNameElement.textContent = list.name;
    // id de la liste :
    const slotListIdElement =
        clonedListTemplate.querySelector("[slot='list-id']");
    slotListIdElement.setAttribute("id", `list-${list.id}`);

    // on récupère le container de liste
    const listsContainerElement = document.querySelector("#lists-container");
    // on ajoute la copie du template
    const listTextName = clonedListTemplate.querySelector("[slot='list-name']");

    const listDeleteButton = clonedListTemplate.querySelector(
        "[slot='remove-list-button']"
    );

    listenToListDeleteButtonClick(listDeleteButton);
    listsContainerElement.append(clonedListTemplate);
    // on se met en écoute du click sur le bouton d'ajout de carte lors de la création de la liste
    listenToListName(listTextName);
    listenToClickOnAddCardButton(list.id);
    // création des cartes associées à la liste s'il y a lieu
    if (list.cards) {
        list.cards.forEach((card) => {
            addCardToList(card);
            /* if (card.labels[0]) {
      addLabelToTemplateLabelModal(card.labels[0])
      }  */
        });
    }

    const cardsContainerElement = clonedListElement.querySelector(
        ".message-body"
    );
    console.log(cardsContainerElement);
    Sortable.create(cardsContainerElement, {
        animation: 250,
        group: "cards",
        onEnd: (event) => {
            orderCards(event.to);
            if (event.from != event.to) {
                orderCards(event.from);
            }
        },
    });
}

async function orderLists() {
    // Plan d'action :
    // on récupère les listes dans l'ordre dans lequel elle sont dans le DOM
    // on utilise l'api pour leut attribuer une à une la position correspondante : 1 pour le première liste, 2 pour la seconde, etc
    const listElementList = document.querySelectorAll(".list");
    let position = 1;

    for (const listElement of listElementList) {
        // on récupère l'id de la list
        const idListElement = listElement.id;
        const listId = idListElement.substring(5);
        let listIdObject = { list_id: listId,
        position: position}
        // on met à jour la liste courante avec la position
        const updatedList = await updateList(listIdObject);

        if (!updatedList) {
            alert("Un problème est survenu lors du réordonnement des listes");
            break;
        }

        position++;
    }
}

export async function orderCards(cardContainer) {
    const cardElementList = cardContainer.querySelectorAll(".card");

    // depuis le container de cartes, on récupère l'id de la liste
    const listElement = cardContainer.closest(".list");
    const idListElement = listElement.id;
    const listId = idListElement.substring(5);

    let position = 1;

    // on repositionne chaque élément de la liste
    for (const cardElement of cardElementList) {
        // on récupère l'id de la carte
        const idCard = cardElement.id;
        const cardId = idCard.substring(5);
        const cardIdObject = { card_id: cardId, position: position,}
        // on demande la mise à jour en contactant l'API
        const updatedCard = await updateCard(cardIdObject);

        // en cas de pb, on alerte l'utilisateur
        if (!updatedCard) {
            alert("Un problème est survenu lors du réordonnement des listes");
            break;
        }

        position++;
    }
}

function editListName(listName) {
    const listContainerElement = document.querySelector(
        `#list-${listName.id} [slot='list-name']`
    );
    listContainerElement.textContent = listName.name;
    // console.log(listContainerElement);
}

function deleteListFrom(listToDelete) {
    const listContainerElement = document.querySelector(
        `#list-${listToDelete}`
    );
    listContainerElement.remove();
}
