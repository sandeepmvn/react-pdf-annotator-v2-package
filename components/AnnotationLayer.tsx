
import React, { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from 'react';
import { Annotation, AnnotationTool, Point, TextAnnotation } from '../types';

type InteractionMode = 'none' | 'drawing' | 'moving' | 'resizing';
type ResizeHandle = 'tl' | 'tr' | 'bl' | 'br' | 't' | 'r' | 'b' | 'l';

interface AnnotationLayerProps {
  width: number;
  height: number;
  zoom: number;
  activeTool: AnnotationTool;
  toolColor: string;
  strokeWidth: number;
  fontSize: number;
  addAnnotation: (annotation: Omit<Annotation, 'id' | 'page'>) => void;
  annotations: Annotation[];
  deleteAnnotation: (annotationId: string) => void;
  updateAnnotation: (annotation: Annotation) => void;
  selectedAnnotationId: string | null;
  setSelectedAnnotationId: (id: string | null) => void;
  signatureData: string | null;
  initialsData: string | null;
  activeStamp: string;
  readonly?: boolean;
}

const AnnotationLayer: React.FC<AnnotationLayerProps> = (props) => {
  const {
    width, height, zoom, activeTool, toolColor, strokeWidth, fontSize,
    addAnnotation, annotations, deleteAnnotation, updateAnnotation,
    selectedAnnotationId, setSelectedAnnotationId,
    signatureData, initialsData, activeStamp,
    readonly = false
  } = props;

  const [interaction, setInteraction] = useState<{
    mode: InteractionMode;
    handle?: ResizeHandle;
    startPos: Point;
    originalAnnotation?: Annotation;
  }>({ mode: 'none', startPos: {x: 0, y: 0} });

  const [tempAnnotation, setTempAnnotation] = useState<Annotation | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  // When editing an existing text annotation: store its id and position
  const [editingText, setEditingText] = useState<{ pos: Point; existingId?: string } | null>(null);
  const [hoverHandle, setHoverHandle] = useState<ResizeHandle | null>(null);

  const getMousePos = (e: ReactMouseEvent): Point => {
    const svg = e.currentTarget as SVGSVGElement;
    const ctm = svg.getScreenCTM();
    if (ctm) {
      const pt = new DOMPoint(e.clientX, e.clientY);
      const svgPt = pt.matrixTransform(ctm.inverse());
      return { x: svgPt.x / zoom, y: svgPt.y / zoom };
    }
    const rect = svg.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    };
  };

  // Focus textarea whenever editingText is set
  useEffect(() => {
    if (editingText) {
      setTimeout(() => textInputRef.current?.focus(), 0);
    }
  }, [editingText]);

  const handleMouseDown = (e: ReactMouseEvent) => {
    if (readonly) return;

    const pos = getMousePos(e);

    if (activeTool === 'PAN') return;

    if (activeTool === 'SELECT') {
        const selectedAnn = annotations.find(ann => ann.id === selectedAnnotationId);
        if (selectedAnn) {
            const box = getAnnotationBoundingBox(selectedAnn);
            if (box) {
                const handles = getResizeHandles(box);
                for (const handleKey in handles) {
                    const handlePos = handles[handleKey as ResizeHandle];
                    const handleSize = 8 / zoom;
                    if (pos.x >= handlePos.x - handleSize / 2 && pos.x <= handlePos.x + handleSize / 2 &&
                        pos.y >= handlePos.y - handleSize / 2 && pos.y <= handlePos.y + handleSize / 2) {

                        setInteraction({ mode: 'resizing', handle: handleKey as ResizeHandle, startPos: pos, originalAnnotation: selectedAnn });
                        return;
                    }
                }
            }
            if (isPointInAnnotation(pos, selectedAnn, zoom)) {
                setInteraction({ mode: 'moving', startPos: pos, originalAnnotation: selectedAnn });
                return;
            }
        }

        const clickedAnn = annotations.slice().reverse().find(ann => isPointInAnnotation(pos, ann, zoom));
        setSelectedAnnotationId(clickedAnn ? clickedAnn.id : null);
        if (clickedAnn) {
             setInteraction({ mode: 'moving', startPos: pos, originalAnnotation: clickedAnn });
        }
        return;
    }

    if (['TEXT', 'STAMP', 'SIGNATURE', 'INITIALS'].includes(activeTool)) return;

    setInteraction({ mode: 'drawing', startPos: pos });
    if (['PEN', 'HIGHLIGHTER', 'UNDERLINE', 'STRIKETHROUGH', 'SQUIGGLY'].includes(activeTool)) {
      setTempAnnotation({ type: activeTool, points: [pos], color: toolColor, strokeWidth, id: 'temp', page: 0 } as any);
    }
    if (activeTool === 'LINE') {
      setTempAnnotation({ type: 'LINE', x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y, color: toolColor, strokeWidth, id: 'temp', page: 0 } as any);
    }
    if (activeTool === 'REDACT') {
      setTempAnnotation({ type: 'REDACT', x: pos.x, y: pos.y, width: 0, height: 0, color: '#000000', strokeWidth: 0, id: 'temp', page: 0 } as any);
    }
  };

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (readonly) return;

    const currentPos = getMousePos(e);

    if (activeTool === 'SELECT' && interaction.mode === 'none' && selectedAnnotationId) {
        const selectedAnn = annotations.find(ann => ann.id === selectedAnnotationId);
        if (selectedAnn) {
            const box = getAnnotationBoundingBox(selectedAnn);
            if (box) {
                const handles = getResizeHandles(box);
                let foundHandle: ResizeHandle | null = null;
                for (const handleKey in handles) {
                    const handlePos = handles[handleKey as ResizeHandle];
                    const handleSize = 8 / zoom;
                    if (currentPos.x >= handlePos.x - handleSize / 2 && currentPos.x <= handlePos.x + handleSize / 2 &&
                        currentPos.y >= handlePos.y - handleSize / 2 && currentPos.y <= handlePos.y + handleSize / 2) {
                        foundHandle = handleKey as ResizeHandle;
                        break;
                    }
                }
                setHoverHandle(foundHandle);
            } else {
                setHoverHandle(null);
            }
        } else {
            setHoverHandle(null);
        }
    } else if (interaction.mode === 'none') {
        setHoverHandle(null);
    }

    if (interaction.mode === 'moving' && interaction.originalAnnotation) {
        const dx = currentPos.x - interaction.startPos.x;
        const dy = currentPos.y - interaction.startPos.y;
        setTempAnnotation(moveAnnotation(interaction.originalAnnotation, dx, dy));
    } else if (interaction.mode === 'resizing' && interaction.originalAnnotation && interaction.handle) {
        const dx = currentPos.x - interaction.startPos.x;
        const dy = currentPos.y - interaction.startPos.y;
        setTempAnnotation(resizeAnnotation(interaction.originalAnnotation, interaction.handle, dx, dy));
    } else if (interaction.mode === 'drawing') {
        const { startPos } = interaction;
        let newAnn: Annotation | null = null;
        switch (activeTool) {
            case 'PEN':
            case 'HIGHLIGHTER':
            case 'UNDERLINE':
            case 'STRIKETHROUGH':
            case 'SQUIGGLY':
                newAnn = { ...tempAnnotation!, points: [...(tempAnnotation as any).points, currentPos] } as any;
                break;
            case 'RECTANGLE':
                newAnn = { type: 'RECTANGLE', x: Math.min(startPos.x, currentPos.x), y: Math.min(startPos.y, currentPos.y), width: Math.abs(startPos.x - currentPos.x), height: Math.abs(startPos.y - currentPos.y), color: toolColor, strokeWidth, id: 'temp', page: 0 };
                break;
            case 'CIRCLE':
                newAnn = { type: 'CIRCLE', cx: (startPos.x + currentPos.x) / 2, cy: (startPos.y + currentPos.y) / 2, rx: Math.abs(startPos.x - currentPos.x) / 2, ry: Math.abs(startPos.y - currentPos.y) / 2, color: toolColor, strokeWidth, id: 'temp', page: 0 };
                break;
            case 'LINE':
                newAnn = { type: 'LINE', x1: startPos.x, y1: startPos.y, x2: currentPos.x, y2: currentPos.y, color: toolColor, strokeWidth, id: 'temp', page: 0 };
                break;
            case 'REDACT':
                newAnn = { type: 'REDACT', x: Math.min(startPos.x, currentPos.x), y: Math.min(startPos.y, currentPos.y), width: Math.abs(startPos.x - currentPos.x), height: Math.abs(startPos.y - currentPos.y), color: '#000000', strokeWidth: 0, id: 'temp', page: 0 };
                break;
        }
        if (newAnn) setTempAnnotation(newAnn);
    }
  };

  const handleMouseUp = () => {
    if (readonly) return;

    if (interaction.mode === 'moving' || interaction.mode === 'resizing') {
        if (tempAnnotation) {
            updateAnnotation(tempAnnotation);
        }
    } else if (interaction.mode === 'drawing' && tempAnnotation) {
        const { id, page, ...rest } = tempAnnotation;
        // Skip tiny LINE/REDACT draws
        if (tempAnnotation.type === 'LINE') {
            const ann = tempAnnotation as any;
            if (Math.abs(ann.x2 - ann.x1) < 2 && Math.abs(ann.y2 - ann.y1) < 2) {
                setInteraction({ mode: 'none', startPos: {x:0, y:0} });
                setTempAnnotation(null);
                return;
            }
        }
        if (tempAnnotation.type === 'REDACT') {
            const ann = tempAnnotation as any;
            if (ann.width < 5 || ann.height < 5) {
                setInteraction({ mode: 'none', startPos: {x:0, y:0} });
                setTempAnnotation(null);
                return;
            }
        }
        addAnnotation(rest as any);
    }

    setInteraction({ mode: 'none', startPos: {x:0, y:0} });
    setTempAnnotation(null);
  };

  const handleSvgClick = (e: ReactMouseEvent) => {
    if (readonly) return;
    if (interaction.mode !== 'none') return;
    const pos = getMousePos(e);

    if (activeTool === 'TEXT') {
      // Check if we clicked on an existing text annotation to edit it
      const clickedTextAnn = annotations.slice().reverse().find(
        ann => ann.type === 'TEXT' && isPointInAnnotation(pos, ann, zoom)
      ) as TextAnnotation | undefined;

      if (clickedTextAnn) {
        setEditingText({ pos: { x: clickedTextAnn.x, y: clickedTextAnn.y }, existingId: clickedTextAnn.id });
        // Pre-fill textarea with existing content — done via effect + ref
        setTimeout(() => {
          if (textInputRef.current) {
            textInputRef.current.value = clickedTextAnn.content;
            textInputRef.current.focus();
          }
        }, 0);
      } else {
        setEditingText({ pos });
        setTimeout(() => {
          if (textInputRef.current) {
            textInputRef.current.value = '';
            textInputRef.current.focus();
          }
        }, 0);
      }
    }
    if (activeTool === 'STAMP') {
        const now = new Date();
        const timestamp = now.toLocaleString();
        addAnnotation({ type: 'STAMP', x: pos.x - 70, y: pos.y - 25, width: 140, height: 55, text: activeStamp, fontSize: 18, color: toolColor, strokeWidth: 2, timestamp } as any);
    }
    if (activeTool === 'SIGNATURE' && signatureData) {
        addAnnotation({ type: 'SIGNATURE', x: pos.x - 75, y: pos.y - 37.5, width: 150, height: 75, imageData: signatureData, color: toolColor, strokeWidth: 0 } as any);
    }
    if (activeTool === 'INITIALS' && initialsData) {
        addAnnotation({ type: 'INITIALS', x: pos.x - 40, y: pos.y - 20, width: 80, height: 40, imageData: initialsData, color: toolColor, strokeWidth: 0 } as any);
    }
  };

  const handleTextBlur = () => {
    if (readonly) return;
    if (!editingText || !textInputRef.current) return;
    const content = textInputRef.current.value.trim();

    if (editingText.existingId) {
      // Editing an existing annotation
      const existing = annotations.find(a => a.id === editingText.existingId) as TextAnnotation | undefined;
      if (existing) {
        if (content) {
          updateAnnotation({
            ...existing,
            content,
            width: Math.max(existing.width, textInputRef.current.offsetWidth / zoom),
            height: textInputRef.current.offsetHeight / zoom,
          });
        } else {
          deleteAnnotation(editingText.existingId);
        }
      }
    } else {
      // Creating a new annotation
      if (content) {
        addAnnotation({
          type: 'TEXT',
          x: editingText.pos.x,
          y: editingText.pos.y,
          width: textInputRef.current.offsetWidth / zoom,
          height: textInputRef.current.offsetHeight / zoom,
          content,
          fontSize,
          color: toolColor,
          strokeWidth: 1,
        } as any);
      }
    }
    setEditingText(null);
  };

  // Allow Tab key inside textarea (for indentation), suppress default
  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setEditingText(null);
    }
    // Allow Ctrl+C / Ctrl+V / Ctrl+X natively — no interception needed
  };

  const annotationsToRender = tempAnnotation
    ? annotations.map(ann => ann.id === tempAnnotation.id ? tempAnnotation : ann)
    : annotations;
  if (interaction.mode === 'drawing' && tempAnnotation && !annotations.find(a => a.id === tempAnnotation.id)) {
      annotationsToRender.push(tempAnnotation);
  }

  // Hide text annotation being edited so textarea overlays it cleanly
  const filteredAnnotations = editingText?.existingId
    ? annotationsToRender.filter(a => a.id !== editingText.existingId)
    : annotationsToRender;

  const cursor = getCursor(activeTool, selectedAnnotationId, hoverHandle, interaction.mode);

  // Compute textarea style for editing
  const editingAnn = editingText?.existingId
    ? annotations.find(a => a.id === editingText.existingId) as TextAnnotation | undefined
    : undefined;
  const textareaFontSize = editingAnn ? editingAnn.fontSize : fontSize;
  const textareaColor = editingAnn ? editingAnn.color : toolColor;

  return (
    <div
      className="absolute top-0 left-0"
      style={{
        cursor,
        pointerEvents: activeTool === 'PAN' ? 'none' : 'auto'
      }}
    >
      <svg
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleSvgClick}
        style={{
          pointerEvents: activeTool === 'PAN' ? 'none' : 'auto'
        }}
      >
        {filteredAnnotations.map(ann => renderAnnotation(ann, selectedAnnotationId, zoom))}
      </svg>
      {editingText && (
        <textarea
          ref={textInputRef}
          onBlur={handleTextBlur}
          onKeyDown={handleTextKeyDown}
          style={{
            position: 'absolute',
            left: editingText.pos.x * zoom,
            top: editingText.pos.y * zoom,
            border: `1px dashed ${textareaColor}`,
            color: textareaColor,
            background: 'transparent',
            fontSize: `${textareaFontSize * zoom}px`,
            lineHeight: 1.2,
            width: editingAnn ? `${editingAnn.width * zoom}px` : 'auto',
            minWidth: '150px',
            height: 'auto',
            minHeight: `${textareaFontSize * zoom * 1.5}px`,
            resize: 'both',
            outline: 'none',
            overflow: 'auto',
            zIndex: 100,
            fontFamily: 'sans-serif',
            padding: '2px',
          }}
        />
      )}
    </div>
  );
};

