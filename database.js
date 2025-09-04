const mongoose = require('mongoose');

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect('your_MonogDB_key', {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 5,
            maxIdleTimeMS: 30000,
            bufferCommands: false
        });
        console.log('✅ MongoDB Connected Successfully to Cloud Database');
        return true;
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.log('⚠️  Falling back to in-memory storage...');
        return false;
    }
};

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, default: '' },
    password: { type: String, required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    createdAt: { type: Date, default: Date.now }
});

// Team Schema
const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

// Task Schema
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    priority: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    status: { type: String, enum: ['todo', 'process', 'completed'], default: 'todo' },
    estimatedTime: { type: Number, default: 30 },
    timeUnit: { type: String, enum: ['minutes', 'hours', 'days', 'weeks'], default: 'minutes' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    createdAt: { type: Date, default: Date.now }
});

// Message Schema
const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    timestamp: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Team = mongoose.model('Team', teamSchema);
const Task = mongoose.model('Task', taskSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = {
    connectDB,
    User,
    Team,
    Task,
    Message
};

// To enable MongoDB, uncomment the following in server.js:
// const { connectDB, User, Team, Task, Message } = require('./database');
// connectDB();
