# Deployment Guide for Savant Website

## Option 1: GitHub Pages (Recommended - Free & Easy)

### Steps:

1. **Create a GitHub account** (if you don't have one): https://github.com

2. **Initialize Git and push to GitHub:**
   ```bash
   cd /Users/harrystevenson/savant-website
   git init
   git add .
   git commit -m "Initial commit - Savant website"
   ```

3. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it `savant-website` (or any name you prefer)
   - Don't initialize with README
   - Click "Create repository"

4. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/savant-website.git
   git branch -M main
   git push -u origin main
   ```
   (Replace YOUR_USERNAME with your GitHub username)

5. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"
   - Your site will be live at: `https://YOUR_USERNAME.github.io/savant-website/`

---

## Option 2: Netlify (Drag & Drop - Easiest)

1. **Go to Netlify:** https://app.netlify.com/drop
2. **Drag and drop** your entire `savant-website` folder
3. **Your site is live instantly!** You'll get a URL like `https://random-name.netlify.app`
4. You can customize the domain name in settings

---

## Option 3: Vercel (Also Very Easy)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd /Users/harrystevenson/savant-website
   vercel
   ```
   Follow the prompts - your site will be live in seconds!

---

## Option 4: Cloudflare Pages

1. Go to https://pages.cloudflare.com
2. Connect your GitHub account (or upload manually)
3. Select your repository
4. Deploy!

---

## Quick Deploy Script

If you want to deploy to GitHub Pages quickly, run these commands:

```bash
cd /Users/harrystevenson/savant-website
git init
git add .
git commit -m "Initial commit"
# Then follow steps 3-5 above
```

