const Sauce = require('../models/sauce');
const fs = require('fs');


/// CRÉER UNE SAUCE
    exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    // console.log(sauceObject);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
      });
      sauce.save()
        .then(() => res.status(201).json({message: 'Sauce enregistree'}))
        .catch(error => res.status(400).json({error}));
  };

/// MODIFIER UNE SAUCE
  exports.modifySauce = (req, res, next) => {
  if (req.file) {
      // si l'image est modifiee, on supprime l'ancienne image dans le dossier /image
      Sauce.findOne({ _id: req.params.id })
          .then(sauce => {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  
                  const sauceObject = {
                      ...JSON.parse(req.body.sauce),
                      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                  }
                  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                      .then(() => res.status(200).json({ message: 'Sauce modifiee!' }))
                      .catch(error => res.status(400).json({ error }));
              })
          })
          .catch(error => res.status(500).json({ error }));
  } else {
      // si l'image n'est pas modifiee
      const sauceObject = { ...req.body };
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiee!' }))
          .catch(error => res.status(400).json({ error }));
  }
};



/// SUPPRIMER UNE SAUCE 
    exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimee'}))
            .catch(error => res.status(400).json({error}));
        });
      })
      .catch(error => res.status(500).json({error}));
  };
 
/// AFFICHER UNE SEULE SAUCE
    exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
  }; 


/// AFFICHER TOUTES LES SAUCES
    exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({error}));
    };


/// LIKE / DISLIKE UNE SAUCE

  exports.likeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {

      let message;

      //like une sauce
      if(req.body.like === 1 && !sauce.usersLiked.includes(req.body.userId)) {
        sauce.usersLiked.push(req.body.userId);
        sauce.likes++;
        message = "like une sauce";
      }

      //dislike une sauce
      if( req.body.like === -1 && !sauce.usersLiked.includes(req.body.userId)) {
        sauce.usersDisliked.push(req.body.userId);
        sauce.dislikes++;
        message = "dislike une sauce";
      }

      // retire like pour cette sauce
      if(req.body.like === 0) {
        if(sauce.usersLiked.includes(req.body.userId)) {
          sauce.usersLiked.pull(req.body.userId);
          sauce.likes--;
          message = "retire like pour cette sauce";
          //retire dislike pour cette sauce
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          sauce.usersDisliked.pull(req.body.userId);
          sauce.dislikes--;
          message = "retire dislike pour cette sauce";
        }
      }

      sauce.save()
      .then(() => res.status(200).json({message: message}))
      .catch((error) => res.status(500).json({error}));
    });
}


