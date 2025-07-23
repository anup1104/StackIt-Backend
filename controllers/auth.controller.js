const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { comparePassword, hashPassword } = require("../utils/validator");

exports.signup = async (req, res) => {
	const { email, password, username, profile_image, name } = req.body;

	try {
		const hashedPassword = await hashPassword(password);
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User with this email already exists!",
			});
		}
		const user = new User({
			email,
			password: hashedPassword,
			username,
			profile_image,
			name,
		});
		await user.save();

		const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
			expiresIn: "1h",
		});

		return res.status(201).json({
			success: true,
			message: "User created successfully",
			token,
			user: {
				id: user._id,
				email: user.email,
				username: user.username,
				profile_image: user.profile_image,
				name: user.name,
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Error creating user!",
		});
	}
};

exports.login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user || !(await comparePassword(password, user.password))) {
			return res.status(401).json({
				success: false,
				message: "Invalid email or password!",
			});
		}

		const token = jwt.sign(
			{ id: user._id, email: user.email },
			process.env.TOKEN_SECRET,
			{
				expiresIn: "1h",
			}
		);

		return res.status(200).json({
			success: true,
			message: "Login successful",
			token,
			user: {
				id: user._id,
				email: user.email,
				username: user.username,
				profile_image: user.profile_image,
				name: user.name,
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Error logging in!",
		});
	}
};

exports.logout = (req, res) => {
	res.clearCookie("Authorization");
	return res.status(200).json({
		success: true,
		message: "Logged out successfully",
	});
};
