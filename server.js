const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// MongoDB Integration
const { connectDB, User, Team, Task, Message } = require('./database');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Database connection
let useDatabase = false;

// Try to connect to MongoDB
connectDB().then((result) => {
    if (result === true) {
        useDatabase = true;
        console.log('🚀 Using MongoDB Cloud Database for data persistence');
    } else {
        console.log('💾 Using in-memory storage (MongoDB connection failed)');
    }
}).catch(() => {
    console.log('💾 Using in-memory storage (MongoDB connection failed)');
});

// In-memory storage fallback
let users = [];
let teams = [];
let tasks = [];
let messages = [];

// Generate unique team code
function generateTeamCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Hybrid database functions
const findUser = async (query) => {
    if (useDatabase) {
        return await User.findOne(query);
    } else {
        return users.find(u => u.name === query.name);
    }
};

const createUser = async (userData) => {
    if (useDatabase) {
        const user = new User(userData);
        await user.save();
        return { ...user.toObject(), id: user._id };
    } else {
        const user = { id: Date.now(), ...userData };
        users.push(user);
        return user;
    }
};

const updateUser = async (userId, updateData) => {
    if (useDatabase) {
        await User.findByIdAndUpdate(userId, updateData);
    } else {
        const user = users.find(u => u.id == userId);
        if (user) Object.assign(user, updateData);
    }
};

const createTeam = async (teamData) => {
    if (useDatabase) {
        const team = new Team(teamData);
        await team.save();
        return { ...team.toObject(), id: team._id };
    } else {
        const team = { id: Date.now(), ...teamData };
        teams.push(team);
        return team;
    }
};

const findTeam = async (query) => {
    if (useDatabase) {
        return await Team.findOne(query);
    } else {
        return teams.find(t => t.code === query.code);
    }
};

const saveMessage = async (messageData) => {
    if (useDatabase) {
        const message = new Message(messageData);
        await message.save();
        return { ...message.toObject(), id: message._id };
    } else {
        const message = { id: Date.now(), ...messageData };
        messages.push(message);
        return message;
    }
};

const getMessages = async (teamId) => {
    if (useDatabase) {
        const teamMessages = await Message.find({ teamId }).sort({ timestamp: 1 });
        return teamMessages.map(m => ({ ...m.toObject(), id: m._id }));
    } else {
        return messages.filter(m => m.teamId == teamId);
    }
};

// Routes
app.post('/api/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        let user = await findUser({ name });

        if (!user) {
            return res.json({ success: false, message: 'User not found. Please sign up first.' });
        }

        // Check password
        if (useDatabase) {
            if (user.password !== password) {
                return res.json({ success: false, message: 'Invalid password' });
            }
            user = { ...user.toObject(), id: user._id };
        } else {
            if (user.password !== password) {
                return res.json({ success: false, message: 'Invalid password' });
            }
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('Login error:', error);
        res.json({ success: false, message: 'Login failed' });
    }
});

app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await findUser({ name });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists. Please sign in instead.' });
        }

        // Create new user
        const user = await createUser({
            name,
            email: email || '',
            password,
            teamId: null,
            createdAt: new Date()
        });

        res.json({ success: true, user });
    } catch (error) {
        console.error('Signup error:', error);
        res.json({ success: false, message: 'Signup failed' });
    }
});

app.post('/api/create-team', async (req, res) => {
    try {
        const { teamName, userId } = req.body;
        const teamCode = generateTeamCode();

        const team = await createTeam({
            name: teamName,
            code: teamCode,
            leaderId: userId,
            members: [userId]
        });

        // Update user's team
        await updateUser(userId, { teamId: team.id });

        res.json({ success: true, team });
    } catch (error) {
        console.error('Create team error:', error);
        res.json({ success: false, message: 'Failed to create team' });
    }
});

app.post('/api/join-team', async (req, res) => {
    try {
        const { teamCode, userId } = req.body;
        const team = await findTeam({ code: teamCode });

        if (!team) {
            return res.json({ success: false, message: 'Invalid team code' });
        }

        if (!team.members.includes(userId)) {
            if (useDatabase) {
                team.members.push(userId);
                await team.save();
            } else {
                team.members.push(userId);
            }
        }

        // Update user's team
        await updateUser(userId, { teamId: team.id || team._id });

        const teamData = useDatabase ? { ...team.toObject(), id: team._id } : team;
        res.json({ success: true, team: teamData });
    } catch (error) {
        console.error('Join team error:', error);
        res.json({ success: false, message: 'Failed to join team' });
    }
});

