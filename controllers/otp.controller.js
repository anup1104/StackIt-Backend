// controllers/otpController.js
const otpGenerator = require("otp-generator");
const OTP = require("../models/otp.model");
const User = require("../models/user.model");
const mailSender = require("../utils/mailSender");

/**
 * 🐬 POST /send-otp
 * 📧 Sends OTP to user's email for registration
 * 📦 Expects: email in request body
 * 🎯 Generates unique 6-digit OTP and saves it
 * ⚠️ Returns:
 *    - 200: Success with OTP
 *    - 401: User already registered
 *    - 500: Server error
 */
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        // Check if user is already present
        const checkUserPresent = await User.findOne({ email });
        // If user found with provided email
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User is already registered",
            });
        }
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            });
            result = await OTP.findOne({ otp: otp });
        }
        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);

        try {
            const mailResponse = await mailSender(
                1,
                email,
                "OTP for Email Verification",
                `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>OTP Verification</title>
          </head>
          <body
            style="
              margin: 0;
              padding: 0;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f9f9f9;
              color: #333333;
              font-size: 16px;
              line-height: 1.6;
            "
          >
            <div
              style="
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
              "
            >
              <main style="padding: 20px 0;">
                <p style="margin: 0 0 15px 0;">
                  Please use the following OTP to complete your email verification process:
                </p>
        
                <div
                  style="
                    margin: 30px auto;
                    padding: 15px 25px;
                    background-color: #f0f4ff;
                    border-radius: 6px;
                    text-align: center;
                    display: inline-block;
                    font-size: 32px;
                    font-weight: bold;
                    color: #6a0dad;
                    letter-spacing: 4px;
                  "
                >
                  ${otp}
                </div>
        
                <p style="margin: 20px 0 0 0; font-size: 14px; color: #555;">
                  This OTP is valid for <strong>60 seconds</strong> only. Do not share this code with anyone for security reasons.
                </p>
              </main>
        
              <footer style="padding-top: 15px; border-top: 1px solid #eeeeee; text-align: center; font-size: 12px; color: #999;">
                <p style="margin: 0;">
                  Need help? Contact us at 
                  <a href="mailto:support@klezy.com" style="color: #6a0dad; text-decoration: none;">support@klezy.com</a>
                </p>
                <p style="margin: 8px 0 0;">© 2025 Klezy by Clezid. All rights reserved.</p>
              </footer>
            </div>
          </body>
        </html>
        `
            );
            // alert("Email sent successfully: ", mailResponse);
            console.log(mailResponse);
        } catch (error) {
            console.log("Error occurred while sending email: ", error);
            throw error;
        }
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * 🐬 POST /change-password/send-otp
 * 🔑 Sends OTP for password reset
 * 📦 Expects: email in request body
 * 🎯 Generates unique 6-digit OTP and saves it
 * ⚠️ Returns:
 *    - 200: Success with OTP sent message
 *    - 404: User not found
 *    - 500: Server error
 */
exports.sendOTPforNewPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Check if user is already present
        const checkUserPresent = await User.findOne({ email });
        // If user found with provided email
        if (!checkUserPresent) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exists",
            });
        }
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            });
            result = await OTP.findOne({ otp: otp });
        }
        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);
        try {
            const mailResponse = await mailSender(
                1,
                email,
                "Reset Password Verification Email",
                `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>OTP Verification</title>
          </head>
          <body
            style="
              margin: 0;
              padding: 0;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f9f9f9;
              color: #333333;
              font-size: 16px;
              line-height: 1.6;
            "
          >
            <div
              style="
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
              "
            >
              <main style="padding: 20px 0;">
                <p style="margin: 0 0 15px 0;">
                  Please use the following OTP to reset your password:
                </p>
        
                <div
                  style="
                    margin: 30px auto;
                    padding: 15px 25px;
                    background-color: #f0f4ff;
                    border-radius: 6px;
                    text-align: center;
                    display: inline-block;
                    font-size: 32px;
                    font-weight: bold;
                    color: #6a0dad;
                    letter-spacing: 4px;
                  "
                >
                  ${otp}
                </div>
        
                <p style="margin: 20px 0 0 0; font-size: 14px; color: #555;">
                  This OTP is valid for <strong>60 seconds</strong> only. Do not share this code with anyone for security reasons.
                </p>
              </main>
        
              <footer style="padding-top: 15px; border-top: 1px solid #eeeeee; text-align: center; font-size: 12px; color: #999;">
                <p style="margin: 0;">
                  Need help? Contact us at 
                  <a href="mailto:support@klezy.com" style="color: #6a0dad; text-decoration: none;">support@klezy.com</a>
                </p>
                <p style="margin: 8px 0 0;">© 2025 Klezy by Clezid. All rights reserved.</p>
              </footer>
            </div>
          </body>
        </html>
        `
            );
            // alert("Email sent successfully: ", mailResponse);
            console.log(mailResponse);
        } catch (error) {
            console.log("Error occurred while sending email: ", error);
            throw error;
        }
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * 🐬 POST /verify-otp
 * ✅ Verifies OTP for email
 * 📦 Expects:
 *    - email in request body
 *    - otp in request body
 * 🎯 Validates OTP against most recent one
 * ⚠️ Returns:
 *    - 200: Success with verification message
 *    - 400: Invalid OTP
 *    - 500: Server error
 */
exports.verifyEmailOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const response = await OTP.find({ email })
            .sort({ createdAt: -1 })
            .limit(1);
        if (response.length === 0 || otp !== response[0].otp) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "OTP verified!",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