// --- Helper Functions ---

function renderAnnotation(ann: Annotation, selectedId: string | null, zoom: number) {
    const isSelected = ann.id === selectedId;
    const baseProps = { stroke: ann.color, strokeWidth: ann.strokeWidth };
    let element = null;

    switch (ann.type) {
        case 'PEN':
            const penPoints = ann.points.map(p => `${p.x * zoom},${p.y * zoom}`).join(' ');
            element = <polyline points={penPoints} fill="none" {...baseProps} strokeLinecap="round" strokeLinejoin="round" />;
            break;
        case 'UNDERLINE':
            const ulPoints = ann.points.map(p => `${p.x * zoom},${p.y * zoom}`).join(' ');
            element = <polyline points={ulPoints} fill="none" {...baseProps} strokeLinecap="round" />;
            break;
        case 'STRIKETHROUGH':
            const stPoints = ann.points.map(p => `${p.x * zoom},${p.y * zoom}`).join(' ');
            element = <polyline points={stPoints} fill="none" {...baseProps} strokeLinecap="round" />;
            break;
        case 'SQUIGGLY':
            const sqPoints = ann.points.map(p => `${p.x * zoom},${p.y * zoom}`).join(' ');
            element = <polyline points={sqPoints} fill="none" {...baseProps} />;
            break;
        case 'HIGHLIGHTER':
            const hlPoints = ann.points.map(p => `${p.x * zoom},${p.y * zoom}`).join(' ');
            element = <polyline points={hlPoints} fill="none" {...baseProps} strokeOpacity={0.3} strokeWidth={ann.strokeWidth * 5} strokeLinecap="round" />;
            break;
        case 'RECTANGLE':
            element = <rect x={ann.x * zoom} y={ann.y * zoom} width={ann.width * zoom} height={ann.height * zoom} fill="none" {...baseProps} />;
            break;
        case 'CIRCLE':
            element = <ellipse cx={ann.cx * zoom} cy={ann.cy * zoom} rx={ann.rx * zoom} ry={ann.ry * zoom} fill="none" {...baseProps} />;
            break;
        case 'LINE':
            element = <line x1={ann.x1 * zoom} y1={ann.y1 * zoom} x2={ann.x2 * zoom} y2={ann.y2 * zoom} {...baseProps} strokeLinecap="round" />;
            break;
        case 'REDACT':
            element = <rect x={ann.x * zoom} y={ann.y * zoom} width={ann.width * zoom} height={ann.height * zoom} fill="#000000" stroke="none" />;
            break;
        case 'TEXT':
            const textLines = ann.content.split('\n');
            element = (
                <g>
                    {isSelected && (
                        <rect
                            x={ann.x * zoom}
                            y={ann.y * zoom}
                            width={ann.width * zoom}
                            height={(ann.height || (textLines.length * ann.fontSize * 1.2)) * zoom}
                            fill="rgba(255,255,255,0.1)"
                            stroke={ann.color}
                            strokeWidth="0.5"
                            strokeDasharray="2,2"
                        />
                    )}
                    <text x={ann.x * zoom} y={ann.y * zoom + ann.fontSize * zoom} fill={ann.color} fontSize={ann.fontSize * zoom}>
                        {textLines.map((line, index) => (
                            <tspan key={index} x={ann.x * zoom} dy={index === 0 ? 0 : ann.fontSize * zoom * 1.2}>
                                {line}
                            </tspan>
                        ))}
                    </text>
                </g>
            );
            break;
        case 'STAMP':
            element = <g>
                <rect x={ann.x * zoom} y={ann.y * zoom} width={ann.width * zoom} height={ann.height * zoom} fill="none" stroke={ann.color} strokeWidth="2" opacity="0.8" />
                <text x={(ann.x + ann.width/2) * zoom} y={(ann.y + ann.height * 0.35) * zoom} fill={ann.color} fontSize={ann.fontSize * zoom} textAnchor="middle" alignmentBaseline="middle" fontWeight="bold" opacity="0.8">{ann.text}</text>
                {ann.timestamp && <text x={(ann.x + ann.width/2) * zoom} y={(ann.y + ann.height * 0.7) * zoom} fill={ann.color} fontSize={(ann.fontSize * 0.45) * zoom} textAnchor="middle" alignmentBaseline="middle" opacity="0.7">{ann.timestamp}</text>}
            </g>;
            break;
        case 'SIGNATURE':
        case 'INITIALS':
            element = <image href={ann.imageData} x={ann.x * zoom} y={ann.y * zoom} width={ann.width * zoom} height={ann.height * zoom} />;
            break;
    }

    const box = getAnnotationBoundingBox(ann);
    return <g key={ann.id}>{element}{isSelected && box && renderSelectionBox(box, zoom)}</g>;
}

