# React PDF Annotator v2

A feature-rich, fully customizable PDF viewer and annotator component for React applications. Built with TypeScript, this package provides comprehensive annotation tools including drawing, highlighting, text, shapes, stamps, and digital signatures.

## ✨ Features

- 📄 **PDF Viewing**: Smooth PDF rendering with zoom controls and page navigation
- 🎨 **Drawing Tools**: Pen and highlighter with customizable colors and stroke widths
- ✏️ **Text Annotation**: Add text boxes with custom colors and font sizes
- 📐 **Shapes**: Rectangle and circle annotations
- 🖍️ **Text Markup**: squiggly line tool
- 🔖 **Stamps**: Pre-defined stamps (Approved, Confidential, etc.)
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

### Read-only Mode

To display a PDF without annotation tools (view-only mode):

```tsx
<PdfViewer 
  fileUrl="https://example.com/sample.pdf" 
  fileName="sample.pdf" 
  readonly={true}
/>
```

### Tracking Annotation Changes

To receive real-time updates when annotations are added, modified, or deleted:

```tsx
import { Annotations } from 'react-pdf-annotator-v2';

function App() {
  const handleAnnotationsChange = (annotations: Annotations) => {
    console.log('Annotations updated:', annotations);
    // Save to database, update state, etc.
  };

  return (
    <PdfViewer 
      fileUrl="https://example.com/sample.pdf" 
      fileName="sample.pdf" 
      onAnnotationsChange={handleAnnotationsChange}
    />
  );
}
```

The `annotations` parameter is an object where keys are page numbers and values are arrays of annotations:

```typescript
{
  1: [{ id: '...', type: 'PEN', points: [...], color: '#000000', ... }],
  2: [{ id: '...', type: 'TEXT', content: 'Hello', x: 100, y: 200, ... }],
  // ...
}
```

### Getting Annotated Document

Use refs to programmatically get the current annotated PDF as a Blob or URL:

```tsx
import { useRef } from 'react';
import { PdfViewer, PdfViewerRef } from 'react-pdf-annotator-v2';

function App() {
  const pdfViewerRef = useRef<PdfViewerRef>(null);

  const handleSave = async () => {
    if (!pdfViewerRef.current) return;

    // Get as Blob
    const blob = await pdfViewerRef.current.getAnnotatedDocument();
    if (blob) {
      // Upload to server
      const formData = new FormData();
      formData.append('file', blob, 'annotated.pdf');
      await fetch('/api/upload', { method: 'POST', body: formData });
    }
  };

  const handlePreview = async () => {
    if (!pdfViewerRef.current) return;

    // Get as URL for preview
    const url = await pdfViewerRef.current.getAnnotatedDocumentUrl();
    if (url) {
      window.open(url, '_blank');
      // Remember to revoke URL when done: URL.revokeObjectURL(url)
    }
  };

  // Get annotation data separately (without generating PDF)
  const handleGetAnnotationData = () => {
    if (!pdfViewerRef.current) return;

    const data = pdfViewerRef.current.getAnnotationData();
    console.log('Current annotations:', data.annotations);
    console.log('History state:', data.historyState);

    // Save to database, send to API, etc.
    fetch('/api/save-annotations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  };

  return (
    <>
      <button onClick={handleSave}>Save to Server</button>
      <button onClick={handlePreview}>Preview</button>
      <button onClick={handleGetAnnotationData}>Get Annotation Data</button>
      <PdfViewer
        ref={pdfViewerRef}
        fileUrl="https://example.com/sample.pdf"
        fileName="sample.pdf"
      />
    </>
  );
}
```

### Managing Annotation State

The package now supports advanced annotation state management, allowing you to save and restore annotations with full undo/redo history:

