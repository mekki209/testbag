const mongoose = require("mongoose");


//connect data
const connectDatabase = () => {
mongoose.connect('mongodb+srv://' + process.env.DB_USER_PASS+ '@livmo.raykivf.mongodb.net/BAGNGO', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Failed to connect to MongooDB', err));
}
    module.exports = connectDatabase;