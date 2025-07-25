# Git LFS Setup Guide for Large Executable Files

## Overview
This guide helps you set up Git LFS (Large File Storage) to handle executable files larger than 100MB in your repository.

## 1. Install Git LFS

### Windows:
```bash
# Download and install from: https://git-lfs.github.io/
# Or use chocolatey:
choco install git-lfs

# Or use winget:
winget install GitHub.GitLFS
```

### macOS:
```bash
# Using Homebrew:
brew install git-lfs

# Or download from: https://git-lfs.github.io/
```

### Linux:
```bash
# Ubuntu/Debian:
sudo apt install git-lfs

# CentOS/RHEL:
sudo yum install git-lfs

# Or download from: https://git-lfs.github.io/
```

## 2. Initialize Git LFS in Your Repository

```bash
# Navigate to your project directory
cd your-project-directory

# Initialize Git LFS
git lfs install

# This creates/updates .gitattributes file (already done for you)
```

## 3. Add Your Executable Files

### Step 1: Replace Placeholder Files
1. Navigate to `public/downloads/`
2. Replace the placeholder files with your actual executables:
   - Replace `GhostCoder Setup 1.1.0.exe` with your Windows installer
   - Replace `GhostCoder-1.1.0.dmg` with your macOS installer

### Step 2: Add Files to Git LFS
```bash
# Add the files to Git LFS tracking
git add .gitattributes
git add public/downloads/

# Commit the changes
git commit -m "Add executable files with Git LFS"

# Push to repository
git push origin main
```

## 4. Verify Git LFS is Working

### Check LFS Status:
```bash
# See which files are tracked by LFS
git lfs ls-files

# Check LFS status
git lfs status
```

### Expected Output:
```
public/downloads/GhostCoder Setup 1.1.0.exe
public/downloads/GhostCoder-1.1.0.dmg
```

## 5. File Structure

Your repository should have this structure:
```
your-project/
├── .gitattributes          # LFS configuration
├── public/
│   └── downloads/
│       ├── GhostCoder Setup 1.1.0.exe  # Windows installer (LFS)
│       └── GhostCoder-1.1.0.dmg         # macOS installer (LFS)
├── src/
│   └── constants/
│       └── downloads.ts     # Download configuration
└── ...
```

## 6. How Downloads Work

### User Experience:
1. User clicks download button on website
2. File downloads directly from your domain
3. Fast downloads served by your hosting provider
4. No external dependencies

### Technical Flow:
```
User clicks button → JavaScript creates download link → File downloads from /downloads/filename
```

## 7. Updating Files

### When you have new versions:

1. **Replace the files** in `public/downloads/`
2. **Update version numbers** in `src/constants/downloads.ts`
3. **Commit and push**:
   ```bash
   git add public/downloads/
   git add src/constants/downloads.ts
   git commit -m "Update to version 1.2.0"
   git push origin main
   ```

## 8. Benefits of Git LFS

### ✅ **Advantages:**
- **Version Control**: Track large files with Git
- **Fast Cloning**: LFS files downloaded on-demand
- **Bandwidth Efficient**: Only download files when needed
- **Local Hosting**: Files served from your domain
- **No External Dependencies**: No reliance on Google Drive or other services

### ✅ **Performance:**
- **Fast Downloads**: Direct from your hosting provider
- **Reliable**: No third-party service dependencies
- **Scalable**: Hosting providers handle CDN distribution
- **Professional**: Files served from your own domain

## 9. Hosting Considerations

### Deployment Platforms:
- **Vercel**: Supports Git LFS files up to 100MB per file
- **Netlify**: Supports Git LFS with bandwidth limits
- **GitHub Pages**: Limited LFS bandwidth
- **Custom Hosting**: Full control over file serving

### File Size Limits:
- **Vercel**: 100MB per file, 1GB total
- **Netlify**: 2GB LFS storage on free plan
- **GitHub**: 1GB LFS storage on free plan

## 10. Troubleshooting

### Common Issues:

**Files not downloading:**
- Check if files exist in `public/downloads/`
- Verify Git LFS is properly configured
- Ensure files were committed with LFS

**Large repository size:**
- Run `git lfs prune` to clean old LFS files
- Check `.gitattributes` configuration

**LFS bandwidth exceeded:**
- Consider upgrading hosting plan
- Use CDN for file distribution
- Implement download analytics to monitor usage

## 11. Commands Reference

```bash
# Install Git LFS
git lfs install

# Track file types
git lfs track "*.exe"
git lfs track "*.dmg"

# See tracked files
git lfs ls-files

# Check LFS status
git lfs status

# Clean old LFS files
git lfs prune

# Pull LFS files
git lfs pull

# Push LFS files
git lfs push origin main
```

## 12. Next Steps

1. **Install Git LFS** on your system
2. **Replace placeholder files** with your actual executables
3. **Commit and push** the changes
4. **Test downloads** on your deployed website
5. **Monitor file sizes** and hosting limits

Your downloads will now work directly from your codebase with professional file hosting! 🚀