
import React, { useRef, useEffect, useState } from 'react';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
import { renderTextLayer } from 'pdfjs-dist';
import AnnotationLayer from './AnnotationLayer';
import { Annotation, AnnotationTool } from '../types';

interface PdfPageProps {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  zoom: number;
  rotation: number;
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
  const { pdf, pageNumber, zoom, rotation } = props;
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
          const textLayerTask = renderTextLayer({
            textContentSource: textContent,
            container: textLayerRef.current,
            viewport: viewport,
          });
          await textLayerTask.promise;
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

  const isRotated90or270 = rotation === 90 || rotation === 270;
  const outerWidth = isRotated90or270 ? dimensions.height : dimensions.width;
  const outerHeight = isRotated90or270 ? dimensions.width : dimensions.height;

  return (
    <div
      className="relative my-4 shadow-lg mx-auto print-page"
      style={{
        width: outerWidth,
        height: outerHeight,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: dimensions.width,
          height: dimensions.height,
          transform: rotation ? `rotate(${rotation}deg)` : undefined,
          transformOrigin: 'center center',
          position: 'absolute',
          left: (outerWidth - dimensions.width) / 2,
          top: (outerHeight - dimensions.height) / 2,
          userSelect: 'text',
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
    </div>
  );
};

export default PdfPage;
