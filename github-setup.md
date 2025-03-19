# GitHub Setup Instructions

Follow these steps to connect your local repository to GitHub:

## 1. Create a new repository on GitHub
Go to https://github.com/new and create a new repository named "3js-military-game" (or your preferred name).

## 2. Connect your local repository to GitHub

```bash
# Add the GitHub repository as a remote named "origin"
git remote add origin https://github.com/YOUR-USERNAME/3js-military-game.git

# If you're using SSH authentication (recommended)
# git remote add origin git@github.com:YOUR-USERNAME/3js-military-game.git

# Push the main branch to GitHub
git push -u origin main

# Push the develop branch to GitHub
git checkout develop
git push -u origin develop
```

## 3. Verify the connection

```bash
# Check your remote repositories
git remote -v
```

## 4. Create your first feature branch

```bash
# Ensure you're on the develop branch
git checkout develop

# Create and switch to a new feature branch
git checkout -b feature/your-feature-name

# Make changes, commit them
git add .
git commit -m "feat: add your feature description"

# Push the feature branch to GitHub
git push -u origin feature/your-feature-name
```

## 5. After finishing your feature

```bash
# Create a pull request on GitHub to merge your feature into develop
# Go to https://github.com/YOUR-USERNAME/3js-military-game/pulls and click "New pull request"

# After merging on GitHub, update your local develop branch
git checkout develop
git pull origin develop
``` 