const mongoose = require('mongoose')


const transportSchema = new mongoose.Schema({

    activity: {
        type: String,
    },
    typeTransport: {
        type: String,
    },
    name: {
        type: String,
    },
    pricepernight: {
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
    governorate :{
        type: String,
    },
    nbrePlace :{
        type: Number,
    },
    fueltype :{
        type: String,
    },
    rules :{
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

module.exports = mongoose.model('Transport', transportSchema);