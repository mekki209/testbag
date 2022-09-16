const Lodging = require('../models/lodging')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary');



exports.newLodging = catchAsyncErrors(async (req, res) => {

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'lodging'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const lodging = await new Lodging(req.body).save();
    res.status(201).json({
        success: true,
        lodging
    })
})



exports.getLodgings = catchAsyncErrors(async (req, res, next) => {

    const resPerPage = 9;
    const lodgingsCount = await Lodging.countDocuments();

    const apiFeatures = new APIFeatures(Lodging.find(), req.query)
        .search()
        .filter()

    let lodgings = await apiFeatures.query;
    let filteredLodgingsCount = lodgings.length;

    apiFeatures.pagination(resPerPage)
    lodgings = await apiFeatures.query;


    res.status(200).json({
        success: true,
        lodgingsCount,
        resPerPage,
        filteredLodgingsCount,
        lodgings
    })

})


exports.getTraderLodgings = catchAsyncErrors(async (req, res, next) => {

    const lodgings = await Lodging.find();

    res.status(200).json({
        success: true,
        lodgings
    })
})



exports.getSingleLodging = catchAsyncErrors(async (req, res, next) => {

    const lodging = await Lodging.findById(req.params.id);

    if (!lodging) {
        return next(new ErrorHandler('lodging not found', 404));
    }


    res.status(200).json({
        success: true,
        lodging
    })

})



exports.updateLodging = catchAsyncErrors(async (req, res, next) => {

    let lodging = await Lodging.findById(req.params.id);

    if (!lodging) {
        return next(new ErrorHandler('Lodging not found', 404));
    }

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {

        // Deleting images associated with the lodging
        for (let i = 0; i < lodging.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(lodging.images[i].public_id)
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'lodgings'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.images = imagesLinks

    }



    lodging = await Lodging.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        lodging
    })

})


exports.deleteLodging = catchAsyncErrors(async (req, res, next) => {

    const lodging = await Lodging.findById(req.params.id);

    if (!lodging) {
        return next(new ErrorHandler('Lodging not found', 404));
    }

    // Deleting images associated with the lodging
    for (let i = 0; i < lodging.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(lodging.images[i].public_id)
    }

    await lodging.remove();

    res.status(200).json({
        success: true,
        message: 'Lodging is deleted.'
    })

})

// Create new review   =>   /api/v1/review
exports.createLodgingReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, lodgingId } = req.body;

    const review = {
        user: req.user._id,
        fname: req.user.fname,
        lname: req.user.lname,
        avatar: req.user.avatar,
        rating: Number(rating),
        comment
    }

    const lodging = await Lodging.findById(lodgingId);

    const isReviewed = lodging.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        lodging.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        lodging.reviews.push(review);
        lodging.numOfReviews = lodging.reviews.length
    }

    lodging.ratings = lodging.reviews.reduce((acc, item) => item.rating + acc, 0) / lodging.
    reviews.length

    await lodging.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})

// Get lodging Reviews   =>   /api/v1/reviews
exports.getLodgingeReviews = catchAsyncErrors(async (req, res, next) => {
    const lodging = await Lodging.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: lodging.reviews
    })
})