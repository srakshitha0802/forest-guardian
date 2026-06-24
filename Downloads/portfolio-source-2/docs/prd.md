# Requirements Document

## 1. Application Overview

**Application Name**: Semala Rakshitha Portfolio Website

**Description**: A premium 3D animation portfolio website showcasing Semala Rakshitha's professional profile as a Full Stack Developer specializing in AI Integrations. The website features glassmorphism UI design with pink color theme, 3D animations, interactive elements, and comprehensive sections covering personal information, skills, experience, projects, research publications, achievements, education, and contact details.

## 2. Users and Usage Scenarios

**Target Users**:
- Recruiters and hiring managers seeking full stack developers
- Potential clients looking for AI integration expertise
- Academic and research community interested in publications
- Professional network connections

**Core Usage Scenarios**:
- Viewing professional profile and technical skills
- Exploring project portfolio and work experience
- Accessing research publications and achievements
- Contacting for collaboration or job opportunities

## 3. Page Structure and Functional Description

### Page Structure
```
Portfolio Website (Single Page Application)
├── Hero Section
├── About/Skills Section
├── Experience Section
├── Projects Section
├── Research & Publications Section
├── Achievements & Certifications Section
├── Education Section
├── 3D Model Viewer Section
└── Contact Section
```

### 3.1 Hero Section

**Purpose**: Create impactful first impression with full-screen visual presentation

**Functional Elements**:
- Background video player displaying /workspace/app-c4299wk2mdj5/tasks/3D_pink_lotus.mp4 (looped, muted, full-screen)
- Animated text reveal for name \"Semala Rakshitha\"
- Display title \"Full Stack Developer — AI Integrations\"
- Show contact information: srakshitha912@gmail.com, +91 86399 75744
- Display location: Kurnool, Andhra Pradesh, India
- Social links to GitHub (srakshitha0802) and LinkedIn (rakshithasemala)
- Floating glass cards displaying key statistics
- Smooth scroll indicator to next section

### 3.2 About/Skills Section

**Purpose**: Present technical competencies and skill proficiency

**Functional Elements**:
- Glass card layout organizing skills by categories
- Display Programming Languages: JavaScript (Advanced), TypeScript (Advanced), Python (Advanced), HTML5 (Intermediate), CSS3 (Intermediate)
- Display Tools & Frameworks: Git, GitHub, npm, Postman, React.js, Next.js, Node.js, Express, Flask
- Display Technologies: MongoDB, PostgreSQL, Prisma ORM, Tailwind CSS, REST APIs, NLP (DistilBERT), Scikit-learn, TensorFlow.js, SSR/SSG, Web Vitals
- Display Other Skills: Public Speaking, Tech Writing, Event Organization, Problem Solving
- Animated skill progress indicators or badges

### 3.3 Experience Section

**Purpose**: Showcase professional work history in chronological timeline

**Functional Elements**:
- Timeline layout with glass cards for each position
- Display experience entries:

**Entry 1**: IncuxAI (Startup) — Full Stack Developer (Remote/In-office), May 2026 – Jul 2026
- Developed core frontend modules using React.js and TypeScript, improving UI responsiveness by 25%
- Built and deployed RESTful APIs with Node.js/Express and MongoDB, handling 1k+ daily requests
- Integrated third-party authentication (OAuth) and real-time data sync for internal dashboards
- Shipped 3 major features in 2 months in an agile startup environment

**Entry 2**: SmartBridge — Full Stack Developer Intern (Remote), 2025
- Architected DocSpot, a full-stack health platform automating doctor-patient scheduling
- Engineered secure REST APIs with Node.js/Express (JWT, scheduling)
- Designed MongoDB schemas for transactional consistency
- Built reusable React components with clean state management

**Entry 3**: AICTE Virtual Internship (EduSkills) — AI Developer Intern (Remote), 2024
- Built AI chatbot using Python and NLP (intent recognition, tokenization)
- Improved query resolution speed by 30%
- Prototyped AI customer support automation

### 3.4 Projects Section

**Purpose**: Demonstrate practical application of technical skills through completed projects

**Functional Elements**:
- Interactive project cards with 3D hover tilt effect
- Embed or link to /workspace/app-c4299wk2mdj5/tasks/portfolio.mp4 as demo reel
- Display project entries:

**Project 1**: Moodverse – AI Mental Health Platform
- Stack: React.js, Node.js, MongoDB, DistilBERT
- Full-stack sentiment analysis with DistilBERT NLP via REST APIs (85% accuracy)
- Interactive mood tracking dashboards; recognized by RTIH

**Project 2**: AI Timetable Generator
- Stack: React.js, Flask, Python, REST APIs
- Automated schedule generation, reducing conflicts by 40%
- PDF/Excel export and dynamic editing

**Project 3**: Entresst-AI – Career Recommendation
- Stack: Next.js, TypeScript, TensorFlow.js
- Client-side ML inference reduced latency by 50%
- Optimized Core Web Vitals with SSR/SSG

**Project 4**: MandiSense – Agricultural Intelligence
- Stack: React.js, Node.js, MongoDB, Chart.js
- Real-time commodity price monitoring with Chart.js
- Mobile-first design for low-bandwidth environments

### 3.5 Research & Publications Section

**Purpose**: Highlight academic contributions and research work

**Functional Elements**:
- Glass card list layout for publications
- Display IEEE Publications:
  - \"AI-Enabled IoT Load Forecasting\" (SILCON 2025)
  - \"Hybrid Learning for Cancer Gene Detection\" (ICE2CPT 2025)
