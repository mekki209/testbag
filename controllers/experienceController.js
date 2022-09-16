const Experience = require('../models/experience')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary');

// Create new experience   =>   /api/v1/host/experience/new

exports.newExperience = catchAsyncErrors(async (req, res, next) => {
   
    //Experience Image
    let YourIdeaImage = []
    if (typeof req.body.YourIdeaImage === 'string') {
        YourIdeaImage.push(req.body.YourIdeaImage)
    } else {
        YourIdeaImage = req.body.YourIdeaImage
    }

    let imagesLinks = [];

    for (let i = 0; i < YourIdeaImage.length; i++) {
        const result = await cloudinary.v2.uploader.upload(YourIdeaImage[i], {
            folder: 'experiences'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.YourIdeaImage = imagesLinks;
    req.body.user = req.user.id;

      //Transport Image
      if (req.body.TrImage !== undefined) {
      let TrImage = []

      if (typeof req.body.TrImage === 'string') {
          TrImage.push(req.body.TrImage)
      } else {
          TrImage = req.body.TrImage
      }
  
      let imagesLinkss = [];
  
      for (let i = 0; i < TrImage.length; i++) {
          const result = await cloudinary.v2.uploader.upload(TrImage[i], {
              folder: 'experiences'
          });
  
          imagesLinkss.push({
              public_id: result.public_id,
              url: result.secure_url
          })
      }
  
  
      req.body.TrImage = imagesLinkss;
    }

    //Lodging Image
      if (req.body.LdImage !== undefined) {
      let LdImage = []

      if (typeof req.body.LdImage === 'string') {
        LdImage.push(req.body.LdImage)
      } else {
        LdImage = req.body.LdImage
      }
  
      let imagesLinksss = [];
  
      for (let i = 0; i < LdImage.length; i++) {
          const result = await cloudinary.v2.uploader.upload(LdImage[i], {
              folder: 'experiences'
          });
  
          imagesLinksss.push({
              public_id: result.public_id,
              url: result.secure_url
          })
      }
  
  
      req.body.LdImage = imagesLinksss;
    }


    const experience = await new Experience(req.body).save();
    res.status(201).json({
        success: true,
        experience
    })
})


// Get all experience   =>   /api/v1/experiences?keyword=apple
exports.getExperiences = catchAsyncErrors(async (req, res, next) => {

    const resPerPage = 9;
    const experiencesCount = await Experience.countDocuments();

    const apiFeatures = new APIFeatures(Experience.find(), req.query)
        .search()
        .filter()

    let experiences = await apiFeatures.query;
    let filteredExperiencesCount = experiences.length;

    apiFeatures.pagination(resPerPage)
    experiences = await apiFeatures.query;


    res.status(200).json({
        success: true,
        experiencesCount,
        resPerPage,
        filteredExperiencesCount,
        experiences
    })

})

// Get all experiences (host)  =>   /api/v1/host/experiences
exports.getHostExperiences = catchAsyncErrors(async (req, res, next) => {

    const experiences = await Experience.find();

    res.status(200).json({
        success: true,
        experiences
    })
})


// Get single experience details   =>   /api/v1/experience/:id
exports.getSingleExperience = catchAsyncErrors(async (req, res, next) => {

    const experience = await Experience.findById(req.params.id);

    if (!experience) {
        return next(new ErrorHandler('experience not found', 404));
    }


    res.status(200).json({
        success: true,
        experience
    })

})


// Update Experience   =>   /api/v1/host/experience/:id
exports.updateExperience = catchAsyncErrors(async (req, res, next) => {

    let experience = await Experience.findById(req.params.id);

    if (!experience) {
        return next(new ErrorHandler('Experience not found', 404));
    }

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {

        // Deleting images associated with the experience
        for (let i = 0; i < experience.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(experience.images[i].public_id)
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'experiences'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.images = imagesLinks

    }



    experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        experience
    })

})

// Delete Experience   =>   /api/v1/host/experience/:id
exports.deleteExperience = catchAsyncErrors(async (req, res, next) => {

    const experience = await Experience.findById(req.params.id);

    if (!experience) {
        return next(new ErrorHandler('Experience not found', 404));
    }

    // Deleting images associated with the experience
    for (let i = 0; i < experience.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(experience.images[i].public_id)
    }

    await experience.remove();

    res.status(200).json({
        success: true,
        message: 'Experience is deleted.'
    })

})


// Create new review   =>   /api/v1/review
exports.createExperienceReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, experienceId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const experience = await Experience.findById(experienceId);

    const isReviewed = experience.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        experience.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        experience.reviews.push(review);
        experience.numOfReviews = experience.reviews.length
    }

    experience.ratings = experience.reviews.reduce((acc, item) => item.rating + acc, 0) / experience.
    reviews.length

    await experience.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})


// Get experience Reviews   =>   /api/v1/reviews
exports.getExperienceReviews = catchAsyncErrors(async (req, res, next) => {
    const experience = await Experience.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: experience.reviews
    })
})

// Delete Experience Review   =>   /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {

    const experience = await Experience.findById(req.query.experienceId);

    console.log(experience);

    const reviews = experience.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings = experience.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Experience.findByIdAndUpdate(req.query.experienceId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

