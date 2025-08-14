# 🚀 Flowy - Professional Task Management App

<div align="center">

![Flowy Logo](https://img.shields.io/badge/Flowy-Task%20Management-8b5cf6?style=for-the-badge&logo=trello&logoColor=white)

**A sleek and powerful task management solution I built for modern teams**

[![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-06b6d4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7+-010101?style=flat&logo=socket.io)](https://socket.io/)

</div>

## ✨ Features

### 🎯 **Core Functionality**

- **Modern Kanban Board** - Drag tasks between To Do, In Progress, and Done
- **Real-time Collaboration** - See team changes instantly
- **Task Time Tracking** - Estimate time in minutes, hours, days, or weeks
- **Team Management** - Create teams, invite members, real-time chat
- **Professional UI** - Built with Tailwind CSS for a polished look

### 🔄 **Real-time Features**

- **Live Task Updates** - Team members see changes immediately
- **Instant Chat** - Real-time messaging with team members
- **Synchronized Board** - All team members stay in sync

### 🎨 **Modern Design**

- **Professional Interface** - Clean, modern design with smooth animations
- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile
- **Glass Morphism** - Modern UI effects and gradients
- **Intuitive Navigation** - Easy-to-use interface with clear visual hierarchy

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation & Setup

1. **Clone or download the project**
2. **Run the startup script:**

```powershell
# Windows PowerShell (Recommended)
.\start-flowy.ps1

# Alternative methods:
.\start.ps1
# or
.\clean-start.bat
```

3. **Manual setup (if scripts don't work):**

```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Start backend (Terminal 1)
npm run server

# Start frontend (Terminal 2)
cd client && npm start
```

### 🌐 Access the App

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000

## 📱 How to Use

### 1. **Getting Started**

- Visit the homepage and click "Get Started"
- Enter any name and password to create an account
- You'll be taken to your personal Kanban board

### 2. **Managing Tasks**

- Use the left sidebar to add new tasks
- Set priority levels (Easy, Medium, Hard)
- Add time estimates with flexible units
- Click arrow buttons to move tasks between columns

### 3. **Team Collaboration**

- Click "Collaborate" in the header
- **Create Team:** Generate a unique code to share
- **Join Team:** Enter a team code to join existing team
- Real-time sync keeps everyone updated

### 4. **Team Features**

- **Chat:** Click the chat button for real-time messaging
- **Members:** View all team members and their roles
- **Management:** Leaders can edit team name and delete teams
- **Permissions:** Members can leave teams, leaders can delete

## 🏗️ Architecture

### **Frontend (React + Tailwind CSS)**

```
client/
├── src/
│   ├── components/
│   │   ├── HomePage.js          # Landing page with animations
│   │   ├── LoginPage.js         # Authentication
│   │   ├── KanbanPage.js        # Personal task board
│   │   ├── TeamPage.js          # Team collaboration board
│   │   ├── CollaboratePage.js   # Team creation/joining
│   │   └── ErrorBoundary.js     # Error handling
│   ├── App.js                   # Main app component
│   └── index.css               # Tailwind CSS styles
```

### **Backend (Node.js + Express + Socket.io)**

```
server.js                        # Main server file
├── REST API endpoints           # User, team, and task management
├── Socket.io handlers          # Real-time features
└── In-memory storage          # Ready for database integration
```

## 🎨 Design System

### **Color Palette**

- **Primary:** Purple gradient (#8b5cf6 to #7c3aed)
- **Success:** Green (#10b981)
- **Warning:** Orange (#f59e0b)
- **Error:** Red (#ef4444)
- **Neutral:** Gray scale for text and backgrounds

### **Components**

- **Cards:** Rounded corners with subtle shadows
- **Buttons:** Gradient backgrounds with hover effects
- **Inputs:** Clean borders with focus states
- **Modals:** Glass morphism effects

## 🔧 Technical Details

### **Dependencies**

```json
{
  "backend": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "cors": "^2.8.5"
  },
  "frontend": {
    "react": "^18.2.0",
    "tailwindcss": "^3.0+",
    "socket.io-client": "^4.7.2",
    "axios": "^1.0+"
  }
}
```

### **API Endpoints**

- `POST /api/login` - User authentication
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task status
- `POST /api/create-team` - Create new team
- `POST /api/join-team` - Join existing team
- `GET /api/team/:id` - Get team details

### **Socket Events**

- `task-added` - New task created
- `task-moved` - Task status changed
- `send-message` - Chat message sent
- `new-message` - Chat message received

## 🚀 Future Enhancements

### **Planned Features**

- [ ] MongoDB integration for persistent storage
- [ ] JWT authentication with secure sessions
- [ ] File attachments for tasks
- [ ] Due dates and notifications
- [ ] Advanced team permissions and roles
- [ ] Dark mode support
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Task templates and automation
- [ ] Analytics and reporting

### **Technical Improvements**

- [ ] Database migration scripts
- [ ] Docker containerization
- [ ] CI/CD pipeline setup
- [ ] Unit and integration tests
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] PWA capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing frontend framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Socket.io** - For real-time communication
- **Heroicons** - For beautiful SVG icons

---

<div align="center">

**Made with ❤️ by Rohan**

[⭐ Star this repo](https://github.com/akularohan/Flowy---Professional-Task-Management-App-with-Real-time-Collaboration) | [🐛 Report Bug](https://github.com/akularohan/Flowy---Professional-Task-Management-App-with-Real-time-Collaboration/issues) | [💡 Request Feature](https://github.com/akularohan/Flowy---Professional-Task-Management-App-with-Real-time-Collaboration/issues)

</div>
