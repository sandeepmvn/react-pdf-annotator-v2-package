
import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import Toolbar from './Toolbar';
import PdfPage from './PdfPage';
import SignatureModal from './modals/SignatureModal';
import { useAnnotationHistory } from '../hooks/useAnnotationHistory';
import { AnnotationTool, Annotation } from '../types';
import { PDFDocument, rgb, StandardFonts, LineCapStyle, PDFImage } from 'pdf-lib';
import { DEFAULT_COLOR, DEFAULT_FONT_SIZE, DEFAULT_STROKE_WIDTH } from '../constants';

// Fix: Declare pdfjsLib as a global variable to satisfy TypeScript when using the CDN version.
declare const pdfjsLib: any;

export interface PdfViewerRef {
  getAnnotatedDocument: () => Promise<Blob | null>;
  getAnnotatedDocumentUrl: () => Promise<string | null>;
}

interface PdfViewerProps {
  fileUrl: string;
  fileName: string;
  readonly?: boolean;
  onAnnotationsChange?: (annotations: Record<number, Annotation[]>) => void;
}

const PdfViewer = forwardRef<PdfViewerRef, PdfViewerProps>(({ fileUrl, fileName, readonly = false, onAnnotationsChange }, ref) => {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [activeTool, setActiveTool] = useState<AnnotationTool>('SELECT');
  const [toolColor, setToolColor] = useState(DEFAULT_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(DEFAULT_STROKE_WIDTH);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [initialsData, setInitialsData] = useState<string | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState<'SIGNATURE' | 'INITIALS' | null>(null);
  const [activeStamp, setActiveStamp] = useState<string>('APPROVED');

  const { annotations, addAnnotation, deleteAnnotation, updateAnnotation, clearAnnotations, undo, redo, canUndo, canRedo } = useAnnotationHistory();
  const viewerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Notify parent component whenever annotations change
  useEffect(() => {
    if (onAnnotationsChange) {
      onAnnotationsChange(annotations);
    }
  }, [annotations, onAnnotationsChange]);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const pdfDocument = await loadingTask.promise;
        setPdf(pdfDocument);
        setTotalPages(pdfDocument.numPages);
        pageRefs.current = Array(pdfDocument.numPages).fill(null);
        setCurrentPage(1);
        clearAnnotations();
      } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Failed to load PDF file.');
      }
    };
    loadPdf();
  }, [fileUrl, clearAnnotations]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      pageRefs.current[page - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDeleteSelected = useCallback(() => {
    if (!selectedAnnotationId) return;
    for (const pageNumStr in annotations) {
      const pageNum = parseInt(pageNumStr, 10);
      if (annotations[pageNum].some(ann => ann.id === selectedAnnotationId)) {
        deleteAnnotation(pageNum, selectedAnnotationId);
        setSelectedAnnotationId(null);
        break;
      }
    }
  }, [selectedAnnotationId, annotations, deleteAnnotation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedAnnotationId) {
        e.preventDefault();
        handleDeleteSelected();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAnnotationId, handleDeleteSelected, undo, redo]);

  const generateAnnotatedPdf = useCallback(async () => {
    if (!pdf) return null;
    
    const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pdfLibPages = pdfDoc.getPages();

    const embeddedImages: Record<string, PDFImage> = {};

    for (const pageNumStr in annotations) {
        const pageNum = parseInt(pageNumStr, 10);
        if (pageNum < 1 || pageNum > pdfLibPages.length) continue;

        const pageAnnotations = annotations[pageNum];
        const pdfLibPage = pdfLibPages[pageNum - 1];
        const { width: pdfLibPageWidth, height: pdfLibPageHeight } = pdfLibPage.getSize();
        
        const pdfjsPage = await pdf.getPage(pageNum);
        const viewport = pdfjsPage.getViewport({ scale: 1 });
        
        const scaleX = pdfLibPageWidth / viewport.width;
        const scaleY = pdfLibPageHeight / viewport.height;

        for (const annotation of pageAnnotations) {
            const color = rgb(
                parseInt(annotation.color.slice(1, 3), 16) / 255,
                parseInt(annotation.color.slice(3, 5), 16) / 255,
                parseInt(annotation.color.slice(5, 7), 16) / 255
            );
            const y = (yPos: number) => pdfLibPageHeight - yPos * scaleY;

            switch (annotation.type) {
                case 'PEN':
                case 'UNDERLINE':
                case 'STRIKETHROUGH':
                    if (annotation.points.length > 1) {
                        const path = annotation.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * scaleX} ${y(p.y)}`).join(' ');
                        pdfLibPage.drawSvgPath(path, { borderColor: color, borderWidth: annotation.strokeWidth, borderLineCap: LineCapStyle.Round });
                    }
                    break;
                case 'SQUIGGLY':
                    if (annotation.points.length > 1) {
                        let path = `M ${annotation.points[0].x * scaleX} ${y(annotation.points[0].y)}`;
                        for (let i = 1; i < annotation.points.length; i++) {
                            const p = annotation.points[i];
                            const amplitude = 2;
                            path += ` Q ${(p.x - 2.5) * scaleX} ${y(p.y + (i % 2 === 0 ? -1 : 1) * amplitude)}, ${p.x * scaleX} ${y(p.y)}`;
                        }
                        pdfLibPage.drawSvgPath(path, { borderColor: color, borderWidth: annotation.strokeWidth });
                    }
                    break;
                case 'HIGHLIGHTER':
                     if (annotation.points.length > 1) {
                        const path = annotation.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * scaleX} ${y(p.y)}`).join(' ');
                        pdfLibPage.drawSvgPath(path, { borderColor: color, borderWidth: annotation.strokeWidth * 5, opacity: 0.4, borderLineCap: LineCapStyle.Round, borderOpacity: 0.4 });
                    }
                    break;
                case 'RECTANGLE':
                    pdfLibPage.drawRectangle({
                        x: annotation.x * scaleX,
                        y: y(annotation.y + annotation.height),
                        width: annotation.width * scaleX,
                        height: annotation.height * scaleY,
                        borderColor: color,
                        borderWidth: annotation.strokeWidth,
                    });
                    break;
                case 'CIRCLE':
                    pdfLibPage.drawEllipse({
                        x: annotation.cx * scaleX,
                        y: y(annotation.cy),
                        xScale: annotation.rx * scaleX,
                        yScale: annotation.ry * scaleY,
                        borderColor: color,
                        borderWidth: annotation.strokeWidth,
                    });
                    break;
                case 'TEXT':
                    pdfLibPage.drawText(annotation.content, {
                        x: annotation.x * scaleX,
                        y: y(annotation.y + annotation.fontSize),
                        size: annotation.fontSize * scaleY,
                        font: helveticaFont,
                        color,
                    });
                    break;
                case 'STAMP':
                    pdfLibPage.drawRectangle({
                        x: annotation.x * scaleX,
                        y: y(annotation.y + annotation.height),
                        width: annotation.width * scaleX,
                        height: annotation.height * scaleY,
                        borderColor: color,
                        borderWidth: 2,
                        borderOpacity: 0.8,
                    });
                    const stampText = annotation.text;
                    const textWidth = helveticaBoldFont.widthOfTextAtSize(stampText, annotation.fontSize * scaleY);
                    pdfLibPage.drawText(stampText, {
                        x: (annotation.x + annotation.width / 2) * scaleX - textWidth / 2,
                        y: y(annotation.y + annotation.height * 0.35),
                        font: helveticaBoldFont,
                        size: annotation.fontSize * scaleY,
                        color,
                        opacity: 0.8,
                    });
                    if (annotation.timestamp) {
                        const timestampSize = annotation.fontSize * 0.45 * scaleY;
                        const timestampWidth = helveticaFont.widthOfTextAtSize(annotation.timestamp, timestampSize);
                        pdfLibPage.drawText(annotation.timestamp, {
                            x: (annotation.x + annotation.width / 2) * scaleX - timestampWidth / 2,
                            y: y(annotation.y + annotation.height * 0.7),
                            font: helveticaFont,
                            size: timestampSize,
                            color,
                            opacity: 0.7,
                        });
                    }
                    break;
                case 'SIGNATURE':
                case 'INITIALS':
                    if (!embeddedImages[annotation.imageData]) {
                        embeddedImages[annotation.imageData] = await pdfDoc.embedPng(annotation.imageData);
                    }
                    const image = embeddedImages[annotation.imageData];
                    pdfLibPage.drawImage(image, {
                        x: annotation.x * scaleX,
                        y: y(annotation.y + annotation.height),
                        width: annotation.width * scaleX,
                        height: annotation.height * scaleY,
                    });
                    break;
            }
        }
    }
    return await pdfDoc.save();
  }, [pdf, fileUrl, annotations]);

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    getAnnotatedDocument: async () => {
      try {
        const pdfBytes = await generateAnnotatedPdf();
        if (!pdfBytes) return null;
        return new Blob([pdfBytes as any], { type: 'application/pdf' });
      } catch (error) {
        console.error('Failed to generate annotated document:', error);
        return null;
      }
    },
    getAnnotatedDocumentUrl: async () => {
      try {
        const pdfBytes = await generateAnnotatedPdf();
        if (!pdfBytes) return null;
        const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error('Failed to generate annotated document URL:', error);
        return null;
      }
    }
  }), [generateAnnotatedPdf]);

  const handleAction = useCallback(async (action: 'download' | 'print') => {
    setIsProcessing(true);
    try {
        const pdfBytes = await generateAnnotatedPdf();
        if (!pdfBytes) {
            setIsProcessing(false);
            return;
        }

        const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        if (action === 'download') {
            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileName.replace('.pdf', '')}-annotated.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else { // print
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);
            iframe.onload = () => {
                setTimeout(() => {
                    try {
                        iframe.contentWindow?.focus();
                        iframe.contentWindow?.print();
                    } catch (e) {
                        console.error("Printing failed:", e);
                        alert("Could not print the document. Your browser might be blocking it.");
                    }
                    // Clean up after a delay
                    setTimeout(() => {
                        if (document.body.contains(iframe)) {
                            document.body.removeChild(iframe);
                            URL.revokeObjectURL(url);
                        }
                    }, 1000);
                }, 1);
            };
        }
    } catch (error) {
        console.error(`Failed to ${action} annotated PDF:`, error);
        alert(`An error occurred while preparing the PDF for ${action}.`);
    } finally {
        setIsProcessing(false);
    }
  }, [generateAnnotatedPdf, fileName]);

  const renderPages = () => {
    if (!pdf) return null;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <div key={i} ref={el => { pageRefs.current[i - 1] = el; }} data-page-number={i}>
            <PdfPage
              pdf={pdf}
              pageNumber={i}
              zoom={zoom}
              activeTool={activeTool}
              toolColor={toolColor}
              strokeWidth={strokeWidth}
              fontSize={fontSize}
              annotations={annotations[i] || []}
              addAnnotation={(annotation: Omit<Annotation, 'id' | 'page'>) => addAnnotation(i, annotation)}
              deleteAnnotation={(annotationId: string) => deleteAnnotation(i, annotationId)}
              updateAnnotation={updateAnnotation}
              selectedAnnotationId={selectedAnnotationId}
              setSelectedAnnotationId={setSelectedAnnotationId}
              signatureData={signatureData}
              initialsData={initialsData}
              activeStamp={activeStamp}
              readonly={readonly}
            />
        </div>
      );
    }
    return pages;
  };

  return (
    <div className="flex flex-col h-screen w-full">
      {showSignatureModal && (
        <SignatureModal
          title={showSignatureModal === 'SIGNATURE' ? 'Create Signature' : 'Create Initials'}
          onClose={() => setShowSignatureModal(null)}
          onSave={(data) => {
            if (showSignatureModal === 'SIGNATURE') setSignatureData(data);
            else setInitialsData(data);
          }}
        />
      )}
      <Toolbar
        fileName={fileName}
        currentPage={currentPage}
        totalPages={totalPages}
        zoom={zoom}
        setZoom={setZoom}
        setCurrentPage={handlePageChange}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        toolColor={toolColor}
        setToolColor={setToolColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onDownload={() => handleAction('download')}
        onPrint={() => handleAction('print')}
        isProcessing={isProcessing}
        onDelete={handleDeleteSelected}
        selectedAnnotationId={selectedAnnotationId}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onSignatureClick={() => setShowSignatureModal('SIGNATURE')}
        onInitialsClick={() => setShowSignatureModal('INITIALS')}
        activeStamp={activeStamp}
        setActiveStamp={setActiveStamp}
        readonly={readonly}
      />
      <div ref={viewerRef} className="flex-grow overflow-auto bg-gray-800 p-4">
        <div id="pdf-print-area" className="mx-auto">
          {pdf ? renderPages() : <div className="flex items-center justify-center h-full"><p className="text-xl">Loading PDF...</p></div>}
        </div>
      </div>
    </div>
  );
});

PdfViewer.displayName = 'PdfViewer';

export default PdfViewer;
