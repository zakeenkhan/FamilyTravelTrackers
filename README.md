# 🌍 Family Travel Tracker ✈️

**Made with ❤️ by Zakeen Khan**

A beautiful, modern web application to track and visualize your family's travel adventures around the world. Built with Node.js, Express, and PostgreSQL, featuring an interactive world map and elegant user interface.

![Family Travel Tracker](https://img.shields.io/badge/Status-Ready%20for%20Deployment-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![License](https://img.shields.io/badge/License-ISC-yellow)

## ✨ Features

### 🎨 **Beautiful Modern UI**
- Stunning gradient backgrounds and glass-morphism design
- Responsive layout that works on all devices
- Professional typography with Poppins font
- Smooth animations and hover effects
- Mobile-first responsive design

### 👨‍👩‍👧‍👦 **Family Management**
- Add unlimited family members
- Personalized color themes for each member
- Easy switching between family members
- Beautiful color picker with gradient options

### 🗺️ **Interactive World Map**
- SVG-based world map with hover effects
- Visual highlighting of visited countries
- Real-time travel statistics
- Progress tracking (countries visited / total countries)

### 📊 **Travel Analytics**
- Track total countries visited
- Calculate world exploration percentage
- Visual statistics dashboard
- Progress indicators

### 🚀 **Technical Excellence**
- Modern Node.js backend with Express
- PostgreSQL database with NeonDB
- Secure environment variable management
- Production-ready deployment configuration


## 📸 Screenshots

| | |
|:-------------------------:|:-------------------------:|
| ![Screenshot 1](https://raw.githubusercontent.com/zakeenkhan/FamilyTravelTrackers/main/SS/1.JPG) | ![Screenshot 2](https://raw.githubusercontent.com/zakeenkhan/FamilyTravelTrackers/main/SS/2.JPG) |
| ![Screenshot 3](https://raw.githubusercontent.com/zakeenkhan/FamilyTravelTrackers/main/SS/3.JPG) | ![Screenshot 4](https://raw.githubusercontent.com/zakeenkhan/FamilyTravelTrackers/main/SS/4.JPG) |

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database (NeonDB)
- **EJS** - Templating engine
- **dotenv** - Environment variable management

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **JavaScript** - Interactive functionality
- **Font Awesome** - Beautiful icons
- **Google Fonts** - Poppins typography

### Database
- **NeonDB** - Serverless PostgreSQL
- **3 Tables**: users, countries, visited_countries
- **161+ Countries** - Complete world database
- **Sample Data** - Ready to use

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- NeonDB account (free tier available)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd FamilyTravelTrackers
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@host/database?sslmode=require
   PORT=8000
   ```

4. **Initialize the database:**
   ```bash
   node setup-database.js
   ```

5. **Start the application:**
   ```bash
   npm start
   ```

6. **Open your browser:**
   Navigate to `http://localhost:8000`

## 📁 Project Structure

```
FamilyTravelTrackers/
├── 📁 views/
│   ├── 📄 index.ejs          # Main application page
│   └── 📄 new.ejs            # Add family member page
├── 📁 public/
│   └── 📁 styles/
│       ├── 📄 main.css       # Main stylesheet (modern design)
│       └── 📄 new.css        # Add member page styles
├── 📄 database_setup.sql     # Complete database schema
├── 📄 setup-database.js      # Database initialization
├── 📄 index.js              # Main application server
├── 📄 package.json          # Dependencies and scripts
├── 📄 DEPLOYMENT.md         # Deployment guide
└── 📄 README.md             # This file
```

## 🗄️ Database Schema

### Tables Overview
- **`users`** - Family member profiles (id, name, color)
- **`countries`** - World countries database (161+ countries)
- **`visited_countries`** - Travel tracking (user_id, country_code)

### Sample Data Included
- 3 sample family members
- Complete world countries database
- Sample travel data for testing

## 🎨 UI/UX Features

### Design Elements
- **Glass-morphism** - Modern translucent design
- **Gradient Backgrounds** - Beautiful color transitions
- **Smooth Animations** - Hover effects and transitions
- **Professional Typography** - Poppins font family
- **Responsive Grid** - Mobile-first approach

### User Experience
- **Intuitive Navigation** - Easy to use interface
- **Visual Feedback** - Hover states and animations
- **Accessibility** - Semantic HTML and ARIA labels
- **Performance** - Optimized CSS and JavaScript

## 🚀 Deployment Options

The application is ready for deployment on multiple platforms:

### Recommended Platforms
1. **Vercel** - Full-stack deployment with serverless functions
2. **Railway** - Simple deployment with automatic scaling
3. **Render** - Free tier available with PostgreSQL support
4. **Heroku** - Classic platform with extensive add-ons

### Quick Deploy Commands
```bash
# Vercel
npm i -g vercel
vercel

# Railway
npm i -g @railway/cli
railway login
railway deploy

# Render
# Connect GitHub repo in Render dashboard
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🔧 Configuration

### Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | NeonDB connection string | `postgresql://user:pass@host/db` |
| `PORT` | Server port (auto-set by platforms) | `8000` |
| `NODE_ENV` | Environment mode | `production` |

### Security Features
- Environment variable protection
- SQL injection prevention
- Secure database connections
- Input validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the [DEPLOYMENT.md](DEPLOYMENT.md) guide
- Review the troubleshooting section

## 🎯 Future Enhancements

- [ ] User authentication system
- [ ] Photo uploads for countries
- [ ] Travel journal entries
- [ ] Social sharing features
- [ ] Export travel data
- [ ] Multiple trip tracking
- [ ] Travel recommendations

---

## 👨‍💻 About the Developer

**Zakeen Khan** - Full Stack Developer passionate about creating beautiful, functional web applications that solve real-world problems.



**⭐ If you found this project helpful, please give it a star!**

Made with ❤️ and lots of ☕ by **Zakeen Khan**