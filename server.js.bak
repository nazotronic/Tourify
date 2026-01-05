const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3254;
const DB_PATH = path.join(__dirname, 'database.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Database helper functions
async function readDB() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return default structure
        return {
            users: [],
            tours: [],
            adminPassword: await bcrypt.hash('admin123', 10) // default admin password
        };
    }
}

async function writeDB(data) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Initialize database on server start
async function initDB() {
    try {
        await fs.access(DB_PATH);
        console.log('Database file exists');
    } catch {
        console.log('Creating new database file...');
        const initialData = {
            users: [],
            tours: [],
            adminPassword: await bcrypt.hash('admin123', 10)
        };
        await writeDB(initialData);
        console.log('Database initialized with default admin password: admin123');
    }
}

// ============ AUTHENTICATION ENDPOINTS ============

// User Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const db = await readDB();

        // Check if user already exists
        const existingUser = db.users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            email,
            password: hashedPassword,
            fullName: fullName || '',
            role: 'user',
            createdAt: new Date().toISOString(),
            profile: {
                fullName: fullName || '',
                email: email,
                phone: '',
                preferences: {
                    type: [],
                    difficulty: [],
                    budgetFrom: 0,
                    budgetTo: 5000
                }
            },
            favourites: [],
            bookings: [],
            supportMessages: []
        };

        db.users.push(newUser);
        await writeDB(db);

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        res.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const db = await readDB();

        // Find user
        const user = db.users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ------------------------------------------------------------------
