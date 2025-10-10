const bcrypt = require("bcryptjs");

// 1. Take the plain password from the user
const password = "StrongPass123!";

// 2. Create a salt (extra random string to make hash stronger)
const salt = await bcrypt.genSalt(10);

// 3. Hash the password with the salt
const hashedPassword = await bcrypt.hash(password, salt);

console.log("Plain password:", password);        // 123456
console.log("Hashed password:", hashedPassword); // $2a$10$...
