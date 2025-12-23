
export type AnnotationTool = 
  | 'SELECT' | 'PEN' | 'HIGHLIGHTER' | 'TEXT' | 'RECTANGLE' | 'CIRCLE' | 'ERASER'
  | 'UNDERLINE' | 'STRIKETHROUGH' | 'SQUIGGLY' | 'STAMP' | 'SIGNATURE' | 'INITIALS';

export interface Point {
  x: number;
  y: number;
}

export interface BaseAnnotation {
  id: string;
  page: number;
  color: string;
  strokeWidth: number;
}

export interface PenAnnotation extends BaseAnnotation {
  type: 'PEN';
  points: Point[];
}

export interface HighlighterAnnotation extends BaseAnnotation {
  type: 'HIGHLIGHTER';
  points: Point[];
}

export interface TextAnnotation extends BaseAnnotation {
  type: 'TEXT';
  x: number;
  y: number;
  width: number;
  content: string;
  fontSize: number;
}

export interface RectangleAnnotation extends BaseAnnotation {
  type: 'RECTANGLE';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CircleAnnotation extends BaseAnnotation {
  type: 'CIRCLE';
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export interface UnderlineAnnotation extends BaseAnnotation {
  type: 'UNDERLINE';
  points: Point[];
}

export interface StrikeoutAnnotation extends BaseAnnotation {
  type: 'STRIKETHROUGH';
  points: Point[];
}

export interface SquigglyAnnotation extends BaseAnnotation {
  type: 'SQUIGGLY';
  points: Point[];
}

export interface StampAnnotation extends BaseAnnotation {
  type: 'STAMP';
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  timestamp?: string;
}

export interface ImageAnnotation extends BaseAnnotation {
  type: 'SIGNATURE' | 'INITIALS';
  x: number;
  y: number;
  width: number;
  height: number;
  imageData: string; // base64
}

export type Annotation = 
  | PenAnnotation 
  | HighlighterAnnotation 
  | TextAnnotation 
  | RectangleAnnotation
  | CircleAnnotation
  | UnderlineAnnotation
  | StrikeoutAnnotation
  | SquigglyAnnotation
  | StampAnnotation
  | ImageAnnotation;

export type Annotations = Record<number, Annotation[]>;
