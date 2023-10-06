import apiBaseUrl from './config';

export async function getLists() {
  const listsResponse = await fetch(`${apiBaseUrl}/lists`);
  const lists = await listsResponse.json();
  return lists;
}

export async function getOneCard(cardId) {
  const cardResponse = await fetch(`${apiBaseUrl}/cards/${cardId}`);
  const card = await cardResponse.json();
  return card;
}

export async function createList(newList) {
  const response = await fetch(`${apiBaseUrl}/lists`, {
    method: 'post',
    body: JSON.stringify(newList),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  if (!response.ok) {
    return null;
  }

  const createdList = await response.json();

  return createdList;
}

export async function createCard(newCard) {
  const response = await fetch(`${apiBaseUrl}/cards`, {
    method: 'post',
    body: JSON.stringify(newCard),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) {
    return null;
  }

  const createdCard = await response.json();

  return createdCard;
}

export async function updateList(listToUpdate) {
  const response = await fetch(`${apiBaseUrl}/lists/${listToUpdate.label_id || listToUpdate.list_id}`, {
    method: 'PATCH',
    body: JSON.stringify(listToUpdate),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) {
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

  if (!response.ok) {
    return null;
  }

  const updatedList = await response.json();
  return updatedList;
}

export async function deleteCard(cardToDelete) {
  const response = await fetch(`${apiBaseUrl}/cards/${cardToDelete}`, {
    method: 'DELETE',
    body: JSON.stringify(cardToDelete),
  });

  if (!response.ok) {
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

  if (!response.ok) {
    return null;
  }

  const deletedList = await response.json();
  return deletedList;
}

export async function createLabel(labelToCreate) {
  const response = await fetch(`${apiBaseUrl}/labels`, {
    method: 'POST',
    body: JSON.stringify(labelToCreate),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) {
    return null;
  }

  const createdList = await response.json();

  return createdList;
}

export async function getLabels() {
  const labelsResponse = await fetch(`${apiBaseUrl}/labels`);
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

  if (!response.ok) {
    return null;
  }

  const updatedLabel = await response.json();
  return updatedLabel;
}

export async function deleteLabel(labelToDelete) {
  const response = await fetch(`${apiBaseUrl}/labels/${labelToDelete.id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
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

  if (!response.ok) {
    return null;
  }

  const associatedLabel = await response.json();
  return associatedLabel;
}

export async function unassociateCardOfLabel(unassociation) {
  const response = await fetch(`${apiBaseUrl}/cards/${unassociation.card_id}/label/${unassociation.label_id}`, {
    method: 'DELETE',

  });

  if (!response.ok) {
    return null;
  }

  const unassociatedLabel = await response.json();
  return unassociatedLabel;
}
