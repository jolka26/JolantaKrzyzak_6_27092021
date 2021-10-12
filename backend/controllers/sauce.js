const Sauce = require('../models/sauce');


/// CRÉER UNE SAUCE
    exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        userLiked: '',
        userDisliked: '',
      });
      sauce.save()
        .then(() => res.status(201).json({message: 'Sauce enregistre'}))
        .catch( error => res.status(400).json({error}));
  };

/// MODIFIER UNE SAUCE
    exports.modifySauce = (req, res, next) => {
    Sauce.updateOne({_id: req.pqrqms.id}, {...req.body, _id: req.pqrqms.id})
      .then(() => res.status(200).json({message: 'Sauce modifie'}))
      .catch(error => res.status(400).json({error}));
  };


/// SUPPRIMER UNE SAUCE
    exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({_id: req.params.id})
      .then(() => res.status(200).json({message: 'Sauce supprime'}))
      .catch(error => res.status(400).json({error}));
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

//  exports.likeSauce = (req, res, next) => {

//  }
