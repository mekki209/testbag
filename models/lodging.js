const mongoose = require('mongoose')


const lodgingSchema = new mongoose.Schema({

    lodgingCategory: {
        type: String
    },
    otherCategory: {
        type: String
    },
    lodgingType :{
        type: String
    },
    otherType :{
        type: String
    },
    title :{
        type: String,
    },
    address : {
        type: String,
    },
    pricepernight : {
        type: Number,
    },
    images: [
        {
            public_id: {
                type: String,

            },
            url: {
                type: String,

            },
        }
    ],
    description : {
        type: String,
    },
    website : {
        type: String,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            fname: {
                type: String,
                required: true
            },
            lname: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            avatar: {
                public_id: {
                    type: String,
                    default:""
            },
                url: {
                    type: String,
                    default:""
        
                },
            },
            created: {
                type: Date,
                default: Date.now
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Lodging', lodgingSchema);