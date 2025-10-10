// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const authRoutes = require('./routes/auth');
// const vendorRoutes = require('./routes/vendors');

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// // DB connection
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('MongoDB Connected'))
//     .catch(err => console.log(err));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/vendors', vendorRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const authRoutes = require('./routes/auth');
// const vendorRoutes = require('./routes/vendors');

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Root route (for test)
// app.get('/', (req, res) => {
//   res.send('✅ Local Hunt backend is running');
// });

// // DB connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('✅ MongoDB Connected'))
// .catch(err => console.error('❌ MongoDB connection error:', err));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/vendors', vendorRoutes);

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const authRoutes = require('./routes/auth');
// const vendorRoutes = require('./routes/vendors');
// dotenv.config();
// const app = express();
// // Middleware
// app.use(cors());
// app.use(express.json());
// app.get('/', (req, res) => {
//     res.send('✅ Local Hunt backend is running');
// });

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then(() => console.log('✅ MongoDB Connected'))
//     .catch(err => console.error('❌ MongoDB connection error:', err));

// app.use('/api/auth', authRoutes);
// app.use('/api/vendors', vendorRoutes);
// console.log('✅ Vendors route mounted at /api/vendors');

// app.use((req, res) => {
//     res.status(404).json({ error: '❌ Route not found' });
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`✅ Server running on port ${PORT}`);
// });
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const authRoutes = require('./routes/auth');
// const vendorRoutes = require('./routes/vendors');
// const errorHandler = require('./middleware/errorHandler'); // 🔧 new

// dotenv.config();

// const app = express();

// // ✅ Middleware
// app.use(cors());
// app.use(express.json());

// // ✅ Test route
// app.get('/', (req, res) => {
//     res.send('✅ Local Hunt backend is running');
// });

// // ✅ MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log('✅ MongoDB Connected'))
//     .catch(err => {
//         console.error('❌ MongoDB connection error:', err.message);
//         process.exit(1); // stop server if DB fails
//     });

// // ✅ Routes
// app.use('/api/auth', authRoutes);
// console.log('✅ Auth route mounted at /api/auth');

// app.use('/api/vendors', vendorRoutes);
// console.log('✅ Vendors route mounted at /api/vendors');

// // ✅ 404 handler
// app.use((req, res, next) => {
//     res.status(404).json({ error: '❌ Route not found' });
// });

// // ✅ Global error handler
// app.use(errorHandler);

// // ✅ Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`✅ Server running on port ${PORT}`);
// });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendors');
const categoriesRoutes = require('./routes/categories'); // 🆕 categories
const chatRoutes = require('./routes/chat'); // 🆕 chat
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
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // mobile apps/postman
        if (allowedOrigins.has(origin)) return callback(null, true);
        if (/^http:\/\/(localhost|127\.0\.0\.1|\[::1\]):(5173|8080)$/.test(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS not allowed for origin: ${origin}`));
    },
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

