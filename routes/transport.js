const express = require('express')
const router = express.Router();


const {
    newTransport,
    getTransports,
    getTraderTransports,
    getSingleTransport,
    updateTransport,
    deleteTransport,
    createTransportReview,
    getTransportReviews,
     } = require('../controllers/transportController')

     const { isAuthenticatedUser , authorizeRoles} = require('../middleware/auth');



     router.route('/transports').get(getTransports);
     router.route('/trader/transports').get(getTraderTransports);
    

     router.route('/transport/:id').get(getSingleTransport);
     
     router.route('/trader/transport/new').post(isAuthenticatedUser,authorizeRoles('trader'), newTransport);
     
     router.route('/host/transport/:id')
         .put(isAuthenticatedUser, authorizeRoles('trader'), updateTransport)
         .delete(isAuthenticatedUser, authorizeRoles('trader'), deleteTransport);
     
         router.route('/review').put(isAuthenticatedUser, createTransportReview);


         router.route('/reviews').get(isAuthenticatedUser, getTransportReviews);



     module.exports = router;