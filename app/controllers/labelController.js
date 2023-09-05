
// merci Jeremy ! 

const { Label, Card } = require('../models');


const labelController = {
    async show(req, res) {
        try {
            const labels = await Label.findAll();


            res.send(labels)
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },


    async showOne(req, res) {
        try {
            const { id } = req.params;
            const label = await Label.findByPk(id);
    
            res.send(label);
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },


    async add(req,res) {
        try {
            // on récupère les données du formulaire. Selon la BDD, une liste doit posséder un nom et une position (cette dernière est optionnelle, avec une position par défaut)
            const { name, color } = req.body;
            // on crée la liste en lui appliquant les données récupérées via le formulaire
            const newLabel = await Label.create({
                name,
                color
            });
            // on envoie l'instance de liste nouvellement créé
            res.send(newLabel)
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },


    async update(req, res) {
        /* try {
            const { id } = req.params;
            
            const { name, color } = req.body;
            
            const label = await Label.findByPk(id);
            
            
            const updatedLabel = await label.update({
                name: name,
                color: color
            });
            
            res.send(updatedLabel);
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        } */
        try {
            // on récupère l'id de la requête
            const id = req.params.id;
            const { name, color } = req.body;
            // on vérifie que l'élément qui doit être modifié existe
            const label = await Label.findByPk(id);
            // si l'élément n'existe pas, on renvoie une erreur
            if (!label) {
              res.status(404).send("list does not exist");
            } else {
              // si il existe :
              // on appelle notre modèle pour mettre à jour en BDD les modifications
              // on vérifie la présence des champs à update
              if (name) {
                label.name = name;
              }
              if (color) {
                label.color = color;
              }
              // on sauvegarde en BDD les modifications faites côté express
              await label.save();
              // on renvoie notre nouvelle instance au client
              res.json(label);
            }
          } catch (e) {
            console.trace(e);
      
            res.status(500).json(e.toString());
          }
    },

    async associateCard(req, res){
        const cardId =  Number(req.params.id);
    
        const foundCard = await Card.findByPk(cardId, {
          include: "labels"
        });
    
        if (!foundCard){
          return res.status(404).json({ error: "can't find this card"});
        }
    
        const labelId =  Number(req.body.id);
    
        const foundTag = await Label.findByPk(labelId);
    
        if (!foundTag){
          return res.status(404).json({ error: "can't find this tag"});
        }
    
        // cf https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
        // Attention à bien utiliser le nom de l'alias qu'on a définit dans la relations Card.belongsToMany(Tag) 
        await foundCard.addLabels(foundTag);
        const cardPlusLabel = {foundCard, foundTag}
        return res.json(cardPlusLabel);
      },


    async delete(req, res) {
        try {
            // on récupère le paramètre passé à la route
            const { id } = req.params;
            // on récupère la liste ayant l'id mentionné
            const label = await Label.findByPk(id);
            // on vérifie que la labele existe
            if(!label) {
                res.status(404).send('label not found')
            } else {
                // on supprime la labele
                const result = await label.destroy();
            // on renvoie la valeur de retour à notre client
            res.json('ok')
            }
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

    async unassociateCard(req, res){
        const cardId =  Number(req.params.card_id);
    
        const foundCard = await Card.findByPk(cardId, {
          include: "labels"
        });
    
        if (!foundCard){
          return res.status(404).json({ error: "can't find this card"});
        }
    
        const tagId =  Number(req.params.label_id);
        const foundTag = await Label.findByPk(tagId);
    
        if (!foundTag){
          return res.status(404).json({ error: "can't find this tag"});
        }
    
        // cf https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
        // Attention à bien utiliser le nom de l'alias qu'on a définit dans la relations Card.belongsToMany(Tag) 
        await foundCard.removeLabels(foundTag);
        const foundCardPlusFoundTag = {foundCard, foundTag}
        return res.json(foundCardPlusFoundTag);
      },
};


module.exports = labelController;



