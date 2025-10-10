const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // adjust path if needed

// Your MongoDB connection string
const MONGO_URI = "mongodb://127.0.0.1:27017/localhunt"; // <-- change db name

async function resetPassword() {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        const email = "sampu@gamil.com"; // user you want to reset
        const newPassword = "Sanjana24";  // <-- set new plain password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const user = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            console.log("User not found!");
        } else {
            console.log(`✅ Password reset for ${email}. New password: ${newPassword}`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error resetting password:", err);
    }
}

resetPassword();
