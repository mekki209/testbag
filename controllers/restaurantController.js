const Restaurant = require('../models/restaurant')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary');



exports.newRestaurant = catchAsyncErrors(async (req, res, next) => {
// add an other if contains more than pic
    let imagesPlat = []
    if (typeof req.body.imagesPlat === 'string') {
        imagesPlat.push(req.body.imagesPlat)
    } else {
        imagesPlat = req.body.imagesPlat
    }

    let imagesLinks = [];

    for (let i = 0; i < imagesPlat.length; i++) {
        const result = await cloudinary.v2.uploader.upload(imagesPlat[i], {
            folder: 'restaurant'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    let imagesMenu = []
    if (typeof req.body.imagesMenu === 'string') {
        imagesMenu.push(req.body.imagesMenu)
    } else {
        imagesMenu = req.body.imagesMenu
    }

    let imagesLink = [];

    for (let i = 0; i < imagesMenu.length; i++) {
        const result = await cloudinary.v2.uploader.upload(imagesMenu[i], {
            folder: 'restaurant'
        });

        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.imagesMenu = imagesLink;
    req.body.imagesPlat = imagesLinks;
    req.body.user = req.user.id;

    const restaurant = await new Restaurant(req.body).save();
    res.status(201).json({
        success: true,
        restaurant
    })
})



exports.getRestaurants = catchAsyncErrors(async (req, res, next) => {

    const resPerPage = 9;
    const restaurantsCount = await Restaurant.countDocuments();

    const apiFeatures = new APIFeatures(Restaurant.find(), req.query)
        .search()
        .filter()

    let restaurants = await apiFeatures.query;
    let filteredRestaurantsCount = restaurants.length;

    apiFeatures.pagination(resPerPage)
    restaurants = await apiFeatures.query;


    res.status(200).json({
        success: true,
        restaurantsCount,
        resPerPage,
        filteredRestaurantsCount,
        restaurants
    })

})


exports.getTraderRestaurants = catchAsyncErrors(async (req, res, next) => {

    const restaurants = await Restaurant.find();

    res.status(200).json({
        success: true,
        restaurants
    })
})



exports.getSingleRestaurant = catchAsyncErrors(async (req, res, next) => {

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        return next(new ErrorHandler('restaurant not found', 404));
    }


    res.status(200).json({
        success: true,
        restaurant
    })

})



exports.updateRestaurant = catchAsyncErrors(async (req, res, next) => {

    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        return next(new ErrorHandler('Restaurant not found', 404));
    }

    let imagesPlat = []
    if (typeof req.body.imagesPlat === 'string') {
        imagesPlat.push(req.body.imagesPlat)
    } else {
        imagesPlat = req.body.imagesPlat
    }

    if (imagesPlat !== undefined) {

        // Deleting images associated with the restaurant
        for (let i = 0; i < restaurant.imagesPlat.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(restaurant.imagesPlat[i].public_id)
        }

        let imagesLinks = [];

        for (let i = 0; i < imagesPlat.length; i++) {
            const result = await cloudinary.v2.uploader.upload(imagesPlat[i], {
                folder: 'restaurants'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.imagesPlat = imagesLinks

    }

    let imagesMenu = []
    if (typeof req.body.imagesMenu === 'string') {
        imagesMenu.push(req.body.imagesMenu)
    } else {
        imagesMenu = req.body.imagesMenu
    }

    if (imagesMenu !== undefined) {

        // Deleting images associated with the restaurant
        for (let i = 0; i < restaurant.imagesMenu.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(restaurant.imagesMenu[i].public_id)
        }

        let imagesLink = [];

        for (let i = 0; i < imagesMenu.length; i++) {
            const result = await cloudinary.v2.uploader.upload(imagesMenu[i], {
                folder: 'restaurants'
            });

            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.imagesMenu = imagesLink

    }




    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        restaurant
    })

})


exports.deleteRestaurant = catchAsyncErrors(async (req, res, next) => {

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        return next(new ErrorHandler('Restaurant not found', 404));
    }

    // Deleting images associated with the restaurant
    for (let i = 0; i < restaurant.imagesMenu.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(restaurant.imagesMenu[i].public_id)
    }
    for (let i = 0; i < restaurant.imagesPlat.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(restaurant.imagesPlat[i].public_id)
    }


    await restaurant.remove();

    res.status(200).json({
        success: true,
        message: 'Restaurant is deleted.'
    })

})

// Create new review   =>   /api/v1/review
exports.createRestaurantReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, restaurantId } = req.body;

    const review = {
        user: req.user._id,
        fname: req.user.fname,
        lname: req.user.lname,
        avatar: req.user.avatar,
        rating: Number(rating),
        comment
    }

    const restaurant = await Restaurant.findById(restaurantId);

    const isReviewed = restaurant.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        restaurant.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        restaurant.reviews.push(review);
        restaurant.numOfReviews = restaurant.reviews.length
    }

    restaurant.ratings = restaurant.reviews.reduce((acc, item) => item.rating + acc, 0) / restaurant.
    reviews.length

    await restaurant.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})

// Get restaurant Reviews   =>   /api/v1/reviews
exports.getRestaurantReviews = catchAsyncErrors(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: restaurant.reviews
    })
})