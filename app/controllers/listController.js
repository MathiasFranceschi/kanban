const { json } = require("sequelize");
const { List } = require("../models");

// un controller a pour objectif de
// - réagir à une requête
// - communiquer avec la BDD
// - préparer une réponse pour le client

const listController = {
  async getLists(req, res) {
    try {
      const lists = await List.findAll({
        // inclusion sur 2 niveau, on récupère les cartes, et dans les cartes les labels
        include: {
          association: "cards",
          include: "labels",
        },
        // tri sur 2 niveau, on trie les listes ET les cartes par position
        order: [
          ["position", "ASC"],
          ["cards", "position", "ASC"],
        ],
      });
      // on peut envoyer une réponse avec res.send (généraliste) mais on peut aussi préparer une réponse avec res.json
      if (!lists) {
        res.status(404).send("no list found");
      } else {
        res.json(lists);
      }
    } catch (e) {
      console.trace(e);
      // pour avoir des réponses uniformes auprès du client, on transforme l'erreur en json à envoyer au client
      res.status(500).json(e.toString());
    }
  },

  async getOneList(req, res) {
    try {
      // on récupère l'id de la requête
      const id = req.params.id;

      // on cherche la liste demandée
      const listFound = await List.findByPk(id, {
        include: {
          association: "cards",
          include: "labels",
        },
        order: [["cards", "position", "ASC"]],
      });
      // on vérifie que la réponse de postgresql ne soit pas vide
      if (!listFound) {
        throw new Error("list not found");
      }

      // on envoie le résultat
      res.json(listFound);
    } catch (e) {
      console.trace(e);
      res.status(500).json(e.toString());
    }
  },


  async createList(req, res) {
    try {
      //on récupère les données du formulaire
      // via du destructuring, on récupère name et position
      // nb: il faudra que côté front le formulaire possède ces champs
      const { name, position } = req.body;

      // on vérifie la présence des valeurs dans les champs nécessaires
      if (!name) {
        // vu qu'on appelle la méthode .json, une réponse est envoyée au client
        res.status(400).send("name not found in form");
      } else {
        let newList;
        // on vérifie la présence de position (une propriété facultative)
        // en fonction des champs on va faire un create ou un autre
        // on sauvegarde la liste en BDD
        if (!position) {
          newList = await List.create({
            name: name,
          });
        } else {
          newList = await List.create({
            name: name,
            position: position,
          });
        }
        // on envoie une réponse au client
        res.json(newList);
      }
    } catch (e) {
      console.trace(e);
      res.status(500).json(e.toString());
    }
  },

  async updateList(req, res) {
    try {
      // on récupère l'id de la requête
      const id = req.params.id;
      const { name, position } = req.body;
      // on vérifie que l'élément qui doit être modifié existe
      const list = await List.findByPk(id);
      // si l'élément n'existe pas, on renvoie une erreur
      if (!list) {
        res.status(404).send("list does not exist");
      } else {
        // si il existe :
        // on appelle notre modèle pour mettre à jour en BDD les modifications
        // on vérifie la présence des champs à update
        if (name) {
          list.name = name;
        }
        if (position) {
          list.position = position;
        }
        // on sauvegarde en BDD les modifications faites côté express
        await list.save();
        // on renvoie notre nouvelle instance au client
        res.json(list);
      }
    } catch (e) {
      console.trace(e);

      res.status(500).json(e.toString());
    }
  },

  async deleteList(req, res) {
    try {
      // on récupère le paramètre passé à la route
      const id = req.params.id;
      // on récupère la liste ayant l'id mentionné
      const list = await List.findByPk(id);
      // si la liste que l'utilisateur veut supprimer n'existe pas :
      if (!list) {
        res.status(404).send("list not found");
      } else {
        // sinon si la liste existe :
        // on supprime la liste
        const result = await list.destroy();
        // on renvoie la valeur de retour à notre client
        res.json("ok");
      }
    } catch (e) {
      console.trace(e);
      res.status(500).json(e.toString());
    }
  },
};

module.exports = listController;
