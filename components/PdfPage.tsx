
import React, { useRef, useEffect, useState } from 'react';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
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
}

const PdfPage: React.FC<PdfPageProps> = (props) => {
  const { pdf, pageNumber, zoom } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [page, setPage] = useState<PDFPageProxy | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    pdf.getPage(pageNumber).then(setPage);
  }, [pdf, pageNumber]);

  useEffect(() => {
    if (page && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      const viewport = page.getViewport({ scale: zoom });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setDimensions({ width: viewport.width, height: viewport.height });

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      page.render(renderContext);
    }
  }, [page, zoom]);

  return (
    <div
      className="relative my-4 shadow-lg mx-auto print-page"
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <canvas ref={canvasRef} />
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