function getAnnotationBoundingBox(ann: Annotation): { minX: number; minY: number; maxX: number; maxY: number } | null {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    switch (ann.type) {
        case 'RECTANGLE': case 'STAMP': case 'SIGNATURE': case 'INITIALS': case 'REDACT':
            return { minX: ann.x, minY: ann.y, maxX: ann.x + ann.width, maxY: ann.y + ann.height };
        case 'TEXT':
            const textHeight = ann.height || (ann.content.split('\n').length * ann.fontSize * 1.2);
            return { minX: ann.x, minY: ann.y, maxX: ann.x + ann.width, maxY: ann.y + textHeight };
        case 'CIRCLE':
            return { minX: ann.cx - ann.rx, minY: ann.cy - ann.ry, maxX: ann.cx + ann.rx, maxY: ann.cy + ann.ry };
        case 'LINE':
            return { minX: Math.min(ann.x1, ann.x2), minY: Math.min(ann.y1, ann.y2), maxX: Math.max(ann.x1, ann.x2), maxY: Math.max(ann.y1, ann.y2) };
        case 'PEN': case 'HIGHLIGHTER': case 'UNDERLINE': case 'STRIKETHROUGH': case 'SQUIGGLY':
            ann.points.forEach(p => {
                minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
                maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y);
            });
            return { minX, minY, maxX, maxY };
    }
    return null;
}