app.get('/api/team/:teamId', async (req, res) => {
    try {
        if (useDatabase) {
            const team = await Team.findById(req.params.teamId);
            if (!team) return res.json({ success: false });

            const members = await User.find({ _id: { $in: team.members } });
            const teamData = { ...team.toObject(), id: team._id };
            const membersData = members.map(m => ({ ...m.toObject(), id: m._id }));

            res.json({ success: true, team: teamData, members: membersData });
        } else {
            const team = teams.find(t => t.id == req.params.teamId);
            if (!team) return res.json({ success: false });

            const members = users.filter(u => team.members.includes(u.id));
            res.json({ success: true, team, members });
        }
    } catch (error) {
        console.error('Get team error:', error);
        res.json({ success: false });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        if (useDatabase) {
            const task = new Task(req.body);
            await task.save();
            const taskData = { ...task.toObject(), id: task._id };

            // Emit real-time update to team members
            if (task.teamId) {
                io.to(`team-${task.teamId}`).emit('task-updated', { type: 'added', task: taskData });
            }

            res.json({ success: true, task: taskData });
        } else {
            const task = {
                id: Date.now(),
                ...req.body,
                createdAt: new Date()
            };
            tasks.push(task);

            // Emit real-time update to team members
            if (task.teamId) {
                io.to(`team-${task.teamId}`).emit('task-updated', { type: 'added', task });
            }

            res.json({ success: true, task });
        }
    } catch (error) {
        console.error('Create task error:', error);
        res.json({ success: false, message: 'Failed to create task' });
    }
});

app.get('/api/tasks/:userId', async (req, res) => {
    try {
        if (useDatabase) {
            const userTasks = await Task.find({ userId: req.params.userId });
            const tasksData = userTasks.map(t => ({ ...t.toObject(), id: t._id }));
            res.json({ success: true, tasks: tasksData });
        } else {
            const userTasks = tasks.filter(t => t.userId == req.params.userId);
            res.json({ success: true, tasks: userTasks });
        }
    } catch (error) {
        console.error('Get user tasks error:', error);
        res.json({ success: false, tasks: [] });
    }
});

app.get('/api/tasks/team/:teamId', async (req, res) => {
    try {
        if (useDatabase) {
            const teamTasks = await Task.find({ teamId: req.params.teamId });
            const tasksData = teamTasks.map(t => ({ ...t.toObject(), id: t._id }));
            res.json({ success: true, tasks: tasksData });
        } else {
            const teamTasks = tasks.filter(t => t.teamId == req.params.teamId);
            res.json({ success: true, tasks: teamTasks });
        }
    } catch (error) {
        console.error('Get team tasks error:', error);
        res.json({ success: false, tasks: [] });
    }
});

app.put('/api/tasks/:taskId', async (req, res) => {
    try {
        console.log('Updating task:', req.params.taskId, 'with data:', req.body);

        if (useDatabase) {
            const task = await Task.findByIdAndUpdate(
                req.params.taskId,
                req.body,
                { new: true }
            );

            if (task) {
                console.log('Task updated to status:', task.status);
                const taskData = { ...task.toObject(), id: task._id };

                // Emit real-time update to team members
                if (task.teamId) {
                    io.to(`team-${task.teamId}`).emit('task-updated', {
                        type: 'updated',
                        task: taskData
                    });
                }

                res.json({ success: true, task: taskData });
            } else {
                console.log('Task not found with ID:', req.params.taskId);
                res.json({ success: false });
            }
        } else {
            const taskIndex = tasks.findIndex(t => t.id == req.params.taskId);
            console.log('Found task at index:', taskIndex);

            if (taskIndex !== -1) {
                const oldTask = { ...tasks[taskIndex] };
                tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
                console.log('Task updated from:', oldTask.status, 'to:', tasks[taskIndex].status);

                // Emit real-time update to team members
                if (tasks[taskIndex].teamId) {
                    io.to(`team-${tasks[taskIndex].teamId}`).emit('task-updated', {
                        type: 'updated',
                        task: tasks[taskIndex]
                    });
                }

                res.json({ success: true, task: tasks[taskIndex] });
            } else {
                console.log('Task not found with ID:', req.params.taskId);
                console.log('Available task IDs:', tasks.map(t => t.id));
                res.json({ success: false });
            }
        }
    } catch (error) {
        console.error('Update task error:', error);
        res.json({ success: false });
    }
});

