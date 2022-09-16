const express = require('express')
const router = express.Router();


const {
    newRestaurant,
    getRestaurants,
    getTraderRestaurants,
    getSingleRestaurant,
    updateRestaurant,
    deleteRestaurant,
    createRestaurantReview,
    getRestaurantReviews,

     } = require('../controllers/restaurantController')

     const { isAuthenticatedUser , authorizeRoles} = require('../middleware/auth');



     router.route('/restaurants').get(getRestaurants);
     router.route('/trader/restaurants').get(getTraderRestaurants);
    

     router.route('/restaurant/:id').get(getSingleRestaurant);
     
     router.route('/trader/restaurant/new').post(isAuthenticatedUser,authorizeRoles('trader'), newRestaurant);
     
     router.route('/host/restaurant/:id')
         .put(isAuthenticatedUser, authorizeRoles('trader'), updateRestaurant)
         .delete(isAuthenticatedUser, authorizeRoles('trader'), deleteRestaurant);
     
    
         router.route('/review').put(isAuthenticatedUser, createRestaurantReview);


         router.route('/reviews').get(isAuthenticatedUser, getRestaurantReviews);


     module.exports = router;