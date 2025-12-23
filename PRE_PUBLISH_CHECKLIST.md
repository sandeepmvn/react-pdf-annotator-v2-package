# Pre-Publishing Checklist

Before you publish your package to NPM, go through this checklist:

## 📝 Package Information

- [ ] Update `name` in package.json to a unique package name
  - Check availability: https://www.npmjs.com/package/YOUR-PACKAGE-NAME
  
- [ ] Update `version` in package.json (should be 1.0.0 for first release)

- [ ] Update `author` in package.json with your name and email
  ```json
  "author": "Your Name <your.email@example.com>"
  ```

- [ ] Update `repository.url` in package.json with your GitHub repo URL
  ```json
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/your-repo.git"
  }
  ```

- [ ] Update `bugs.url` in package.json
  ```json
  "bugs": {
    "url": "https://github.com/yourusername/your-repo/issues"
  }
  ```

- [ ] Update `homepage` in package.json
  ```json
  "homepage": "https://github.com/yourusername/your-repo#readme"
  ```

## 📄 Documentation

- [ ] Update LICENSE file with your name and year
  ```
  Copyright (c) 2025 [Your Name]
  ```

- [ ] Review README.md and update example URLs if needed

- [ ] Ensure README.md has clear installation and usage instructions

## 🔧 Testing

- [ ] Build the package: `npm run build:lib`

- [ ] Verify build succeeded without errors

- [ ] Check that dist/ folder contains:
  - [ ] react-pdf-annotator.es.js
  - [ ] react-pdf-annotator.umd.js
  - [ ] style.css
  - [ ] index.d.ts and other .d.ts files

- [ ] Test locally before publishing:
  ```bash
  npm pack
  ```
  This creates a `.tgz` file that you can install in another project

- [ ] Install the packed version in a test project:
  ```bash
  npm install /path/to/react-pdf-annotator-v2-1.0.0.tgz
  ```

- [ ] Test importing and using the component in the test project:
  ```tsx
  import { PdfViewer } from 'react-pdf-annotator-v2';
  import 'react-pdf-annotator-v2/dist/style.css';
  ```

## 🔐 NPM Account

- [ ] Have an NPM account (sign up at https://www.npmjs.com/signup)

- [ ] Verified your email address

- [ ] Login to NPM:
  ```bash
  npm login
  ```

## 🚀 Ready to Publish

Once all items above are checked:

```bash
# Build the package
npm run build:lib

# Publish to NPM
npm publish

# Or for scoped packages:
npm publish --access public
```

## ✅ Post-Publishing

After publishing:

- [ ] Visit your package page: https://www.npmjs.com/package/YOUR-PACKAGE-NAME

- [ ] Verify the README displays correctly

- [ ] Try installing in a new project: `npm install YOUR-PACKAGE-NAME`

- [ ] Test that it works in a real project

- [ ] Share with the community! 🎉

## 🔄 Future Updates

For updates:

1. Make your changes
2. Update version in package.json (follow semantic versioning):
   - Patch: 1.0.0 → 1.0.1 (bug fixes)
   - Minor: 1.0.0 → 1.1.0 (new features, backward compatible)
   - Major: 1.0.0 → 2.0.0 (breaking changes)
3. Build: `npm run build:lib`
4. Publish: `npm publish`

## ⚠️ Important Notes

- You can unpublish within 72 hours if needed: `npm unpublish PACKAGE@VERSION`
- After 72 hours, you can only deprecate: `npm deprecate PACKAGE@VERSION "reason"`
- Never publish sensitive information (API keys, passwords, tokens)
- Always test locally before publishing

---

Good luck with your package! 🚀
