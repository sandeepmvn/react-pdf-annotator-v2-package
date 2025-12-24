
import React, { useState, useCallback, useRef } from 'react';
import PdfViewer from './components/PdfViewer';
import type { PdfViewerRef, AnnotationExportData } from './components/PdfViewer';
import { UploadIcon } from './components/Icons';
import type { Annotations } from './types';
import type { HistoryState } from './hooks/useAnnotationHistory';

// A sample PDF file URL for demonstration purposes.
// You can replace this with any publicly accessible PDF URL.
const SAMPLE_PDF_URL = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

// Helper to parse annotation metadata from PDF subject field
const ANNOTATION_METADATA_PREFIX = 'PDF_ANNOTATOR_DATA::';
const parseAnnotationMetadata = (metadataString: string): HistoryState | null => {
  try {
    if (!metadataString.startsWith(ANNOTATION_METADATA_PREFIX)) {
      return null;
    }
    const jsonString = metadataString.substring(ANNOTATION_METADATA_PREFIX.length);
    return JSON.parse(jsonString) as HistoryState;
  } catch (error) {
    console.error('Failed to parse annotation metadata:', error);
    return null;
  }
};

const App: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<string | null>(SAMPLE_PDF_URL);
  const [fileName, setFileName] = useState<string>('sample.pdf');
  const [annotationsCount, setAnnotationsCount] = useState<number>(0);
  const [initialHistoryState, setInitialHistoryState] = useState<HistoryState | undefined>(undefined);
  const pdfViewerRef = useRef<PdfViewerRef>(null);

  const handleAnnotationsChange = useCallback((annotations: Annotations) => {
    // Count total annotations across all pages
    const total = Object.values(annotations).reduce(
      (sum, pageAnnotations) => sum + pageAnnotations.length,
      0
    );
    setAnnotationsCount(total);

    // Here you can save to localStorage, send to backend, etc.
  }, []);

  // Callback when PDF is saved/downloaded
  const handleSave = useCallback((data: AnnotationExportData) => {
    // Save to localStorage
    localStorage.setItem('pdf-annotation-data', JSON.stringify(data));

    // Example: Send to backend API
    // fetch('/api/save-annotations', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
  }, []);

  // Callback when PDF is printed
  const handlePrint = useCallback((_data: AnnotationExportData) => {
    // Handle print callback if needed
  }, []);

  const handleGetAnnotatedPdf = async () => {
    if (!pdfViewerRef.current) return;
    
    const blob = await pdfViewerRef.current.getAnnotatedDocument();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `annotated-${fileName}`;
      a.click();
      URL.revokeObjectURL(url);
      alert('Annotated PDF downloaded!');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);
      setPdfFile(URL.createObjectURL(file));
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  const loadSamplePdf = () => {
    setFileName('sample.pdf');
    setPdfFile(SAMPLE_PDF_URL);
    setInitialHistoryState(undefined); // Clear any previous annotations
  };

  // Load annotation data from a metadata string (e.g., from API or user input)
  const loadFromMetadataString = useCallback((metadataString: string) => {
    const historyState = parseAnnotationMetadata(metadataString);
    if (historyState) {
      setInitialHistoryState(historyState);
      alert('Annotation data loaded successfully!');
    } else {
      alert('Failed to parse annotation metadata. Please check the format.');
    }
  }, []);

  // Example: Load from localStorage
  const loadFromLocalStorage = useCallback(() => {
    const saved = localStorage.getItem('pdf-annotation-data');
    if (saved) {
      try {
        const data = JSON.parse(saved) as AnnotationExportData;
        setInitialHistoryState(data.historyState);
        alert('Loaded annotations from localStorage!');
      } catch (error) {
        console.error('Failed to load from localStorage:', error);
        alert('Failed to load saved annotations.');
      }
    } else {
      alert('No saved annotations found in localStorage.');
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      {pdfFile ? (
        <>
          <div className="bg-indigo-600 px-4 py-2 flex items-center justify-between">
            <span className="text-sm font-medium">
              {annotationsCount > 0 ? (
                <>📝 {annotationsCount} annotation{annotationsCount !== 1 ? 's' : ''} added</>
              ) : (
                <>PDF Annotator</>
              )}
            </span>
            <div className="flex gap-2">
              <button
                onClick={loadFromLocalStorage}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-green-600 transition-colors"
                title="Load saved annotations from browser storage"
              >
                Load Saved
              </button>
              <button
                onClick={() => {
                  const metadata = prompt('Paste the annotation metadata string (starts with PDF_ANNOTATOR_DATA::)');
                  if (metadata) loadFromMetadataString(metadata);
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
                title="Load annotations from metadata string"
              >
                Load from String
              </button>
              {annotationsCount > 0 && (
                <button
                  onClick={handleGetAnnotatedPdf}
                  className="bg-white text-indigo-600 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  Get Annotated PDF
                </button>
              )}
            </div>
          </div>
          <PdfViewer
            ref={pdfViewerRef}
            key={pdfFile}
            fileUrl={pdfFile}
            fileName={fileName}
            onAnnotationsChange={handleAnnotationsChange}
            initialHistoryState={initialHistoryState}
            onSave={handleSave}
            onPrint={handlePrint}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-xl bg-gray-800 shadow-2xl">
            <div className="mx-auto h-16 w-16 text-gray-400">
              <UploadIcon />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">Upload a PDF to get started</h2>
            <p className="mt-2 text-sm text-gray-400">Drag and drop a file or click to select.</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
              >
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
              </label>
              <button
                onClick={loadSamplePdf}
                className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 transition-colors"
              >
                Load Sample PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
