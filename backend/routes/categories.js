const express = require("express");
const router = express.Router();

// Sample categories (later you can fetch from DB)
router.get("/", (req, res) => {
    res.json([
        { name: "Restaurants", count: "2500+", description: "Best dining experiences", color: "from-orange-400 to-red-500" },
        { name: "Hotels", count: "800+", description: "Comfortable stays", color: "from-blue-400 to-purple-500" },
        { name: "Shopping", count: "1200+", description: "Top retail stores", color: "from-pink-400 to-purple-500" },
    ]);
});

module.exports = router;
