# Publishing to NPM

Follow these steps to publish your package to NPM:

## Prerequisites

1. Create an NPM account at https://www.npmjs.com/signup
2. Verify your email address

## Steps to Publish

### 1. Update Package Information

Before publishing, update these fields in [package.json](package.json):

- `name`: Make sure it's unique on NPM (check: https://www.npmjs.com/package/your-package-name)
- `version`: Follow semantic versioning (e.g., 1.0.0)
- `author`: Your name and email
- `repository`: Your GitHub repository URL
- `homepage`: Your project homepage or README URL
- `bugs`: Your issue tracker URL

### 2. Login to NPM

```bash
npm login
```

Enter your NPM credentials when prompted.

### 3. Build the Library

```bash
npm run build:lib
```

This will:
- Compile TypeScript
- Bundle the library with Vite
- Generate TypeScript declaration files
- Output everything to the `dist/` folder

### 4. Test Locally (Optional but Recommended)

Before publishing, test your package locally:

```bash
# In your package directory
npm pack
```

This creates a `.tgz` file. Then in another project:

```bash
npm install /path/to/react-pdf-annotator-v2-1.0.0.tgz
```

### 5. Publish to NPM

```bash
npm publish
```

For scoped packages (e.g., @username/package):
```bash
npm publish --access public
```

### 6. Verify Publication

Visit https://www.npmjs.com/package/react-pdf-annotator-v2 to see your published package.

## Updating the Package

When you make changes:

1. Update the version in package.json (follow semantic versioning):
   - **Patch** (1.0.0 → 1.0.1): Bug fixes
   - **Minor** (1.0.0 → 1.1.0): New features (backward compatible)
   - **Major** (1.0.0 → 2.0.0): Breaking changes

2. Rebuild and publish:
```bash
npm run build:lib
npm publish
```

## Quick Commands Reference

```bash
# Login to NPM
npm login

# Build the library
npm run build:lib

# Test package locally
npm pack

# Publish
npm publish

# Publish scoped package
npm publish --access public

# Unpublish (within 72 hours, use carefully!)
npm unpublish react-pdf-annotator-v2@1.0.0
```

## Tips

- ✅ Always test locally before publishing
- ✅ Update the README.md with clear usage instructions
- ✅ Use `.npmignore` to exclude unnecessary files
- ✅ Follow semantic versioning strictly
- ✅ Add a CHANGELOG.md to track changes
- ❌ Never publish sensitive information (API keys, tokens)
- ❌ Don't unpublish versions that others might be using

## Troubleshooting

**Error: Package name already exists**
- Choose a different package name in package.json

**Error: Need to login**
- Run `npm login` first

**Error: 402 Payment Required**
- Your package name might be reserved. Try a different name.

**Error: 403 Forbidden**
- You might not have permission. Check if you're logged in with the correct account.
