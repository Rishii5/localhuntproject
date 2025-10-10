const axios = require("axios");

async function testLogin() {
    try {
        const response = await axios.post("http://localhost:5000/api/auth/login", {
            email: "sampu@gmail.com",
            password: "Sanjana24"
        });
        console.log("Login successful ✅");
        console.log("Response data:", response.data);
    } catch (error) {
        if (error.response) {
            console.log("Login failed ❌");
            console.log("Status:", error.response.status);
            console.log("Message:", error.response.data.message);
        } else {
            console.log("Error:", error.message);
        }
    }
}

testLogin();
