import React from 'react';
import { PdfViewer } from 'react-pdf-annotator-v2';
import 'react-pdf-annotator-v2/dist/style.css';

/**
 * Example: Basic Usage
 * 
 * This is the simplest way to use the PDF annotator.
 * Just provide a PDF URL and filename.
 */
function BasicExample() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <PdfViewer 
        fileUrl="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
        fileName="sample.pdf"
      />
    </div>
  );
}

/**
 * Example: With File Upload
 * 
 * Allow users to upload their own PDF files.
 */
function FileUploadExample() {
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfUrl(URL.createObjectURL(file));
      setFileName(file.name);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  if (!pdfUrl) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Upload PDF</h1>
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange}
        />
      </div>
    );
  }

  return (
    <div style={{ height: '100vh' }}>
      <PdfViewer fileUrl={pdfUrl} fileName={fileName} />
    </div>
  );
}

/**
 * Example: With Custom Wrapper
 * 
 * Wrap the PDF viewer in your own layout with custom styling.
 */
function CustomWrapperExample() {
  return (
    <div style={{ 
      height: '100vh', 
      background: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header style={{ 
        padding: '1rem', 
        background: '#2d2d2d',
        color: 'white'
      }}>
        <h1>My Custom PDF Annotator</h1>
      </header>
      
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PdfViewer 
          fileUrl="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
          fileName="document.pdf"
        />
      </div>
      
      <footer style={{ 
        padding: '0.5rem', 
        background: '#2d2d2d',
        color: '#888',
        textAlign: 'center'
      }}>
        Powered by React PDF Annotator
      </footer>
    </div>
  );
}

/**
 * Example: Multiple Documents
 * 
 * Switch between different PDF documents.
 */
function MultipleDocumentsExample() {
  const documents = [
    { url: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf', name: 'Document 1' },
    { url: 'https://example.com/another-document.pdf', name: 'Document 2' },
  ];

  const [currentDoc, setCurrentDoc] = React.useState(0);

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <aside style={{ 
        width: '200px', 
        background: '#2d2d2d', 
        padding: '1rem',
        color: 'white'
      }}>
        <h3>Documents</h3>
        {documents.map((doc, index) => (
          <button
            key={index}
            onClick={() => setCurrentDoc(index)}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.5rem',
              margin: '0.5rem 0',
              background: currentDoc === index ? '#4a4a4a' : '#3a3a3a',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {doc.name}
          </button>
        ))}
      </aside>
      
      <main style={{ flex: 1 }}>
        <PdfViewer 
          key={currentDoc} // Force remount on document change
          fileUrl={documents[currentDoc].url}
          fileName={documents[currentDoc].name}
        />
      </main>
    </div>
  );
}

/**
 * Example: With Annotations Change Tracking
 * 
 * Track and persist annotation changes in real-time.
 */
function AnnotationTrackingExample() {
  const [annotationsCount, setAnnotationsCount] = React.useState(0);
  const [lastChange, setLastChange] = React.useState<string>('No changes yet');

  const handleAnnotationsChange = (annotations: Record<number, any[]>) => {
    // Count total annotations across all pages
    const total = Object.values(annotations).reduce(
      (sum, pageAnnotations) => sum + pageAnnotations.length, 
      0
    );
    setAnnotationsCount(total);
    setLastChange(new Date().toLocaleTimeString());
    
    // Here you could save to localStorage, database, etc.
    // localStorage.setItem('annotations', JSON.stringify(annotations));
    console.log('Annotations updated:', annotations);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        padding: '1rem', 
        background: '#2d2d2d',
        color: 'white',
        display: 'flex',
        gap: '2rem'
      }}>
        <div>Total Annotations: <strong>{annotationsCount}</strong></div>
        <div>Last Change: <strong>{lastChange}</strong></div>
      </div>
      
      <div style={{ flex: 1 }}>
        <PdfViewer 
          fileUrl="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
          fileName="tracked-document.pdf"
          onAnnotationsChange={handleAnnotationsChange}
        />
      </div>
    </div>
  );
}

/**
 * Example: Getting Annotated Document Programmatically
 * 
 * Use refs to access the annotated PDF document programmatically.
 */
