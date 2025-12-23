// Import styles
import '../index.css';

// Main component
export { default as PdfViewer } from '../components/PdfViewer';
export type { PdfViewerRef } from '../components/PdfViewer';

// Sub-components (if users want to build custom layouts)
export { default as PdfPage } from '../components/PdfPage';
export { default as Toolbar } from '../components/Toolbar';
export { default as AnnotationLayer } from '../components/AnnotationLayer';
export { default as SignatureModal } from '../components/modals/SignatureModal';

// Hooks
export { useAnnotationHistory } from '../hooks/useAnnotationHistory';

// Types
export type {
  AnnotationTool,
  Point,
  BaseAnnotation,
  PenAnnotation,
  HighlighterAnnotation,
  TextAnnotation,
  RectangleAnnotation,
  CircleAnnotation,
  UnderlineAnnotation,
  StrikeoutAnnotation,
  SquigglyAnnotation,
  StampAnnotation,
  ImageAnnotation,
  Annotation,
  Annotations,
} from '../types';

// Constants
export {
  DEFAULT_COLOR,
  DEFAULT_STROKE_WIDTH,
  DEFAULT_FONT_SIZE,
  STAMPS,
  FONT_SIZES,
  STROKE_WIDTHS,
} from '../constants';

// Icons (if users want to use them)
export * from '../components/Icons';
