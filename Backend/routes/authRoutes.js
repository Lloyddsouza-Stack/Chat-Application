require("dotenv").config();
const express = require("express");
const bcrypt =require("bcrypt")
const User= require("../models/User");
const jwt = require("jsonwebtoken");
const OTP = require("../models/otp");
const nodemailer = require('nodemailer')
const crypto = require("crypto");

const router= express.Router();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists. Please log in." });
        }

        const otp = crypto.randomInt(100000,999999).toString(); 
        const hashedOTP = await bcrypt.hash(otp, 10);
        const hashedPassword = await bcrypt.hash(password, 10);

        await OTP.deleteOne({ email }); // deletes prior otp if any

        await OTP.create({ username, email, password: hashedPassword, otp: hashedOTP });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Email - Chat Application",
            html: `<p>Your OTP for verification is: <b>${otp}</b></p>`,
        });

        res.status(200).json({ message: "OTP sent to your email. Please verify." });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error." });
    }
});

router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpEntry = await OTP.findOne({ email });
        if (!otpEntry) {
            return res.status(400).json({ message: "OTP expired or invalid. Please sign up again." });
        }

/* otp becomes invalid after 5 mins is managed by mongoDB at otp model schema file. 
if the otp is older tahn 5 mins then mongoDB will automatically delete it and the above if statement will handle it*/

        const isMatch = await bcrypt.compare(otp, otpEntry.otp);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        await User.create({ 
            username: otpEntry.username, 
            email: otpEntry.email, 
            password: otpEntry.password, // already hashed
            verified: true 
        });

        await OTP.deleteOne({ email }); // remove after verification

        res.status(201).json({ message: "Signup successful! Redirecting to login..." });
    } catch (error) {
        console.error("OTP verification error:", error);
        res.status(500).json({ message: "Server error." });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        if (!user.verified) {
            return res.status(400).json({ message: "Please verify your email before logging in." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

module.exports= router;
