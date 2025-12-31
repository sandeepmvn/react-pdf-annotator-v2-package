
import React, { useRef, useEffect, useState } from 'react';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
import { TextLayer } from 'pdfjs-dist';
import AnnotationLayer from './AnnotationLayer';
import { Annotation, AnnotationTool } from '../types';

interface PdfPageProps {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  zoom: number;
  activeTool: AnnotationTool;
  toolColor: string;
  strokeWidth: number;
  fontSize: number;
  annotations: Annotation[];
  addAnnotation: (annotation: Omit<Annotation, 'id' | 'page'>) => void;
  deleteAnnotation: (annotationId: string) => void;
  updateAnnotation: (annotation: Annotation) => void;
  selectedAnnotationId: string | null;
  setSelectedAnnotationId: (id: string | null) => void;
  signatureData: string | null;
  initialsData: string | null;
  activeStamp: string;
  readonly?: boolean;
}

const PdfPage: React.FC<PdfPageProps> = (props) => {
  const { pdf, pageNumber, zoom } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<PDFPageProxy | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    pdf.getPage(pageNumber).then(setPage);
  }, [pdf, pageNumber]);

  useEffect(() => {
    if (page && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      // Cancel any ongoing render task before starting a new one
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      const viewport = page.getViewport({ scale: zoom });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setDimensions({ width: viewport.width, height: viewport.height });

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;

      renderTask.promise.then(async () => {
        renderTaskRef.current = null;

        // Render text layer for text selection
        if (textLayerRef.current) {
          textLayerRef.current.innerHTML = '';
          const textContent = await page.getTextContent();
          const textLayer = new TextLayer({
            textContentSource: textContent,
            container: textLayerRef.current,
            viewport: viewport,
          });
          await textLayer.render();
        }
      }).catch((err: any) => {
        if (err.name !== 'RenderingCancelledException') {
          console.error('Error rendering page:', err);
        }
        renderTaskRef.current = null;
      });
    }

    // Cleanup function to cancel render task when component unmounts or dependencies change
    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [page, zoom]);

  return (
    <div
      className="relative my-4 shadow-lg mx-auto print-page"
      style={{
        width: dimensions.width,
        height: dimensions.height,
        userSelect: 'text'
      }}
    >
      <canvas ref={canvasRef} style={{ userSelect: 'none' }} />
      <div
        ref={textLayerRef}
        className="textLayer"
        style={{
          width: dimensions.width,
          height: dimensions.height
        }}
      />
      {dimensions.width > 0 && (
        <AnnotationLayer
          {...props}
          width={dimensions.width}
          height={dimensions.height}
        />
      )}
    </div>
  );
};

export default PdfPage;
