// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- MOCK DATABASE ---
let users = [];
let orders = [];
const products = [
    { id: 1, name: "Premium Wireless Headphones", price: 199.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60" },
    { id: 2, name: "Smart Watch Series 5", price: 249.50, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60" },
    { id: 3, name: "Ergonomic Office Chair", price: 120.00, image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&auto=format&fit=crop&q=60" },
    { id: 4, name: "Mechanical Keyboard", price: 89.99, image: "https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=500&auto=format&fit=crop&q=60" },
    { id: 5, name: "Gaming Mouse", price: 55.00, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60" },
    { id: 6, name: "4K Monitor 27-inch", price: 300.00, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60" }
];

// --- ROUTES ---

// 1. Register
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.json({ success: false, message: "User already exists" });
    }
    users.push({ username, password });
    res.json({ success: true, message: "Registration successful!" });
});

// 2. Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ success: true, username: user.username });
    } else {
        res.json({ success: false, message: "Invalid credentials" });
    }
});

// 3. Get Products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// 4. Place Order
app.post('/api/orders', (req, res) => {
    const { username, items, total } = req.body;
    const newOrder = { id: orders.length + 1, username, items, total, date: new Date() };
    orders.push(newOrder);
    res.json({ success: true, orderId: newOrder.id });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});