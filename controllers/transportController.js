const Transport = require('../models/transport')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary');




exports.newTransport = catchAsyncErrors(async (req, res, next) => {

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'transport'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const transport = await new Transport(req.body).save();
    res.status(201).json({
        success: true,
        transport
    })
})



exports.getTransports = catchAsyncErrors(async (req, res, next) => {

    const resPerPage = 9;
    const transportsCount = await Transport.countDocuments();

    const apiFeatures = new APIFeatures(Transport.find(), req.query)
        .search()
        .filter()

    let transports = await apiFeatures.query;
    let filteredTransportsCount = transports.length;

    apiFeatures.pagination(resPerPage)
    transports = await apiFeatures.query;


    res.status(200).json({
        success: true,
        transportsCount,
        resPerPage,
        filteredTransportsCount,
        transports
    })

})


exports.getTraderTransports = catchAsyncErrors(async (req, res, next) => {

    const transports = await Transport.find();

    res.status(200).json({
        success: true,
        transports
    })
})



exports.getSingleTransport = catchAsyncErrors(async (req, res, next) => {

    const transport = await Transport.findById(req.params.id);

    if (!transport) {
        return next(new ErrorHandler('transport not found', 404));
    }


    res.status(200).json({
        success: true,
        transport
    })

})



exports.updateTransport = catchAsyncErrors(async (req, res, next) => {

    let transport = await Transport.findById(req.params.id);

    if (!transport) {
        return next(new ErrorHandler('Transport not found', 404));
    }

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {

        // Deleting images associated with the transport
        for (let i = 0; i < transport.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(transport.images[i].public_id)
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'transports'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.images = imagesLinks

    }



    transport = await Transport.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        transport
    })

})


exports.deleteTransport = catchAsyncErrors(async (req, res, next) => {

    const transport = await Transport.findById(req.params.id);

    if (!transport) {
        return next(new ErrorHandler('Transport not found', 404));
    }

    // Deleting images associated with the transport
    for (let i = 0; i < transport.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(transport.images[i].public_id)
    }

    await transport.remove();

    res.status(200).json({
        success: true,
        message: 'Transport is deleted.'
    })

})

// Create new review   =>   /api/v1/review
exports.createTransportReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, transportId } = req.body;

    const review = {
        user: req.user._id,
        fname: req.user.fname,
        lname: req.user.lname,
        avatar: req.user.avatar,
        rating: Number(rating),
        comment
    }

    const transport = await Transport.findById(transportId);

    const isReviewed = transport.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        transport.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        transport.reviews.push(review);
        transport.numOfReviews = transport.reviews.length
    }

    transport.ratings = transport.reviews.reduce((acc, item) => item.rating + acc, 0) / transport.
    reviews.length

    await transport.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})

// Get transport Reviews   =>   /api/v1/reviews
exports.getTransportReviews = catchAsyncErrors(async (req, res, next) => {
    const transport = await Transport.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: transport.reviews
    })
})

