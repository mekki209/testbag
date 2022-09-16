const mongoose = require('mongoose')


const experienceSchema = new mongoose.Schema({

    exptitle: {
        type: String,
    },
    theme: {
        type: String,
    },
    subtheme: {
        type: String,
    },
    activitytheme: {
        type: String,

    },
    location: {
        type: String,
    },
    price: {
        type: Number,
        default: 0.0
    },
    unit: {
        type: String
    },
    spots: {
        type: Number,
        default: 0.0
    },
    map: {
        type: String,
    },
    durationdays: {
        type: Number,
    },
    durationhours: {
        type: Number,
    },
    startdate: {
        type: String,
    },
    season: {
        type: String,
    },
    dayoff: {
        type: String,
    },
    startime: {
        type: String,
    },
    endtime: {
        type: String,
    },
    plan: {
        type: String,
    },
    parage: {
        type: Number,
    },
    pets: {
        type: String,
    },
    othercriteria: {
        type: String,
    },
    YourIdeaImage: [
        {
            public_id: {
                type: String,

            },
            url: {
                type: String,

            },
        }
    ],
    vname: {
        type: String,
    },
    nbreseats: {
        type: Number,
    },
    vehiclerules: {
        type: String,
    },
    gofrom: {
        type: String,
    },
    goto: {
        type: String,
    },
    departurego: {
        type: String,
    },
    arrivalgo: {
        type: String,
    },
    returnfrom: {
        type: String,
    },
    returnto: {
        type: String,
    },
    departurereturn: {
        type: String,
    },
    arrivalreturn: {
        type: String,
    },
    TrImage: [
        {
            public_id: {
                type: String,

            },
            url: {
                type: String,

            },
        }
    ],
    lodgingCategory: {
        type: String,
    },
    lodgingType: {
        type: String,
    },
    lodgingaddress: {
        type: String,
    },
    begindate: {
        type: String,
    },
    enddatee: {
        type: String,
    },
    lodgingdescription: {
        type: String,
    },
    lodginginstructions: {
        type: String,
    },
    lodgingCriteria: {
        type: String,
    },
    LdImage: [
        {
            public_id: {
                type: String,

            },
            url: {
                type: String,

            },
        }
    ],
    dishinputFields: [
        {
            dishId: {
                type: Number,
            },
            dishName: {
                type: String,
            },
            dishDescription: {
                type: String,
            },
            dishImages: [
                {
                    public_id: {
                        type: String,
        
                    },
                    url: {
                        type: String,
        
                    },
                }
            ],
           
        }
    ],

    ratings: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
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

module.exports = mongoose.model('Experience', experienceSchema);