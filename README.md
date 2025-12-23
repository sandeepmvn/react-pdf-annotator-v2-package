# React PDF Annotator v2

A feature-rich, fully customizable PDF viewer and annotator component for React applications. Built with TypeScript, this package provides comprehensive annotation tools including drawing, highlighting, text, shapes, stamps, and digital signatures.

## ✨ Features

- 📄 **PDF Viewing**: Smooth PDF rendering with zoom controls and page navigation
- 🎨 **Drawing Tools**: Pen and highlighter with customizable colors and stroke widths
- ✏️ **Text Annotation**: Add text boxes with custom colors and font sizes
- 📐 **Shapes**: Rectangle and circle annotations
- 🖍️ **Text Markup**: Underline, strikethrough, and squiggly line tools
- 🔖 **Stamps**: Pre-defined stamps (Approved, Confidential, etc.)
- ✍️ **Digital Signatures**: Draw and add signatures and initials
- ↩️ **Undo/Redo**: Full history management for all annotations
- 💾 **Export**: Download annotated PDFs with all annotations embedded
- 🎯 **TypeScript**: Fully typed for better development experience

## 📦 Installation

```bash
npm install react-pdf-annotator-v2
```

or

```bash
yarn add react-pdf-annotator-v2
```

or

```bash
pnpm add react-pdf-annotator-v2
```

## 🚀 Quick Start

```tsx
import React from 'react';
import { PdfViewer } from 'react-pdf-annotator-v2';
import 'react-pdf-annotator-v2/dist/style.css';

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <PdfViewer 
        fileUrl="https://example.com/sample.pdf" 
        fileName="sample.pdf" 
      />
    </div>
  );
}

export default App;
```

## 📖 API Reference

### PdfViewer Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `fileUrl` | `string` | Yes | URL of the PDF file to display |
| `fileName` | `string` | Yes | Name of the PDF file (used for downloads) |

### Available Exports

```tsx
// Main Component
import { PdfViewer } from 'react-pdf-annotator-v2';

// Sub-components (for custom layouts)
import { 
  PdfPage, 
  Toolbar, 
  AnnotationLayer,
  SignatureModal 
} from 'react-pdf-annotator-v2';

// Hooks
import { useAnnotationHistory } from 'react-pdf-annotator-v2';

// Types
import type { 
  AnnotationTool,
  Annotation,
  PenAnnotation,
  TextAnnotation,
  // ... other types
} from 'react-pdf-annotator-v2';

// Constants
import { 
  DEFAULT_COLOR,
  DEFAULT_STROKE_WIDTH,
  COLORS 
} from 'react-pdf-annotator-v2';
```

## 🎨 Customization

The package includes pre-built styles that use Tailwind CSS. The CSS is already bundled, so you don't need Tailwind CSS in your project.

Simply import the CSS file:

```tsx
import 'react-pdf-annotator-v2/dist/style.css';
```

The styles will work out of the box without any additional configuration.

## 🛠️ Advanced Usage

### Using the Annotation Hook

```tsx
import { useAnnotationHistory } from 'react-pdf-annotator-v2';

function CustomAnnotator() {
  const { 
    annotations, 
    addAnnotation, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useAnnotationHistory();

  // Your custom implementation
}
```

### TypeScript Support

The package is fully typed. Import types as needed:

```tsx
import type { 
  AnnotationTool, 
  Annotation, 
  PenAnnotation 
} from 'react-pdf-annotator-v2';

const tool: AnnotationTool = 'PEN';
const annotation: Annotation = {
  // ...
};
```

## 📋 Requirements

- React 18.0.0 or higher
- React DOM 18.0.0 or higher

## 🔧 Peer Dependencies

This package requires the following peer dependencies:

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

Make sure these are installed in your project.

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📮 Issues

If you encounter any issues or have suggestions, please file an issue on the [GitHub repository](https://github.com/yourusername/react-pdf-annotator-v2/issues).

## 🙏 Acknowledgments

Built with:
- [pdf-lib](https://github.com/Hopding/pdf-lib) - PDF manipulation
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF rendering
- React & TypeScript
- Tailwind CSS

## 📚 Documentation

For more detailed documentation and examples, visit the [documentation site](https://github.com/yourusername/react-pdf-annotator-v2).

---

Made with ❤️ for the React community