- Display Journal Publications:
  - \"Speech-NLP in Metaverse\" (J. Adv. Parallel Computing, 2026)
  - \"Smart Energy Forecasting\" (Adv. Comp. Tech., 2026)
  - \"ML for Diabetes Prediction\" (Robotics, 2026)
- Display Conference Presentations:
  - \"CO2 Impact on Temperature\" (E2A-2025, NIT Silchar)
  - \"Inflation Forecasting with ML\" (I-SMAC 2025, Nepal)

### 3.6 Achievements & Certifications Section

**Purpose**: Showcase recognitions and professional certifications

**Functional Elements**:
- Display Achievements:
  - Winner – Idea Fusion Innovation Competition (50+ teams)
  - National Finalist – Codex 3.0 Hackathon & Smart India Hackathon
  - Future Founder – Ratan Tata Innovation Hub (RTIH)
  - Top 15 – IEEE Road Safety Innovation Challenge
- Display Certifications:
  - Full Stack Dev (MERN) – SmartBridge
  - Generative AI – GUVI
  - AI Virtual Internship – AICTE
  - Web Analytics – Accenture

### 3.7 Education Section

**Purpose**: Present academic background

**Functional Elements**:
- Display education details:
  - Degree: B.Tech, CSE
  - Institution: Ravindra College of Engineering for Women
  - Duration: 2024–28
  - Location: Kurnool
  - CGPA: 8.5/10

### 3.8 3D Model Viewer Section

**Purpose**: Provide interactive 3D model viewing experience

**Functional Elements**:
- Interactive viewer for /workspace/app-c4299wk2mdj5/tasks/flower.glb using Three.js or similar open source 3D library
- Auto-rotate functionality
- User drag controls for manual rotation
- Zoom controls

### 3.9 Contact Section

**Purpose**: Enable visitors to send messages and access contact information

**Functional Elements**:
- Glass form card with input fields:
  - Name field
  - Email field
  - Message field
  - Submit button
- Display contact information:
  - Email: srakshitha912@gmail.com
  - Phone: +91 86399 75744
- Social links:
  - GitHub: srakshitha0802
  - LinkedIn: rakshithasemala

## 4. Business Rules and Logic

### 4.1 Visual Design Rules
- Apply glassmorphism effect to all card components (semi-transparent background, backdrop blur, subtle borders)
- Use pink color palette throughout (pinks, rose, mauve tones)
- Maintain consistent spacing and typography across sections

### 4.2 Animation Rules
- Implement smooth scroll animations between sections
- Apply particle effects and floating elements throughout the page
- Trigger animations on scroll into viewport
- Apply 3D tilt effect on project cards during hover
- Animate text reveal for hero section name

### 4.3 Media Handling Rules
- Hero background video (/workspace/app-c4299wk2mdj5/tasks/3D_pink_lotus.mp4) must loop continuously and remain muted
- Portfolio demo video (/workspace/app-c4299wk2mdj5/tasks/portfolio.mp4) can be embedded or linked
- 3D model (/workspace/app-c4299wk2mdj5/tasks/flower.glb) must load and render in the 3D viewer section

### 4.4 Navigation Rules
- Single-page application with smooth scroll navigation
- Clicking navigation links scrolls to corresponding section
- Scroll indicator in hero section guides users to explore content

### 4.5 Contact Form Rules
- All fields (name, email, message) are required for submission
- Email field must contain valid email format
- Form submission triggers confirmation message

## 5. Exception and Boundary Cases

| Scenario | Handling |
|----------|----------|
| Video file fails to load | Display fallback pink gradient background |
| 3D model fails to load | Show placeholder message in viewer section |
| Invalid email format in contact form | Display validation error message |
| Empty required fields in contact form | Highlight missing fields and prevent submission |
| Slow network connection | Show loading indicators for media assets |
| Browser does not support 3D rendering | Display static image or message about browser compatibility |

## 6. Acceptance Criteria

1. Open the portfolio website and verify hero section displays with 3D_pink_lotus.mp4 as looped background video, name \"Semala Rakshitha\", title \"Full Stack Developer — AI Integrations\", contact details (srakshitha912@gmail.com, +91 86399 75744), location (Kurnool, Andhra Pradesh, India), and social links (GitHub: srakshitha0802, LinkedIn: rakshithasemala)
2. Scroll through all sections and verify glassmorphism design with pink theme is consistently applied, smooth scroll animations work, and all content is displayed correctly (skills, experience entries, project cards with portfolio.mp4, research publications, achievements, certifications, education details)
3. Interact with 3D model viewer section and verify flower.glb loads and renders correctly with auto-rotate and user drag controls functioning
4. Navigate to contact section, fill in name, email, and message fields, submit the form, and verify submission confirmation appears

## 7. Out of Scope for Current Release

- Backend server or database for storing contact form submissions
- User authentication or login functionality
- Content management system for updating portfolio content
- Multi-language support
- Dark mode toggle
- Blog or articles section
- Downloadable resume PDF generation
- Analytics tracking integration
- SEO optimization features
- Accessibility enhancements beyond basic standards
- Performance monitoring dashboard
- A/B testing capabilities
- Email notification system for form submissions
- Social media feed integration
- Testimonials or recommendations section
- Interactive code playground or live demos
- Video call scheduling integration
- Real-time chat support
- Newsletter subscription functionality