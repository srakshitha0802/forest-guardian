<div align="center">
  <h1>🌲 Forest Guardian</h1>
  <p><strong>AI-Powered Forest Monitoring & Incident Management System</strong></p>
  <p>Real-time patrol tracking, wildlife monitoring, and emergency response for forest protection</p>
</div>

---

## 📋 Overview

**Forest Guardian** is an intelligent forest monitoring platform designed for forest officers, range officers, and administrators. It provides comprehensive tools for:

- **Real-time Forest Monitoring** via satellite imagery and sensor networks
- **Patrol Management** with GPS tracking and activity logging
- **Incident Detection & Response** for wildlife threats and forest fires
- **Wildlife Database** with field identification guides
- **Emergency Coordination** with multi-channel communication
- **Offline Capabilities** for areas without connectivity
- **AI-Powered Analytics** using Google Gemini API

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Forest Mapping** | Interactive map with real-time patrol positions and incident markers |
| 📱 **Multi-Role Interface** | Tailored dashboards for Forest Officers, Range Officers, and Admins |
| 🚨 **Incident Management** | Track and manage forest fires, poaching, and environmental threats |
| 📹 **Camera Trap Integration** | Monitor wildlife activity and suspicious behavior |
| 🦁 **Wildlife Field Guide** | AI-enhanced species identification and behavior analysis |
| 🎤 **Voice Communication** | Direct audio channel with tactical compass HUD |
| 📊 **Analytics Dashboard** | Real-time metrics, activity heatmaps, and performance reports |
| 🔄 **Offline Mode** | Full functionality in low-connectivity areas with automatic sync |
| 🌐 **Geolocation Services** | GPS-based patrol tracking and boundary enforcement |

---

## 📸 Screenshots

<div align="center">

### 🌲 Dashboard & Monitoring

<img src="./assets/dashboard-1.png" alt="Forest Guardian Dashboard" width="48%" />
<img src="./assets/dashboard-2.png" alt="Forest Guardian Monitoring" width="48%" />

<br><br>

### 🚨 Incident & Alert Management

<img src="./assets/incidents.png" alt="Incident Management" width="48%" />
<img src="./assets/alerts.png" alt="Alert Management" width="48%" />

<br><br>

### 🤖 Additional Features

<img src="./assets/features.png" alt="Forest Guardian Features" width="70%" />

</div>
<br><br>

### 🚨 Incident & Alert Management

<img src="./assets/Screenshot%202026-08-18%20at%207.08.21%20PM.png" alt="Forest Incident Management" width="48%" />
<img src="./assets/Screenshot%202026-08-18%20at%207.08.26%20PM.png" alt="Forest Alerts Dashboard" width="48%" />

<br><br>

### 🤖 AI-Powered Features

<img src="./assets/Screenshot%202026-08-18%20at%207.09.33%20PM
## 🛠️ Tech Stack

- **Frontend:** React 19 with TypeScript
- **Styling:** Tailwind CSS
- **AI Integration:** Google Genai API (Gemini)
- **Build Tool:** Vite
- **Maps:** Leaflet
- **Data Visualization:** Recharts
- **Runtime:** Node.js

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Google Gemini API Key ([Get one here](https://ai.google.dev))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/srakshitha0802/forest-guardian.git
   cd forest-guardian
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your `GEMINI_API_KEY`:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
forest-guardian/
├── src/
│   ├── components/          # React components
│   │   ├── AdminDashboard.tsx
│   │   ├── ForestMap.tsx
│   │   ├── IncidentManager.tsx
│   │   ├── CameraTrapManager.tsx
│   │   └── ...more components
│   ├── data/               # Mock data & database utilities
│   ├── utils/              # Helper functions & hooks
│   ├── App.tsx             # Main application
│   └── main.tsx            # Entry point
├── assets/                 # Images and static files
├── public/                 # Static assets
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

---

## 👥 User Roles

- **Forest Officer:** Patrol management, incident reporting, offline data collection
- **Range Officer:** Team coordination, activity oversight, resource allocation
- **Admin:** System management, user administration, analytics and reporting

---

## 📝 Usage

1. **Login** with your credentials (role-based access)
2. **View Forest Map** to track patrol teams and incidents in real-time
3. **Manage Incidents** - create, update, and resolve forest incidents
4. **Access Wildlife Guide** for species identification
5. **Generate Reports** for management and compliance
6. **Enable Offline Mode** for areas without internet connectivity

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📧 Support & Contact

For issues, questions, or feedback, please:
- Open an [issue](https://github.com/srakshitha0802/forest-guardian/issues)
- Contact the development team

---

<div align="center">
  <p><strong>Protecting Forests. Empowering Communities. Powered by AI.</strong></p>
  <p>Made with 🌲 by Forest Guardian Team</p>
</div>
