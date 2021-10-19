const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/', auth, multer, sauceCtrl.createSauce);  
router.put('/:id',auth, multer, sauceCtrl.modifySauce); 
router.delete('/:id', auth, sauceCtrl.deleteSauce );
router.get('/', auth, multer, sauceCtrl.getAllSauces );
router.get('/:id', auth, sauceCtrl.getOneSauce); 
router.post('/:id/like', sauceCtrl.likeSauce);

module.exports = router;

