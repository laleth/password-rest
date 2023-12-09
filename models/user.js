const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    verificationcode:{type :String}
},
    { timestamps: true }
)

const userModel = mongoose.model("user", userSchema)

module.exports = userModel