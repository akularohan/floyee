# 🚀 Flowy - Startup Guide

## Quick Start

### Option 1: PowerShell Script (Recommended)

```powershell
.\start.ps1
```

### Option 2: Batch File

```cmd
.\clean-start.bat
```

### Option 3: Manual Start

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
cd client
npm start
```

## 📍 Application URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000

## 🎯 Features Overview

### ✅ Core Features

- **Beautiful Home Page** - Welcome screen with animated cards
- **User Authentication** - Simple login/signup system
- **Kanban Board** - Drag tasks between columns with arrow buttons
- **Task Management** - Add tasks with time estimates (minutes/hours/days/weeks)
- **Team Collaboration** - Create/join teams with unique codes
- **Real-time Chat** - Team members can chat instantly
- **Time Tracking** - Shows total estimated time for all tasks

### 🎨 UI/UX Features

- **Modern Design** - Purple gradient theme with smooth animations
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Arrow Navigation** - Move tasks left/right with arrow buttons
- **Click-to-Top** - Click "Flowy" title to scroll to top
- **Team Permissions** - Leaders can delete teams, members can leave
- **Professional Footer** - "Made with ❤️ by Rohan Akula"

### 🔧 Technical Features

- **React Frontend** - Modern component-based architecture
- **Node.js Backend** - Express server with Socket.io for real-time features
- **In-Memory Storage** - Ready for MongoDB integration
- **CORS Enabled** - Proper cross-origin resource sharing
- **Error Handling** - Graceful error management

## 🎮 How to Use

1. **Start the App** - Run `.\start.ps1`
2. **Visit Homepage** - Go to http://localhost:3000
3. **Get Started** - Click "Get Started" button
4. **Login/Signup** - Enter name and password
5. **Add Tasks** - Use left sidebar to add tasks with time estimates
6. **Move Tasks** - Click arrow buttons to move tasks between columns
7. **Collaborate** - Click "Collaborate" to create or join teams
8. **Team Features** - Use chat, view members, manage team

## 🛠️ Development Notes

- **Port Configuration**: Backend runs on 8000, Frontend on 3000
- **Hot Reload**: Both frontend and backend support hot reloading
- **Code Structure**: Clean separation of concerns
- **Styling**: Modern CSS with gradients and animations
- **Accessibility**: Focus indicators and keyboard navigation

## 🔮 Future Enhancements

- MongoDB integration for persistent data
- JWT authentication
- File attachments for tasks
- Due dates and notifications
- Advanced team permissions
- Dark mode support
- Mobile app version

---

**Made with ❤️ by Rohan Akula**