app.post('/api/leave-team', (req, res) => {
    const { userId } = req.body;
    const user = users.find(u => u.id === userId);

    if (user && user.teamId) {
        const team = teams.find(t => t.id === user.teamId);
        if (team) {
            team.members = team.members.filter(m => m !== userId);
            user.teamId = null;
        }
    }

    res.json({ success: true });
});

app.delete('/api/team/:teamId', async (req, res) => {
    try {
        if (useDatabase) {
            const team = await Team.findById(req.params.teamId);
            if (team) {
                // Remove all tasks associated with this team
                await Task.deleteMany({ teamId: team._id });

                // Remove all messages associated with this team
                await Message.deleteMany({ teamId: team._id });

                // Remove team from all users
                await User.updateMany(
                    { teamId: team._id },
                    { teamId: null }
                );

                await Team.findByIdAndDelete(req.params.teamId);
                console.log(`🗑️ Deleted team ${team.name} and all associated tasks/messages from MongoDB`);
            }
        } else {
            const teamIndex = teams.findIndex(t => t.id == req.params.teamId);
            if (teamIndex !== -1) {
                const team = teams[teamIndex];

                // Remove all tasks associated with this team
                tasks = tasks.filter(task => task.teamId !== team.id);

                // Remove all messages associated with this team
                messages = messages.filter(message => message.teamId !== team.id);

                // Remove team from all users
                users.forEach(user => {
                    if (user.teamId === team.id) {
                        user.teamId = null;
                    }
                });

                teams.splice(teamIndex, 1);
                console.log(`🗑️ Deleted team ${team.name} and all associated tasks/messages`);
            }
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Delete team error:', error);
        res.json({ success: false });
    }
});

app.put('/api/team/:teamId', (req, res) => {
    const team = teams.find(t => t.id == req.params.teamId);
    if (team) {
        team.name = req.body.name;
        res.json({ success: true, team });
    } else {
        res.json({ success: false });
    }
});

// Socket.io for chat and real-time sync
io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    socket.on('join-team-chat', (teamId) => {
        socket.join(`team-${teamId}`);
        console.log(`👥 User ${socket.id} joined team-${teamId} for chat`);
    });

    socket.on('join-team-sync', (teamId) => {
        socket.join(`team-${teamId}`);
        console.log(`🔄 User ${socket.id} joined team-${teamId} for sync`);
    });

    socket.on('send-message', async (data) => {
        try {
            console.log('💬 Received message:', data);

            const messageData = {
                message: data.message,
                userId: data.userId,
                userName: data.userName,
                teamId: data.teamId,
                timestamp: new Date()
            };

            const message = await saveMessage(messageData);

            console.log('📤 Emitting message to team-' + data.teamId);

            // Emit to all users in the team room
            io.to(`team-${data.teamId}`).emit('new-message', message);

            // Also emit back to sender to confirm
            socket.emit('message-sent', message);

        } catch (error) {
            console.error('❌ Error processing message:', error);
            socket.emit('message-error', { error: 'Failed to send message' });
        }
    });

    socket.on('get-messages', async (teamId) => {
        try {
            console.log('📋 Getting messages for team:', teamId);
            const teamMessages = await getMessages(teamId);
            console.log(`📨 Sending ${teamMessages.length} messages to client`);
            socket.emit('messages-history', teamMessages);
        } catch (error) {
            console.error('❌ Error fetching messages:', error);
            socket.emit('messages-history', []);
        }
    });

    // Real-time task sync
    socket.on('task-added', (data) => {
        console.log('➕ Task added, broadcasting to team:', data.teamId);
        io.to(`team-${data.teamId}`).emit('task-updated', data);
    });

    socket.on('task-moved', (data) => {
        console.log('🔄 Task moved, broadcasting to team:', data.teamId);
        io.to(`team-${data.teamId}`).emit('task-updated', data);
    });

    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend should connect to http://localhost:${PORT}`);
});