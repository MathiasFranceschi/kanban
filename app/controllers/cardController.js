const { Card } = require('../models');

const cardController = {

    async getCards(req, res) {
        try {
            const cards = await Card.findAll({
                include: 'labels',
                order: ['position']
            });
            if (!cards) {
                res.status(404).send('no cards found');
            } else {
                res.json(cards);
            }
        } catch (e) {
            console.trace(e);
            // pour avoir des réponses uniformes auprès du client, on transforme l'erreur en json à envoyer au client
            res.status(500).json(e.toString());
        }
    },

    async getOneCard(req, res) {

        try {
            // on récupère l'id de la requête
            const id = req.params.id;

            // on cherche la carte demandée
            const cardFound = await Card.findByPk(id, {
                include: 'labels',
                // dès qu'on spécifie un champ supplémentaire, transforme notre valeur en tableau (ici position se trouve dans un tableau pour rajouter la propriété de tri 'ASC')
                order: [
                    ['position', 'ASC']
                ]
            });
            // on vérifie que la réponse de postgresql ne soit pas vide
            if (!cardFound) {
                res.status(404).send('card not found');
            } else {
                // on envoie le résultat
                res.json(cardFound);
            }
        } catch (e) {
            console.trace(e);
            res.status(500).json(e.toString());
        }
    },

    async cardsOfOneList(req, res) {
        try {
          const id = req.params.id;
    
          const cardsOfList = await Card.findAll({
            include: "labels",
            where: {list_id : id}
          });
    
          if (!cardsOfList) {
            throw new Error("list not found");
          }
    
          res.json(cardsOfList);
        } catch (e) {
          console.trace(e);
          res.status(500).json(e.toString());
        }
      },


    async createCard(req, res) {
        try {

            const {
                description,
                color,
                list_id
            } = req.body;
            // on prépare une liste d'erreurs
            const formErrors = [];
            if (!description) {
                formErrors.push('description not found');
            }
            if (!color) {
                formErrors.push('color not found');
            }
            if (!list_id) {
                formErrors.push('list id not found');

            }
            if (formErrors.length > 0) {
                // on envoie le tableau d'erreurs
                res.status(400).json(formErrors)
            } else {
                // on a pas d'erreur, donc on peut créer la carte !
                const newCard = await Card.create({
                    description: description,
                    color: color,
                    list_id: list_id
                })
                if (!newCard) {
                    res.status(500).send('issue with creating card');
                } else {
                    // on renvoie une bonne réponse à l'utilisateur
                    res.json(newCard);
                }
            }

        } catch (e) {
            console.trace(e);
            res.status(500).json(e.toString());
        }
    },

    async updateCard(req, res) {
        try {

            // on récupère l'id de la requête
            const id = req.params.id;
            const { description, color, position, list_id } = req.body;
            // on vérifie que l'élément qui doit être modifié existe
            const card = await Card.findByPk(id);
            // si l'élément n'existe pas, on renvoie une erreur
            if (!card) {
                res.status(404).send('card does not exist')
            } else {
                if (description) {
                    card.description = description;
                }
                if (color) {
                    card.color = color;
                }
                if (position) {
                    card.position = position;
                }
                if (list_id) {
                    card.list_id = list_id;
                }
                await card.save();
                // on renvoie notre nouvelle instance au client
                res.json(card);
            }
        }catch (e) {
            console.trace(e);
            
            res.status(500).json(e.toString());
        }
    },

    async deleteCard(req, res) {
        try {

            // on récupère le paramètre passé à la route
            const id = req.params.id;
            // on récupère la liste ayant l'id mentionné
            const card = await Card.findByPk(id);
            // si la liste que l'utilisateur veut supprimer n'existe pas : 
            if (!card) {
                res.status(404).send('card not found');
            } else {
            // sinon si la liste existe : 
                // on supprime la liste
                const result = await card.destroy();
                // on renvoie la valeur de retour à notre client
                res.json('ok');
            }
        }catch (e) {
            console.trace(e);                
            res.status(500).json(e.toString());
        }
    }
}


module.exports = cardController;