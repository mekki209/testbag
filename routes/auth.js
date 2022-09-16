const express = require('express');
const router = express.Router();


const { 
    registerUser, 
    loginUser, 
    forgotPassword,
    resetPassword,
    getUserProfile, 
    updatePassword,
    updateProfile,
    registerUserHost,
    updateToHostProfile,

    registerOrganism,

    registerTrader,

    logout } = require('../controllers/userController');


const { isAuthenticatedUser } = require('../middleware/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

//Individu

router.route('/hostregister').post(registerUserHost);
router.route('/registerhost').put(isAuthenticatedUser, updateToHostProfile);





router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);



//host "Organism"

router.route('/organism/register').post(registerOrganism);



//router.route('/organism/me').get(isAuthenticatedUser, getOrganismProfile);

//router.route('/organism/me/update').put(isAuthenticatedUser, updateProfile);

// Trader

router.route('/traderregister').post(registerTrader);



router.route('/logout').get(logout);





module.exports = router;