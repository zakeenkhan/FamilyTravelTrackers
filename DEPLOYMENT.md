# Deployment Guide

This guide covers deploying the Family Travel Tracker application to various platforms.

## Prerequisites

1. **NeonDB Setup**: Complete the database setup first
   - Create account at [neon.tech](https://neon.tech)
   - Create a new project and database
   - Run the `database_setup.sql` script
   - Copy your connection string

2. **Code Repository**: Push your code to GitHub, GitLab, or Bitbucket

## Platform-Specific Deployment

### 1. Vercel (Recommended - Full Stack)

Vercel supports Node.js applications and is great for full-stack deployment.

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts to link your GitHub repo
4. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your NeonDB connection string
   - `NODE_ENV`: production

**vercel.json** (create this file):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

### 2. Railway (Full Stack)

Railway is excellent for Node.js applications with PostgreSQL.

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy from the main branch
4. Add environment variables:
   - `DATABASE_URL`: Your NeonDB connection string
   - `PORT`: 3000 (Railway will override this)

### 3. Render (Full Stack)

**Steps:**
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables:
   - `DATABASE_URL`: Your NeonDB connection string
   - `NODE_ENV`: production

### 4. Heroku (Full Stack)

**Steps:**
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set DATABASE_URL="your-neon-connection-string"
   heroku config:set NODE_ENV=production
   ```
5. Deploy: `git push heroku main`

### 5. Netlify (Frontend) + Railway/Render (Backend)

If you want to separate frontend and backend:

**Backend (Railway/Render):**
- Deploy the Node.js app as described above
- Note the deployed backend URL

**Frontend (Netlify):**
- Create a separate frontend build
- Update API calls to point to your backend URL
- Deploy static files to Netlify

## Environment Variables

For all platforms, set these environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | Your NeonDB connection string | PostgreSQL connection |
| `PORT` | 3000 (or platform default) | Server port |
| `NODE_ENV` | production | Environment mode |

## Post-Deployment Checklist

1. ✅ Database connection working
2. ✅ All routes responding correctly
3. ✅ Static files (CSS, images) loading
4. ✅ Environment variables set correctly
5. ✅ HTTPS enabled (most platforms do this automatically)
6. ✅ Custom domain configured (optional)

## Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Verify DATABASE_URL is correct
   - Ensure NeonDB allows connections from your deployment platform
   - Check if SSL is required (add `?sslmode=require`)

2. **Static Files Not Loading**
   - Verify `public` folder is included in deployment
   - Check Express static middleware configuration

3. **Port Issues**
   - Use `process.env.PORT || 3000` in your code
   - Don't hardcode port numbers

4. **Build Failures**
   - Ensure all dependencies are in `package.json`
   - Check Node.js version compatibility

### Logs and Debugging:

- **Vercel**: Check function logs in dashboard
- **Railway**: View logs in project dashboard
- **Render**: Check logs in service dashboard
- **Heroku**: Use `heroku logs --tail`

## Performance Optimization

1. **Database Connection Pooling**: Consider using `pg.Pool` for production
2. **Caching**: Implement Redis for session management
3. **CDN**: Use platform CDN for static assets
4. **Monitoring**: Set up error tracking (Sentry, LogRocket)

## Security Considerations

1. **Environment Variables**: Never commit `.env` to version control
2. **Database Security**: Use NeonDB's built-in security features
3. **HTTPS**: Ensure all traffic is encrypted
4. **Input Validation**: Validate all user inputs
5. **SQL Injection**: Use parameterized queries (already implemented)

## Scaling

- **Horizontal Scaling**: Most platforms auto-scale
- **Database**: NeonDB scales automatically
- **Monitoring**: Set up alerts for high traffic
- **Caching**: Implement caching strategies for better performance
