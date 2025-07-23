const mailSender = async (email, title, body) => {
	try {
		// Create a Transporter to send emails
		let transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			auth: {
				user: "20anuppatel@gmail.com",
				pass: "lwcy xwsh eqwc xlji",
			},
		});
		// Send emails to users
		let info = await transporter.sendMail({
			from: '"StackIt Notifications" <20anuppatel@gmail.com>',
			to: email,
			subject: title,
			html: body,
		});
		console.log("Email info: ", info);
		return info;
	} catch (error) {
		console.log(error.message);
	}
};
