const express = require('express')
const router = express.Router();


const {
    getExperiences,
    getHostExperiences,
    newExperience,
    getSingleExperience,
    updateExperience,
    deleteExperience,
    createExperienceReview,
    getExperienceReviews,
    deleteReview,

     } = require('../controllers/experienceController')

     const { isAuthenticatedUser , authorizeRoles} = require('../middleware/auth');



     router.route('/experiences').get(getExperiences);
     router.route('/host/experiences').get(getHostExperiences);
    

     router.route('/experience/:id').get(getSingleExperience);
     
     router.route('/host/experience/new').post(isAuthenticatedUser, newExperience);
     
     router.route('/host/experience/:id')
         .put(isAuthenticatedUser, authorizeRoles('host'), updateExperience)
         .delete(isAuthenticatedUser, authorizeRoles('host'), deleteExperience);
     
     
     router.route('/review').put(isAuthenticatedUser, createExperienceReview);


     router.route('/reviews').get(isAuthenticatedUser, getExperienceReviews);
     router.route('/reviews').delete(isAuthenticatedUser, deleteReview);





     module.exports = router;