// USERS MANAGEMENT (ADMIN)
// ------------------------------------------------------------------
app.get('/api/users', async (req, res) => {
    try {
        const db = await readDB();
        // Return users without passwords
        const users = db.users.map(({ password, ...u }) => u);
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDB();
        const initialLength = db.users.length;
        db.users = db.users.filter(u => u.id !== id);

        if (db.users.length === initialLength) {
            return res.status(404).json({ error: 'User not found' });
        }

        await writeDB(db);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin Login
app.post('/api/auth/admin-login', async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const db = await readDB();

        // Check admin password
        const isValidPassword = await bcrypt.compare(password, db.adminPassword);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        res.json({ success: true, role: 'admin' });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ============ USER ENDPOINTS ============

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDB();

        const user = db.users.find(u => u.id === id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user profile
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const db = await readDB();

        const userIndex = db.users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user data
        db.users[userIndex] = {
            ...db.users[userIndex],
            ...updates,
            id, // Keep original ID
            password: db.users[userIndex].password, // Keep original password
            role: db.users[userIndex].role, // Keep original role
            updatedAt: new Date().toISOString()
        };

        await writeDB(db);

        const { password: _, ...userWithoutPassword } = db.users[userIndex];
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user password
app.put('/api/users/:id/password', async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const db = await readDB();

        const userIndex = db.users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password
        db.users[userIndex] = {
            ...db.users[userIndex],
            password: hashedPassword,
            updatedAt: new Date().toISOString()
        };

        await writeDB(db);

        res.json({ success: true });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ============ TOUR ENDPOINTS ============

// Get all tours
app.get('/api/tours', async (req, res) => {
    try {
        const db = await readDB();
        res.json(db.tours);
    } catch (error) {
        console.error('Get tours error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get tour by ID
app.get('/api/tours/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDB();

        const tour = db.tours.find(t => t.id === id);
        if (!tour) {
            return res.status(404).json({ error: 'Tour not found' });
        }

        res.json(tour);
    } catch (error) {
        console.error('Get tour error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create tour (admin only)
app.post('/api/tours', async (req, res) => {
    try {
        const tourData = req.body;

        const db = await readDB();

        const newTour = {
            ...tourData,
            id: `t-custom-${Date.now()}`,
            createdAt: new Date().toISOString()
        };

        db.tours.push(newTour);
        await writeDB(db);

        res.json(newTour);
    } catch (error) {
        console.error('Create tour error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update tour (admin only)
app.put('/api/tours/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const db = await readDB();

        const tourIndex = db.tours.findIndex(t => t.id === id);
        if (tourIndex === -1) {
            return res.status(404).json({ error: 'Tour not found' });
        }

        db.tours[tourIndex] = {
            ...db.tours[tourIndex],
            ...updates,
            id, // Keep original ID
            updatedAt: new Date().toISOString()
        };

        await writeDB(db);

        res.json(db.tours[tourIndex]);
    } catch (error) {
        console.error('Update tour error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete tour (admin only)
app.delete('/api/tours/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDB();

        const tourIndex = db.tours.findIndex(t => t.id === id);
        if (tourIndex === -1) {
            return res.status(404).json({ error: 'Tour not found' });
        }

        db.tours.splice(tourIndex, 1);
        await writeDB(db);

        res.json({ success: true });
    } catch (error) {
        console.error('Delete tour error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Initialize tours from initial data
app.post('/api/tours/init', async (req, res) => {
    try {
        const { tours } = req.body;
        const db = await readDB();

        // Only initialize if there are no tours
        if (db.tours.length === 0) {
            db.tours = tours;
            await writeDB(db);
            res.json({ success: true, message: 'Tours initialized', count: tours.length });
        } else {
            res.json({ success: true, message: 'Tours already exist', count: db.tours.length });
        }
    } catch (error) {
        console.error('Initialize tours error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ============ BOOKING ENDPOINTS ============

// Get all bookings (admin gets all, users get their own)
app.get('/api/bookings', async (req, res) => {
    try {
        const { userId, isAdmin } = req.query;
        const db = await readDB();

        if (isAdmin === 'true') {
            // Admin gets all bookings from all users
            const allBookings = [];
            db.users.forEach(user => {
                if (user.bookings && Array.isArray(user.bookings)) {
                    user.bookings.forEach(booking => {
                        allBookings.push({
                            ...booking,
                            userId: user.id,
                            userEmail: user.email
                        });
                    });
                }
            });
            res.json(allBookings);
        } else if (userId) {
            // User gets their own bookings
            const user = db.users.find(u => u.id === userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user.bookings || []);
        } else {
            res.status(400).json({ error: 'userId or isAdmin parameter required' });
        }
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
    try {
        const { userId, ...bookingData } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const db = await readDB();

        const userIndex = db.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newBooking = {
            ...bookingData,
            id: `b-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        if (!db.users[userIndex].bookings) {
            db.users[userIndex].bookings = [];
        }

        db.users[userIndex].bookings.push(newBooking);
        await writeDB(db);

        res.json(newBooking);
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update booking status (admin only)
app.put('/api/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const db = await readDB();

        const userIndex = db.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        const bookingIndex = db.users[userIndex].bookings?.findIndex(b => b.id === id);
        if (bookingIndex === -1 || bookingIndex === undefined) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        db.users[userIndex].bookings[bookingIndex].status = status;
        db.users[userIndex].bookings[bookingIndex].updatedAt = new Date().toISOString();

        await writeDB(db);

        res.json(db.users[userIndex].bookings[bookingIndex]);
    } catch (error) {
        console.error('Update booking error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ============ SUPPORT MESSAGE ENDPOINTS ============

// Get all support messages (admin gets all, users get their own)
app.get('/api/support', async (req, res) => {
    try {
        const { userId, isAdmin } = req.query;
        const db = await readDB();

        if (isAdmin === 'true') {
            // Admin gets all messages from all users
            const allMessages = [];
            db.users.forEach(user => {
                if (user.supportMessages && Array.isArray(user.supportMessages)) {
                    user.supportMessages.forEach(message => {
                        allMessages.push({
                            ...message,
                            userId: user.id,
                            userEmail: user.email
                        });
                    });
                }
            });
            res.json(allMessages);
        } else if (userId) {
            // User gets their own messages
            const user = db.users.find(u => u.id === userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user.supportMessages || []);
        } else {
            res.status(400).json({ error: 'userId or isAdmin parameter required' });
        }
    } catch (error) {
        console.error('Get support messages error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Send support message
app.post('/api/support', async (req, res) => {
    try {
        const { userId, message } = req.body;

        if (!userId || !message) {
            return res.status(400).json({ error: 'userId and message are required' });
        }

        const db = await readDB();

        const userIndex = db.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newMessage = {
            id: `msg-${Date.now()}`,
            text: message,
            createdAt: new Date().toISOString(),
            read: false
        };

        if (!db.users[userIndex].supportMessages) {
            db.users[userIndex].supportMessages = [];
        }

        db.users[userIndex].supportMessages.push(newMessage);
        await writeDB(db);

        res.json(newMessage);
    } catch (error) {
        console.error('Send support message error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update support message (mark as read or add reply - admin only)
app.put('/api/support/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, read, reply } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const db = await readDB();

        const userIndex = db.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        const messageIndex = db.users[userIndex].supportMessages?.findIndex(m => m.id === id);
        if (messageIndex === -1 || messageIndex === undefined) {
            return res.status(404).json({ error: 'Message not found' });
        }

        if (read !== undefined) {
            db.users[userIndex].supportMessages[messageIndex].read = read;
        }

        if (reply !== undefined) {
            db.users[userIndex].supportMessages[messageIndex].reply = reply;
        }

        db.users[userIndex].supportMessages[messageIndex].updatedAt = new Date().toISOString();

        await writeDB(db);

        res.json(db.users[userIndex].supportMessages[messageIndex]);
    } catch (error) {
        console.error('Update support message error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ============ FAVOURITES ENDPOINTS ============

// Toggle favourite
app.post('/api/favourites/toggle', async (req, res) => {
    try {
        const { userId, tourId } = req.body;

        if (!userId || !tourId) {
            return res.status(400).json({ error: 'userId and tourId are required' });
        }

        const db = await readDB();

        const userIndex = db.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!db.users[userIndex].favourites) {
            db.users[userIndex].favourites = [];
        }

        const favouriteIndex = db.users[userIndex].favourites.indexOf(tourId);

        if (favouriteIndex > -1) {
            // Remove from favourites
            db.users[userIndex].favourites.splice(favouriteIndex, 1);
        } else {
            // Add to favourites
            db.users[userIndex].favourites.push(tourId);
        }

        await writeDB(db);

        res.json({ favourites: db.users[userIndex].favourites });
    } catch (error) {
        console.error('Toggle favourite error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Database file: ${DB_PATH}`);
    });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
