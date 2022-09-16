const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
    },
    lname: {
        type: String,
    },
	birthday: {
        type: Date,
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    country: {
        type: String,
       
    },
	phone: {
        type: Number,
        minLength: [8, 'Your password must be longer than 8 characters'],
    },
	codepostale: {
        type: Number,
        minLength: [4, 'Your password must be longer than 4 characters'],
    },
	address: {
        type: String,
    },
	password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [7, 'Your password must be longer than 6 characters'],
        select: false
    },
	avatar: {
        public_id: {
            type: String,

    },
        url: {
            type: String,

        },
    },

	patente: {
        public_id: {
            type: String,

    },
        url: {
            type: String,

        },
    },
	cin: {
        public_id: {
            type: String,

    },
        url: {
            type: String,

        },
    },
	rne: {
        public_id: {
            type: String,

    },
        url: {
            type: String,

        },
    },
	cad: {
        public_id: {
            type: String,
            default: ""
    },
        url: {
            type: String,
            default: ""
			
        },
    },
	name: {
        type: String,

    },
    contactpersone: {
        type: String,

    },
	typeservice: {
        type: String,
    },
	homme: {
        type: Number,

    },
	femme: {
        type: Number,

    },
	activity: {
        type: String,

    },
	forme: {
        type: String,
    },
    city: {
        type: String,
    },
	cnss: {
        type: Number
    },

	mfiscale: {
        type: Number
    },
	verified: {
        type: Boolean,
        default: true
    },
    typehost: {
        type: String,

    },
    typerestaurant: {
        type: String,

    },
    specialty : {
        type: String,

    },
    bio : {
        type: String,
        default: 'Not yet'
    },
    role:  {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

})



    // Encrypting password before saving user
    userSchema.pre('save', async function (next) {
        if(!this.isModified('password')) {
            next()
        }
        this.password = await bcrypt.hash(this.password, 10)
    })

    // Compare user password
    userSchema.methods.comparePassword = async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password)
    }

    // Return JWT token
    userSchema.methods.getJwtToken = function () {
        return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_TIME
        })

    }

    // Generate password reset token
    userSchema.methods.getResetPasswordToken = function () {
       
       
        // Generate token
        const resetToken = crypto.randomBytes(20).toString('hex');
        

        // Hash and set to resetPasswordToken
        this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    
    
        // Set token expire time
        this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

        return resetToken
    }


module.exports = mongoose.model('User', userSchema);

	