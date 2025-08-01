#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Family Travel Tracker - Netlify Deployment Script');
console.log('Made with ❤️ by Zakeen Khan\n');

// Check if netlify CLI is installed
try {
  execSync('netlify --version', { stdio: 'ignore' });
} catch (error) {
  console.log('❌ Netlify CLI not found. Installing...');
  try {
    execSync('npm install -g netlify-cli', { stdio: 'inherit' });
    console.log('✅ Netlify CLI installed successfully!\n');
  } catch (installError) {
    console.log('❌ Failed to install Netlify CLI. Please install manually:');
    console.log('   npm install -g netlify-cli\n');
    process.exit(1);
  }
}

// Build the project
console.log('🔨 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!\n');
} catch (error) {
  console.log('❌ Build failed. Please check the errors above.\n');
  process.exit(1);
}

// Check if user is logged in to Netlify
console.log('🔐 Checking Netlify authentication...');
try {
  execSync('netlify status', { stdio: 'ignore' });
  console.log('✅ You are logged in to Netlify!\n');
} catch (error) {
  console.log('❌ You are not logged in to Netlify.');
  console.log('Please run: netlify login\n');
  
  // Try to login automatically
  try {
    console.log('🔐 Opening Netlify login...');
    execSync('netlify login', { stdio: 'inherit' });
  } catch (loginError) {
    console.log('❌ Login failed. Please try manually: netlify login\n');
    process.exit(1);
  }
}

// Deploy to Netlify
console.log('🚀 Deploying to Netlify...');
console.log('📁 Deploying from ./dist directory');
console.log('⚡ Using Netlify Functions for backend\n');

try {
  // First deploy for preview
  console.log('📋 Creating preview deployment...');
  execSync('netlify deploy --dir=dist --functions=netlify/functions', { stdio: 'inherit' });
  
  console.log('\n🎉 Preview deployment successful!');
  console.log('🔍 Please test your preview URL above.');
  console.log('\n📝 To deploy to production, run:');
  console.log('   netlify deploy --prod --dir=dist --functions=netlify/functions');
  console.log('\n💡 Or use this script with --prod flag:');
  console.log('   node deploy-netlify.js --prod');
  
} catch (error) {
  console.log('❌ Deployment failed. Please check the errors above.\n');
  console.log('💡 You can also deploy manually:');
  console.log('   1. Go to netlify.com');
  console.log('   2. Drag and drop the ./dist folder');
  console.log('   3. Set environment variables in site settings\n');
  process.exit(1);
}

// Check if --prod flag is passed
if (process.argv.includes('--prod')) {
  console.log('\n🚀 Deploying to production...');
  try {
    execSync('netlify deploy --prod --dir=dist --functions=netlify/functions', { stdio: 'inherit' });
    console.log('\n🎉 Production deployment successful!');
    console.log('🌍 Your Family Travel Tracker is now live!');
  } catch (error) {
    console.log('❌ Production deployment failed.');
  }
}

console.log('\n📋 Don\'t forget to set these environment variables in Netlify:');
console.log('   • DATABASE_URL: Your NeonDB connection string');
console.log('   • NODE_ENV: production');
console.log('\n🎯 Access your site settings at: https://app.netlify.com');
console.log('\n✨ Happy travels! 🌍✈️');