function renderSelectionBox(box: { minX: number; minY: number; maxX: number; maxY: number }, zoom: number) {
    const padding = 4 / zoom;
    const rectProps = {
        x: (box.minX - padding) * zoom,
        y: (box.minY - padding) * zoom,
        width: (box.maxX - box.minX + padding * 2) * zoom,
        height: (box.maxY - box.minY + padding * 2) * zoom,
    };
    const handles = getResizeHandles(box);
    const handleSize = 8;

    return (
        <g>
            <rect {...rectProps} fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="5 5" />
            <rect {...rectProps} fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="5 5" />
            {Object.values(handles).map((p, i) => (
                <rect key={i} x={p.x * zoom - handleSize/2} y={p.y * zoom - handleSize/2} width={handleSize} height={handleSize} fill="#0ea5e9" stroke="#ffffff" strokeWidth="2" />
            ))}
        </g>
    );
}

function getResizeHandles(box: { minX: number; minY: number; maxX: number; maxY: number }): Record<ResizeHandle, Point> {
    return {
        tl: { x: box.minX, y: box.minY },
        t: { x: (box.minX + box.maxX) / 2, y: box.minY },
        tr: { x: box.maxX, y: box.minY },
        l: { x: box.minX, y: (box.minY + box.maxY) / 2 },
        r: { x: box.maxX, y: (box.minY + box.maxY) / 2 },
        bl: { x: box.minX, y: box.maxY },
        b: { x: (box.minX + box.maxX) / 2, y: box.maxY },
        br: { x: box.maxX, y: box.maxY },
    };
}

