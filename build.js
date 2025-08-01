import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔨 Starting build process...');
console.log('📁 Working directory:', __dirname);

// Create dist directory
const distDir = path.join(__dirname, 'dist');
console.log('📁 Creating dist directory:', distDir);

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('✅ Created dist directory');
} else {
  console.log('✅ Dist directory already exists');
}

// Copy public directory
const publicDir = path.join(__dirname, 'public');
const distPublicDir = path.join(distDir, 'public');

function copyDir(src, dest) {
  console.log(`📂 Copying ${src} to ${dest}`);

  if (!fs.existsSync(src)) {
    console.log(`⚠️  Source directory ${src} does not exist, skipping...`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  console.log(`📄 Found ${files.length} items in ${src}`);

  files.forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);

    try {
      if (fs.statSync(srcFile).isDirectory()) {
        copyDir(srcFile, destFile);
      } else {
        fs.copyFileSync(srcFile, destFile);
        console.log(`✅ Copied: ${file}`);
      }
    } catch (error) {
      console.log(`❌ Error copying ${file}:`, error.message);
    }
  });
}

// Copy public files
console.log('📁 Checking for public directory...');
if (fs.existsSync(publicDir)) {
  copyDir(publicDir, distPublicDir);
  console.log('✅ Copied public directory to dist/public');
} else {
  console.log('⚠️  Public directory not found, creating empty one...');
  fs.mkdirSync(distPublicDir, { recursive: true });
}

// Copy views directory
console.log('📁 Checking for views directory...');
const viewsDir = path.join(__dirname, 'views');
const distViewsDir = path.join(distDir, 'views');

if (fs.existsSync(viewsDir)) {
  copyDir(viewsDir, distViewsDir);
  console.log('✅ Copied views directory to dist/views');
} else {
  console.log('⚠️  Views directory not found, creating empty one...');
  fs.mkdirSync(distViewsDir, { recursive: true });
}

// Create a simple index.html for static fallback
const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Family Travel Tracker - Loading...</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .loading { text-align: center; }
        .spinner { 
            border: 4px solid #f3f3f3; 
            border-top: 4px solid #3498db; 
            border-radius: 50%; 
            width: 40px; 
            height: 40px; 
            animation: spin 2s linear infinite; 
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="loading">
        <div class="spinner"></div>
        <h2>Family Travel Tracker</h2>
        <p>Loading your travel adventures...</p>
        <p><small>Made with ❤️ by Zakeen Khan</small></p>
    </div>
    <script>
        // Redirect to the main app
        setTimeout(() => {
            window.location.href = '/.netlify/functions/app';
        }, 2000);
    </script>
</body>
</html>
`;

try {
  fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);
  console.log('✅ Created index.html');
} catch (error) {
  console.log('❌ Error creating index.html:', error.message);
  process.exit(1);
}

// Verify dist directory exists and has content
if (fs.existsSync(distDir)) {
  const distContents = fs.readdirSync(distDir);
  console.log('📁 Dist directory contents:', distContents);

  if (distContents.length === 0) {
    console.log('❌ Dist directory is empty!');
    process.exit(1);
  }
} else {
  console.log('❌ Dist directory was not created!');
  process.exit(1);
}

console.log('🎉 Build completed successfully!');
console.log('📁 Files ready for Netlify deployment in ./dist directory');