```tsx
import { useState, useCallback } from 'react';
import { PdfViewer, AnnotationExportData } from 'react-pdf-annotator-v2';
import type { HistoryState } from 'react-pdf-annotator-v2';

function App() {
  const [initialHistoryState, setInitialHistoryState] = useState<HistoryState>();

  // Called when user downloads or prints the PDF
  const handleSave = useCallback((data: AnnotationExportData) => {
    // Save to localStorage
    localStorage.setItem('annotations', JSON.stringify(data));

    // Or save to backend
    fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }, []);

  const handlePrint = useCallback((data: AnnotationExportData) => {
    // Optionally save on print as well
    console.log('Document printed with annotations:', data);
  }, []);

  // Load saved annotations
  const loadSavedAnnotations = () => {
    const saved = localStorage.getItem('annotations');
    if (saved) {
      const data = JSON.parse(saved) as AnnotationExportData;
      setInitialHistoryState(data.historyState);
    }
  };

  return (
    <>
      <button onClick={loadSavedAnnotations}>Load Saved Annotations</button>
      <PdfViewer
        fileUrl="https://example.com/sample.pdf"
        fileName="sample.pdf"
        initialHistoryState={initialHistoryState}
        onSave={handleSave}
        onPrint={handlePrint}
      />
    </>
  );
}
```

### Loading Annotations from PDF Metadata

Annotations are automatically embedded in the PDF when downloaded. When you open an annotated PDF, the annotations are automatically restored:

```tsx
function App() {
  const [pdfUrl, setPdfUrl] = useState('https://example.com/sample.pdf');

  // When user uploads a previously annotated PDF
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      // Annotations will be automatically loaded from PDF metadata
    }
  };

  return (
    <>
      <input type="file" accept=".pdf" onChange={handleFileUpload} />
      <PdfViewer
        fileUrl={pdfUrl}
        fileName="document.pdf"
      />
    </>
  );
}
```

## 📖 API Reference

### PdfViewer Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `fileUrl` | `string` | Yes | - | URL of the PDF file to display |
| `fileName` | `string` | Yes | - | Name of the PDF file (used for downloads) |
| `readonly` | `boolean` | No | `false` | Hide annotation tools and prevent editing |
| `onAnnotationsChange` | `(annotations: Annotations) => void` | No | - | Callback fired when annotations change (add/update/delete/undo/redo) |
| `initialAnnotations` | `Record<number, Annotation[]>` | No | - | Initial annotations to load (basic, without undo history) |
| `initialHistoryState` | `HistoryState` | No | - | Initial annotation state with full undo/redo history |
| `onSave` | `(data: AnnotationExportData) => void` | No | - | Callback when user downloads the PDF |
| `onPrint` | `(data: AnnotationExportData) => void` | No | - | Callback when user prints the PDF |
| `ref` | `React.Ref<PdfViewerRef>` | No | - | Ref to access component methods |

### PdfViewerRef Methods

When using a ref, the following methods are available:

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getAnnotatedDocument()` | `Promise<Blob \| null>` | Returns the current PDF with annotations as a Blob |
| `getAnnotatedDocumentUrl()` | `Promise<string \| null>` | Returns an object URL of the annotated PDF (remember to revoke when done) |
| `getAnnotationData()` | `AnnotationExportData` | Returns current annotations and history state without generating PDF |

### Available Exports

```tsx
// Main Component and Types
import { PdfViewer } from 'react-pdf-annotator-v2';
import type {
  PdfViewerRef,
  AnnotationExportData
} from 'react-pdf-annotator-v2';

// Sub-components (for custom layouts)
import {
  PdfPage,
  Toolbar,
  AnnotationLayer,
  SignatureModal
} from 'react-pdf-annotator-v2';

// Hooks
import { useAnnotationHistory } from 'react-pdf-annotator-v2';
import type { HistoryState } from 'react-pdf-annotator-v2';

// Types
import type {
  AnnotationTool,
  Annotation,
  Annotations,
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

### Type Definitions

```typescript
// Annotation data export structure
interface AnnotationExportData {
  annotations: Record<number, Annotation[]>;
  historyState: HistoryState;
}

// History state for undo/redo
interface HistoryState {
  history: Record<number, Annotation[]>[];
  index: number;
}
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

If you encounter any issues or have suggestions, please file an issue on the [GitHub repository](https://github.com/sandeepmvn/react-pdf-annotator-v2-package/issues).

## 🙏 Acknowledgments

Built with:
- [pdf-lib](https://github.com/Hopding/pdf-lib) - PDF manipulation
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF rendering
- React & TypeScript
- Tailwind CSS

## 📚 Documentation

For more detailed documentation and examples, visit the [documentation site](https://github.com/sandeepmvn/react-pdf-annotator-v2-package).

---

Made with ❤️ for the React community