function isPointInAnnotation(point: Point, ann: Annotation, zoom: number): boolean {
    const box = getAnnotationBoundingBox(ann);
    if (!box) return false;
    const padding = 5 / zoom;
    return point.x >= box.minX - padding && point.x <= box.maxX + padding &&
           point.y >= box.minY - padding && point.y <= box.maxY + padding;
}

function moveAnnotation<T extends Annotation>(ann: T, dx: number, dy: number): T {
    const newAnn = JSON.parse(JSON.stringify(ann));
    switch (newAnn.type) {
        case 'RECTANGLE': case 'TEXT': case 'STAMP': case 'SIGNATURE': case 'INITIALS': case 'REDACT':
            newAnn.x += dx; newAnn.y += dy; break;
        case 'CIRCLE':
            newAnn.cx += dx; newAnn.cy += dy; break;
        case 'LINE':
            newAnn.x1 += dx; newAnn.y1 += dy; newAnn.x2 += dx; newAnn.y2 += dy; break;
        case 'PEN': case 'HIGHLIGHTER': case 'UNDERLINE': case 'STRIKETHROUGH': case 'SQUIGGLY':
            newAnn.points = newAnn.points.map((p: Point) => ({ x: p.x + dx, y: p.y + dy })); break;
    }
    return newAnn;
}