function GetAnnotatedDocumentExample() {
  const pdfViewerRef = React.useRef<any>(null);
  const [status, setStatus] = React.useState<string>('');

  const handleSaveToServer = async () => {
    if (!pdfViewerRef.current) return;
    
    setStatus('Generating annotated PDF...');
    const blob = await pdfViewerRef.current.getAnnotatedDocument();
    
    if (blob) {
      // Simulate server upload
      setStatus(`PDF ready! Size: ${(blob.size / 1024).toFixed(2)} KB`);
      
      // In real app, you would upload to server:
      // const formData = new FormData();
      // formData.append('file', blob, 'annotated.pdf');
      // await fetch('/api/upload', { method: 'POST', body: formData });
      
      // For demo, just download it
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'annotated-document.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      setStatus('Failed to generate PDF');
    }
  };

  const handlePreview = async () => {
    if (!pdfViewerRef.current) return;
    
    setStatus('Opening preview...');
    const url = await pdfViewerRef.current.getAnnotatedDocumentUrl();
    
    if (url) {
      window.open(url, '_blank');
      setStatus('Preview opened in new tab');
      // Note: In production, remember to revoke URL after use
      // setTimeout(() => URL.revokeObjectURL(url), 60000);
    } else {
      setStatus('Failed to generate preview');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        padding: '1rem', 
        background: '#2d2d2d',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleSaveToServer}
            style={{
              padding: '0.5rem 1rem',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save to Server
          </button>
          <button 
            onClick={handlePreview}
            style={{
              padding: '0.5rem 1rem',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Preview in New Tab
          </button>
        </div>
        {status && <span style={{ fontSize: '0.875rem' }}>{status}</span>}
      </div>
      
      <div style={{ flex: 1 }}>
        <PdfViewer 
          ref={pdfViewerRef}
          fileUrl="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
          fileName="document.pdf"
        />
      </div>
    </div>
  );
}

/**
 * Example: Read-only Mode
 *
 * Display a PDF without annotation tools (view-only).
 */
function ReadOnlyExample() {
  return (
    <div style={{ height: '100vh' }}>
      <PdfViewer
        fileUrl="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
        fileName="readonly-document.pdf"
        readonly={true}
      />
    </div>
  );
}

/**
 * Example: Annotation Persistence with localStorage
 *
 * Save and restore annotations using browser localStorage.
 * Annotations persist across page reloads.
 */
function AnnotationPersistenceExample() {
  const [initialHistoryState, setInitialHistoryState] = React.useState<any>(undefined);
  const [saveStatus, setSaveStatus] = React.useState<string>('');

  // Called when user downloads the PDF
  const handleSave = React.useCallback((data: any) => {
    try {
      localStorage.setItem('pdf-annotation-data', JSON.stringify(data));
      setSaveStatus('Annotations saved to localStorage!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Failed to save annotations:', error);
      setSaveStatus('Failed to save annotations');
    }
  }, []);

  // Called when user prints the PDF
  const handlePrint = React.useCallback((data: any) => {
    console.log('Document printed with annotations:', data);
  }, []);

  // Load saved annotations from localStorage
  const loadSavedAnnotations = () => {
    try {
      const saved = localStorage.getItem('pdf-annotation-data');
      if (saved) {
        const data = JSON.parse(saved);
        setInitialHistoryState(data.historyState);
        setSaveStatus('Annotations loaded from localStorage!');
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('No saved annotations found');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (error) {
      console.error('Failed to load annotations:', error);
      setSaveStatus('Failed to load annotations');
    }
  };

  // Clear saved annotations
  const clearSavedAnnotations = () => {
    localStorage.removeItem('pdf-annotation-data');
    setInitialHistoryState(undefined);
    setSaveStatus('Saved annotations cleared!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '1rem',
        background: '#2d2d2d',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={loadSavedAnnotations}
            style={{
              padding: '0.5rem 1rem',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Load Saved Annotations
          </button>
          <button
            onClick={clearSavedAnnotations}
            style={{
              padding: '0.5rem 1rem',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear Saved
          </button>
        </div>
        {saveStatus && (
          <span style={{ fontSize: '0.875rem', color: '#4CAF50' }}>
            {saveStatus}
          </span>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <PdfViewer
          fileUrl="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
          fileName="persistent-document.pdf"
          initialHistoryState={initialHistoryState}
          onSave={handleSave}
          onPrint={handlePrint}
        />
      </div>
    </div>
  );
}

/**
 * Example: Annotation Export and Import
 *
 * Export annotation data to JSON and import it back.
 * Useful for sharing annotations between users or systems.
 */
function AnnotationExportImportExample() {
  const [initialHistoryState, setInitialHistoryState] = React.useState<any>(undefined);
  const pdfViewerRef = React.useRef<any>(null);
  const [status, setStatus] = React.useState<string>('');

  // Export current annotations as JSON
  const handleExportAnnotations = () => {
    if (!pdfViewerRef.current) return;

    const data = pdfViewerRef.current.getAnnotationData();
    const jsonString = JSON.stringify(data, null, 2);

    // Download as JSON file
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'annotations.json';
    a.click();
    URL.revokeObjectURL(url);

    setStatus('Annotations exported to annotations.json');
    setTimeout(() => setStatus(''), 3000);
  };

  // Import annotations from JSON file
  const handleImportAnnotations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        setInitialHistoryState(data.historyState);
        setStatus('Annotations imported successfully!');
        setTimeout(() => setStatus(''), 3000);
      } catch (error) {
        console.error('Failed to import annotations:', error);
        setStatus('Failed to import annotations');
        setTimeout(() => setStatus(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '1rem',
        background: '#2d2d2d',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleExportAnnotations}
            style={{
              padding: '0.5rem 1rem',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Export Annotations
          </button>
          <label
            style={{
              padding: '0.5rem 1rem',
              background: '#4CAF50',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'inline-block'
            }}
          >
            Import Annotations
            <input
              type="file"
              accept=".json"
              onChange={handleImportAnnotations}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        {status && (
          <span style={{ fontSize: '0.875rem' }}>{status}</span>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <PdfViewer
          ref={pdfViewerRef}
          fileUrl="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
          fileName="export-import-document.pdf"
          initialHistoryState={initialHistoryState}
        />
      </div>
    </div>
  );
}

/**
 * Example: Backend Integration
 *
 * Save annotations to a backend server and load them back.
 * This example shows how to integrate with a REST API.
 */
function BackendIntegrationExample() {
  const [documentId] = React.useState('doc-12345');
  const [initialHistoryState, setInitialHistoryState] = React.useState<any>(undefined);
  const [status, setStatus] = React.useState<string>('');

  // Load annotations from backend on mount
  React.useEffect(() => {
    loadAnnotationsFromBackend();
  }, []);

  const loadAnnotationsFromBackend = async () => {
    try {
      setStatus('Loading annotations from server...');
      // Example API call
      const response = await fetch(`/api/documents/${documentId}/annotations`);
      if (response.ok) {
        const data = await response.json();
        setInitialHistoryState(data.historyState);
        setStatus('Annotations loaded from server');
      } else {
        setStatus('No annotations found on server');
      }
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Failed to load annotations:', error);
      setStatus('Failed to load annotations from server');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  // Save annotations to backend when user downloads
  const handleSave = React.useCallback(async (data: any) => {
    try {
      setStatus('Saving annotations to server...');
      const response = await fetch(`/api/documents/${documentId}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setStatus('Annotations saved to server!');
      } else {
        setStatus('Failed to save annotations to server');
      }
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Failed to save annotations:', error);
      setStatus('Failed to save annotations to server');
      setTimeout(() => setStatus(''), 3000);
    }
  }, [documentId]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '1rem',
        background: '#2d2d2d',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>Document ID: <strong>{documentId}</strong></div>
        {status && (
          <span style={{ fontSize: '0.875rem' }}>{status}</span>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <PdfViewer
          fileUrl="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
          fileName="backend-document.pdf"
          initialHistoryState={initialHistoryState}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}

export default BasicExample;
// Export all examples
export {
  FileUploadExample,
  CustomWrapperExample,
  MultipleDocumentsExample,
  AnnotationTrackingExample,
  GetAnnotatedDocumentExample,
  ReadOnlyExample,
  AnnotationPersistenceExample,
  AnnotationExportImportExample,
  BackendIntegrationExample
};
