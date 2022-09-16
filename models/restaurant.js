const mongoose = require('mongoose')


const restaurantSchema = new mongoose.Schema({

    restaurantType: {
        type: String,
    },
    restaurantSpecialty :{
        type: String,
    },
    restaurantName :{
        type: String,
    },
    descriptionPlat : {
        type: String,
    },
    platName : {
        type: String,
    },
    price : {
        type: Number,
    },
    imagesPlat: [
        {
            public_id: {
                type: String,

            },
            url: {
                type: String,

            },
        }
    ],
    imagesMenu: [
        {
            public_id: {
                type: String,

            },
            url: {
                type: String,

            },
        }
    ],
    slogon : {
        type: String,
    },
    webSite : {
        type: String,
    },
    address : {
        type: String,
    },
    dayoff : {
        type: String,
    },
    openingTime : {
        type: Date,
    },
    closingTime : {
        type: Date,
    },
    nbrFourchettes : {
        type: Number,
    },
    description : {
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

module.exports = mongoose.model('Restaurant', restaurantSchema);