function resizeAnnotation<T extends Annotation>(ann: T, handle: ResizeHandle, dx: number, dy: number): T {
    const newAnn = JSON.parse(JSON.stringify(ann));

    if (newAnn.type === 'CIRCLE') {
        if (handle.includes('l')) { newAnn.cx += dx / 2; newAnn.rx -= dx / 2; }
        if (handle.includes('r')) { newAnn.cx += dx / 2; newAnn.rx += dx / 2; }
        if (handle.includes('t')) { newAnn.cy += dy / 2; newAnn.ry -= dy / 2; }
        if (handle.includes('b')) { newAnn.cy += dy / 2; newAnn.ry += dy / 2; }
        if (newAnn.rx < 10) newAnn.rx = 10;
        if (newAnn.ry < 10) newAnn.ry = 10;
        if (newAnn.rx < 0) newAnn.rx *= -1;
        if (newAnn.ry < 0) newAnn.ry *= -1;
    } else if (newAnn.type === 'LINE') {
        // For lines, tl/bl anchors move x1,y1; tr/br anchors move x2,y2
        if (handle === 'tl' || handle === 'l' || handle === 'bl') { newAnn.x1 += dx; newAnn.y1 += dy; }
        if (handle === 'tr' || handle === 'r' || handle === 'br') { newAnn.x2 += dx; newAnn.y2 += dy; }
    } else if (['RECTANGLE', 'SIGNATURE', 'INITIALS', 'STAMP', 'TEXT', 'REDACT'].includes(newAnn.type)) {
        if (handle.includes('l')) { newAnn.x += dx; newAnn.width -= dx; }
        if (handle.includes('r')) { newAnn.width += dx; }
        if (handle.includes('t')) { newAnn.y += dy; newAnn.height -= dy; }
        if (handle.includes('b')) { newAnn.height += dy; }
        if (newAnn.width < 0) { newAnn.x += newAnn.width; newAnn.width *= -1; }
        if (newAnn.height < 0) { newAnn.y += newAnn.height; newAnn.height *= -1; }
        if (newAnn.type === 'TEXT') {
            if (newAnn.width < 50) newAnn.width = 50;
            if (!newAnn.height) newAnn.height = newAnn.fontSize * 1.5;
            if (newAnn.height < newAnn.fontSize * 1.2) newAnn.height = newAnn.fontSize * 1.2;
        }
    }
    return newAnn;
}

function getCursor(activeTool: AnnotationTool, selectedId: string | null, hoverHandle: ResizeHandle | null, interactionMode: InteractionMode): string {
    if (activeTool === 'PAN') return 'grab';

    if (activeTool === 'SELECT' && hoverHandle && interactionMode === 'none') {
        switch (hoverHandle) {
            case 'tl': case 'br': return 'nwse-resize';
            case 'tr': case 'bl': return 'nesw-resize';
            case 't': case 'b': return 'ns-resize';
            case 'l': case 'r': return 'ew-resize';
        }
    }

    if (interactionMode === 'resizing') return 'grabbing';
    if (interactionMode === 'moving') return 'grabbing';

    if (activeTool === 'SELECT') return selectedId ? 'move' : 'default';
    if (['PEN', 'RECTANGLE', 'CIRCLE', 'HIGHLIGHTER', 'UNDERLINE', 'STRIKETHROUGH', 'SQUIGGLY', 'LINE', 'REDACT'].includes(activeTool)) return 'crosshair';
    if (activeTool === 'TEXT') return 'text';
    if (['STAMP', 'SIGNATURE', 'INITIALS'].includes(activeTool)) return 'crosshair';
    return 'default';
}

export default AnnotationLayer;
