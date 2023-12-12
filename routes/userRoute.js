const express = require("express")
const dotenv = require("dotenv").config()
const userModel = require("../models/user.js")
const nodemailer = require("nodemailer")
const { randomBytes } = require("crypto");

const router = express.Router()

router.post("/register", async (req, res) => {
    try {
        const newUser = await userModel({ ...req.body })
        await newUser.save()
        res.send("User Registered Successfully")
    }
    catch (error) {
        res.status(400).json(error)
    }
})


router.post("/reset-password", async (req, res) => {
    try {
        const existinguser = await userModel.findOne({ email: req.body.email });

        if (!existinguser) {
            return res.status(400).json({ message: "User not found" });
        }

        const resetToken = gentoken();

        existinguser.verificationcode = resetToken;
        await existinguser.save();

        genemail(res,existinguser.email, resetToken);

    }
    catch (error) {
        res.status(400).json(error)
    }
})

router.get("/reset-password/:token", async (req, res) => {
    try {
        const resetToken = req.params.token;
        const user = await userModel.findOne({ verificationcode: resetToken });

        if (!user) {
            return res.status(400).json({ message: "Reset link has been sent to the registered Email" });
        }
        console.log("User found:", user);
        //res.json({user,token:resetToken});
        res.render("PasswordResetForm", { token: resetToken });
    } catch (error) {
        console.error("Error during password reset verification:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

router.post("/reset-password/:token", async (req, res) => {
    try {
        const resetToken = req.params.token;
        const newPassword = req.body.newPassword;
        const user = await userModel.findOne({ verificationcode: resetToken });
        console.log('New Password:', newPassword);
        console.log('Request Body:', req.body); 
        if (!user) {
            return res.status(400).json({ message: "Invalid reset token" });
        }
        console.log("User found:", user);
        user.password = newPassword;
        user.verificationcode = undefined;
        await user.save();
        console.log("User Updated:", user);
        res.send("Password reset successfull")

    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

function gentoken() {
    return randomBytes(20).toString("hex");
}

function genemail(res,useremail, token) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "trlaleth@gmail.com",
            pass: "whdspmxunlfdfwxh",
        },
    });

    const mailOptions = {
        from: "lalethsury98@gmail.com",
        to: useremail,
        subject: "Password Reset",
        text: `Click the following link to reset your password: https://password-rest-mab9.onrender.com/users/reset-password/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            res.status(500).json({ message: "Error sending email" });
        } else {
            console.log("Email sent:", info.response);
            res.send("Password reset email sent successfully");
        }
    });
}

module.exports = router
