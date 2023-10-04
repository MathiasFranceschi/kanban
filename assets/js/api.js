// ensemble de fonction permettant la communication avec notre back end :
// - en entrée : des données (sous forme d'objet)
// - en sortie : des données (sous forme d'objet)
import { apiBaseUrl } from './config.js';

export async function getLists(){

  // on utilse fetch afin que notre code javascript emette une reqûete en GET vers l'url http://localhost:3000/lists
  // fetch est une fonction asynchrone, on attends son résultat pour continuer
  const listsResponse = await fetch(`${apiBaseUrl}/lists`);

  // une fois la réponse obtenue, on peut parser le json contenu dans le corps de la réponse
  // pour obtenir l'objet (ici, le tableau d'objet) représenté par kle json reçu
  const lists = await listsResponse.json();
  return lists;
}

export async function createList(newList){

  // envoyer une requête en POST sur notre api :
  // Ici, on précise :
  // - quelle ressource on souhaite accéder - grâce à l'url : ici les listes -> /lists
  // - ce que l'on veut y faire - grâce au verbe HTTP : ici ajouter -> POST
  // - avec quelle données - grâce au corps de la requête : ici les infos de la liste à créer.
  const response = await fetch(`${apiBaseUrl}/lists`, {
    method: 'post',
    body: JSON.stringify(newList),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  // si on reçoit autre chose qu'un code 200, c'est que la création a échoué, on renvoit null pour l'indiquer
  if (!response.ok){
    return null;
  }

  const createdList = await response.json();

  return createdList;
}

export async function createCard(newCard){
  const response = await fetch(`${apiBaseUrl}/cards`, {
    method: 'post',
    body: JSON.stringify(newCard),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok){
    return null;
  }

  const createdCard = await response.json();

  return createdCard;
}

export async function updateList(listToUpdate) {
  console.log(listToUpdate);
  const response = await fetch(`${apiBaseUrl}/lists/${listToUpdate.label_id}`, {
    method: 'PATCH',
    body: JSON.stringify(listToUpdate),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok){
    return null;
  }

  const updatedList = await response.json();
  return updatedList;
}

export async function updateCard(cardToUpdate) {
  const response = await fetch(`${apiBaseUrl}/cards/${cardToUpdate.card_id}`, {
    method: 'PATCH',
    body: JSON.stringify(cardToUpdate),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok){
    return null;
  }

  const updatedList = await response.json();
  return updatedList;
}

export async function deleteCard(cardToDelete) {
  const response = await fetch(`${apiBaseUrl}/cards/${cardToDelete}`, {
    method: 'DELETE',
    body: JSON.stringify(cardToDelete),
    /* headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }, */
  });

  if (!response.ok){
    return null;
  }

  const deletedCard = await response.json();
  return deletedCard;
}

export async function deleteList(listToDelete) {
  const response = await fetch(`${apiBaseUrl}/lists/${listToDelete}`, {
    method: 'DELETE',
    body: JSON.stringify(listToDelete),
  });

  if (!response.ok){
    return null;
  }

  const deletedList = await response.json();
  return deletedList;
}

// labels
// les routes labels n'ont pas été faites.............................


export async function createLabel(labelToCreate) {
  const response = await fetch(`${apiBaseUrl}/labels`, {
    method: 'POST',
    body: JSON.stringify(labelToCreate),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok){
    return null;
  }

  const createdList = await response.json();

  return createdList;
}

export async function getLabels(){

  // on utilse fetch afin que notre code javascript emette une reqûete en GET vers l'url http://localhost:3000/lists
  // fetch est une fonction asynchrone, on attends son résultat pour continuer
  const labelsResponse = await fetch(`${apiBaseUrl}/labels`);

  // une fois la réponse obtenue, on peut parser le json contenu dans le corps de la réponse
  // pour obtenir l'objet (ici, le tableau d'objet) représenté par kle json reçu
  const labels = await labelsResponse.json();
  return labels;
}

export async function updateLabel(labelToUpdate) {
  const response = await fetch(`${apiBaseUrl}/labels/${labelToUpdate.id}`, {
    method: 'PATCH',
    body: JSON.stringify(labelToUpdate),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok){
    return null;
  }

  const updatedLabel = await response.json();
  return updatedLabel;
}

export async function deleteLabel(labelToDelete) {
  const response = await fetch(`${apiBaseUrl}/labels/${labelToDelete.id}`, {
    method: 'DELETE',
  });

  if (!response.ok){
    return null;
  }

  const deletedLabel = await response.json();
  return deletedLabel;
}

export async function associateCardToLabel(association) {
  const response = await fetch(`${apiBaseUrl}/cards/${association.card_id}/label`, {
    method: 'POST',
    body: JSON.stringify(association),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok){
    return null;
  }

  const associatedLabel = await response.json();
  return associatedLabel;
}

export async function unassociateCardOfLabel(unassociation) {
  unassociation.card_id = unassociation.foundCard.id;
  unassociation.label_id = unassociation.foundTag.id;
  const response = await fetch(`${apiBaseUrl}/cards/${unassociation.card_id}/label/${unassociation.label_id}`, {
    method: 'DELETE',
    
  });

  if (!response.ok){
    return null;
  }

  const unassociatedLabel = await response.json();
  return unassociatedLabel;
}