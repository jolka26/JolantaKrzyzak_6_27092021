const jwt =  require('jsonwebtoken');

module.exports = (req, res, next) => {

    try {
        const token = req.headers.authorization.split('')[1];
        const decodedToken = jwt.verify(token, 'RANDM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        if(req.body.userId && req.body.userId !== userId) {
            throw 'Sorry user ID non valable'
        } else {
            next();
        }
    } catch (error) {
        res.stqtus(401).json({ error: error | 'Roquete non authentifie ! '})
    }
};