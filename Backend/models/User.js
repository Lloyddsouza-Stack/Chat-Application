const mongoose = require("mongoose");

const userSchema= new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: {type: String, required: true},
    isOnline: {type: Boolean, default: false},
    verified: {type: Boolean, default: false},
    verificationToken: {type: String },
},{
    timestamps: true
});

module.exports= mongoose.model("User", userSchema);
