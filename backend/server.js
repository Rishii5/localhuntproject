const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendors');
const categoriesRoutes = require('./routes/categories'); // 🆕 categories
const chatRoutes = require('./routes/chat'); // 🆕 chat
const dashboardRoutes = require('./routes/dashboard'); // 🆕 dashboard
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// ======================
// 🔧 Middleware
// ======================
const allowedOrigins = new Set([
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:5173",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:5173",
    "http://[::1]:8080",
    "http://[::1]:5173",
]);

const corsOptions = {
    origin: true,   // allows requests from any origin
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ======================
// 🔧 Test Route
// ======================
app.get('/', (req, res) => {
    res.send('✅ Local Hunt backend is running');
});

// ======================
// 🔧 MongoDB Connection
// ======================
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1); // stop server if DB fails
    });

// ======================
// 🔧 API Routes
// ======================
app.use('/api/auth', authRoutes);
console.log('✅ Auth route mounted at /api/auth');

app.use('/api/vendors', vendorRoutes);
console.log('✅ Vendors route mounted at /api/vendors');

app.use('/api/categories', categoriesRoutes); // 🆕 add categories
console.log('✅ Categories route mounted at /api/categories');

app.use('/api/chat', chatRoutes); // 🆕 mount chat
console.log('✅ Chat route mounted at /api/chat');

app.use('/api/dashboard', require('./routes/dashboard')); // 🆕 mount dashboard
console.log('✅ Dashboard route mounted at /api/dashboard');

app.use('/api/services', require('./routes/services')); // 🆕 mount services
console.log('✅ Services route mounted at /api/services');

app.use('/api/reviews', require('./routes/reviews')); // 🆕 mount reviews
console.log('✅ Reviews route mounted at /api/reviews');

// ======================
// 🔧 404 Handler
// ======================
app.use((req, res, next) => {
    res.status(404).json({ error: '❌ Route not found' });
});

// ======================
// 🔧 Global Error Handler
// ======================
app.use(errorHandler);

// ======================
// 🔧 Start Server
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
