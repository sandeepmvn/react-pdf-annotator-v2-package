
import React, { useState, useCallback, useRef } from 'react';
import PdfViewer from './components/PdfViewer';
import type { PdfViewerRef } from './components/PdfViewer';
import { UploadIcon } from './components/Icons';
import type { Annotations } from './types';

// A sample PDF file URL for demonstration purposes.
// You can replace this with any publicly accessible PDF URL.
const SAMPLE_PDF_URL = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

const App: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<string | null>(SAMPLE_PDF_URL);
  const [fileName, setFileName] = useState<string>('sample.pdf');
  const [annotationsCount, setAnnotationsCount] = useState<number>(0);
  const pdfViewerRef = useRef<PdfViewerRef>(null);

  const handleAnnotationsChange = useCallback((annotations: Annotations) => {
    // Count total annotations across all pages
    const total = Object.values(annotations).reduce(
      (sum, pageAnnotations) => sum + pageAnnotations.length,
      0
    );
    setAnnotationsCount(total);
    
    // Here you can save to localStorage, send to backend, etc.
    console.log('Annotations changed:', annotations);
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
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      {pdfFile ? (
        <>
          {annotationsCount > 0 && (
            <div className="bg-indigo-600 px-4 py-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                📝 {annotationsCount} annotation{annotationsCount !== 1 ? 's' : ''} added
              </span>
              <button
                onClick={handleGetAnnotatedPdf}
                className="bg-white text-indigo-600 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Annotated PDF
              </button>
            </div>
          )}
          <PdfViewer 
            ref={pdfViewerRef}
            key={pdfFile} 
            fileUrl={pdfFile} 
            fileName={fileName}
            onAnnotationsChange={handleAnnotationsChange}
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
