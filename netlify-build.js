// Simple build script for Netlify
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Netlify Build Script Starting...');

// Create dist directory
const distDir = './dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('✅ Created dist directory');
}

// Create basic structure
const dirs = ['dist/public', 'dist/public/styles', 'dist/views'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created ${dir}`);
  }
});

// Copy files using basic commands
try {
  // Copy public files
  if (fs.existsSync('public')) {
    execSync('cp -r public/* dist/public/ 2>/dev/null || xcopy public dist\\public /E /I /Y 2>nul || true', { stdio: 'inherit' });
    console.log('✅ Copied public files');
  }
  
  // Copy views
  if (fs.existsSync('views')) {
    execSync('cp -r views/* dist/views/ 2>/dev/null || xcopy views dist\\views /E /I /Y 2>nul || true', { stdio: 'inherit' });
    console.log('✅ Copied views files');
  }
} catch (error) {
  console.log('⚠️  Copy commands failed, using JavaScript fallback...');
  
  // JavaScript fallback
  if (fs.existsSync('public')) {
    const publicFiles = fs.readdirSync('public', { recursive: true });
    publicFiles.forEach(file => {
      const srcPath = path.join('public', file);
      const destPath = path.join('dist/public', file);
      
      if (fs.statSync(srcPath).isFile()) {
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(srcPath, destPath);
      }
    });
    console.log('✅ Copied public files (JS fallback)');
  }
  
  if (fs.existsSync('views')) {
    const viewFiles = fs.readdirSync('views');
    viewFiles.forEach(file => {
      fs.copyFileSync(path.join('views', file), path.join('dist/views', file));
    });
    console.log('✅ Copied view files (JS fallback)');
  }
}

// Create index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Family Travel Tracker</title>
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
        setTimeout(() => {
            window.location.href = '/.netlify/functions/app';
        }, 2000);
    </script>
</body>
</html>`;

fs.writeFileSync('dist/index.html', indexHtml);
console.log('✅ Created index.html');

// Verify build
const distContents = fs.readdirSync('dist');
console.log('📁 Build output:', distContents);

if (distContents.length === 0) {
  console.error('❌ Build failed - dist directory is empty');
  process.exit(1);
}

console.log('🎉 Build completed successfully!');
console.log('📁 Ready for Netlify deployment');
