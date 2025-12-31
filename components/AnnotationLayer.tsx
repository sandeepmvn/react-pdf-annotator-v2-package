
import React, { useState, useRef, MouseEvent as ReactMouseEvent } from 'react';
import { Annotation, AnnotationTool, Point } from '../types';

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
  const [isTexting, setIsTexting] = useState<Point | null>(null);
  const [hoverHandle, setHoverHandle] = useState<ResizeHandle | null>(null);

  const getMousePos = (e: ReactMouseEvent): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    };
  };

  const handleMouseDown = (e: ReactMouseEvent) => {
    if (readonly) return;

    const pos = getMousePos(e);

    // PAN mode - don't handle here, let the parent container handle it
    if (activeTool === 'PAN') {
      return;
    }

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
  };

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (readonly) return;

    const currentPos = getMousePos(e);

    // Update hover handle for cursor changes when in SELECT mode
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
      setIsTexting(pos);
      setTimeout(() => textInputRef.current?.focus(), 0);
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
    if (!isTexting || !textInputRef.current) return;
    const content = textInputRef.current.value.trim();
    if (content) {
      addAnnotation({
        type: 'TEXT',
        x: isTexting.x,
        y: isTexting.y,
        width: textInputRef.current.offsetWidth / zoom,
        height: textInputRef.current.offsetHeight / zoom,
        content,
        fontSize: fontSize,
        color: toolColor,
        strokeWidth: 1,
      } as any);
    }
    setIsTexting(null);
  };

  const annotationsToRender = tempAnnotation 
    ? annotations.map(ann => ann.id === tempAnnotation.id ? tempAnnotation : ann)
    : annotations;
  if (interaction.mode === 'drawing' && tempAnnotation && !annotations.find(a => a.id === tempAnnotation.id)) {
      annotationsToRender.push(tempAnnotation);
  }

  const cursor = getCursor(activeTool, selectedAnnotationId, hoverHandle, interaction.mode);

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
        {annotationsToRender.map(ann => renderAnnotation(ann, selectedAnnotationId, zoom))}
      </svg>
      {isTexting && (
        <textarea
          ref={textInputRef}
          onBlur={handleTextBlur}
          style={{
            position: 'absolute',
            left: isTexting.x * zoom,
            top: isTexting.y * zoom,
            border: `1px dashed ${toolColor}`,
            color: toolColor,
            background: 'rgba(255,255,255,0.9)',
            fontSize: `${fontSize}px`,
            lineHeight: 1.2,
            width: 'auto',
            minWidth: '150px',
            height: 'auto',
            minHeight: `${fontSize * 1.5}px`,
            resize: 'both',
            outline: 'none',
            overflow: 'auto',
            zIndex: 100,
            fontFamily: 'sans-serif',
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
        case 'TEXT':
            const textLines = ann.content.split('\n');
            element = (
                <g>
                    {/* Optional: Show text box background when selected */}
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
        case 'RECTANGLE': case 'STAMP': case 'SIGNATURE': case 'INITIALS':
            return { minX: ann.x, minY: ann.y, maxX: ann.x + ann.width, maxY: ann.y + ann.height };
        case 'TEXT':
            // Use stored height if available, otherwise calculate from line count
            const textHeight = ann.height || (ann.content.split('\n').length * ann.fontSize * 1.2);
            return { minX: ann.x, minY: ann.y, maxX: ann.x + ann.width, maxY: ann.y + textHeight };
        case 'CIRCLE':
            return { minX: ann.cx - ann.rx, minY: ann.cy - ann.ry, maxX: ann.cx + ann.rx, maxY: ann.cy + ann.ry };
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
            {/* White outline for better visibility */}
            <rect {...rectProps} fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="5 5" />
            {/* Blue main border */}
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
        case 'RECTANGLE': case 'TEXT': case 'STAMP': case 'SIGNATURE': case 'INITIALS':
            newAnn.x += dx; newAnn.y += dy; break;
        case 'CIRCLE':
            newAnn.cx += dx; newAnn.cy += dy; break;
        case 'PEN': case 'HIGHLIGHTER': case 'UNDERLINE': case 'STRIKETHROUGH': case 'SQUIGGLY':
            newAnn.points = newAnn.points.map((p: Point) => ({ x: p.x + dx, y: p.y + dy })); break;
    }
    return newAnn;
}

function resizeAnnotation<T extends Annotation>(ann: T, handle: ResizeHandle, dx: number, dy: number): T {
    const newAnn = JSON.parse(JSON.stringify(ann));

    // Handle circle resizing
    if (newAnn.type === 'CIRCLE') {
        // Resize radii based on handle position
        if (handle.includes('l')) {
            newAnn.cx += dx / 2;
            newAnn.rx -= dx / 2;
        }
        if (handle.includes('r')) {
            newAnn.cx += dx / 2;
            newAnn.rx += dx / 2;
        }
        if (handle.includes('t')) {
            newAnn.cy += dy / 2;
            newAnn.ry -= dy / 2;
        }
        if (handle.includes('b')) {
            newAnn.cy += dy / 2;
            newAnn.ry += dy / 2;
        }

        // Ensure minimum radius
        if (newAnn.rx < 10) newAnn.rx = 10;
        if (newAnn.ry < 10) newAnn.ry = 10;

        // Keep radii positive
        if (newAnn.rx < 0) newAnn.rx *= -1;
        if (newAnn.ry < 0) newAnn.ry *= -1;
    }
    // Handle rectangle-like shapes
    else if (newAnn.type === 'RECTANGLE' || newAnn.type === 'SIGNATURE' || newAnn.type === 'INITIALS' || newAnn.type === 'STAMP' || newAnn.type === 'TEXT') {
        if (handle.includes('l')) { newAnn.x += dx; newAnn.width -= dx; }
        if (handle.includes('r')) { newAnn.width += dx; }
        if (handle.includes('t')) { newAnn.y += dy; newAnn.height -= dy; }
        if (handle.includes('b')) { newAnn.height += dy; }
        if (newAnn.width < 0) { newAnn.x += newAnn.width; newAnn.width *= -1; }
        if (newAnn.height < 0) { newAnn.y += newAnn.height; newAnn.height *= -1; }

        // Ensure minimum dimensions for TEXT
        if (newAnn.type === 'TEXT') {
            if (newAnn.width < 50) newAnn.width = 50;
            if (!newAnn.height) newAnn.height = newAnn.fontSize * 1.5;
            if (newAnn.height < newAnn.fontSize * 1.2) newAnn.height = newAnn.fontSize * 1.2;
        }
    }
    return newAnn;
}

function getCursor(activeTool: AnnotationTool, selectedId: string | null, hoverHandle: ResizeHandle | null, interactionMode: InteractionMode): string {
    // PAN mode cursor
    if (activeTool === 'PAN') {
        return 'grab';
    }

    // Show resize cursors when hovering over handles
    if (activeTool === 'SELECT' && hoverHandle && interactionMode === 'none') {
        switch (hoverHandle) {
            case 'tl':
            case 'br':
                return 'nwse-resize';
            case 'tr':
            case 'bl':
                return 'nesw-resize';
            case 't':
            case 'b':
                return 'ns-resize';
            case 'l':
            case 'r':
                return 'ew-resize';
        }
    }

    // Show resize cursors during resizing
    if (interactionMode === 'resizing') {
        return 'grabbing';
    }

    // Show move cursor during moving
    if (interactionMode === 'moving') {
        return 'grabbing';
    }

    // Default cursors for tools
    if (activeTool === 'SELECT') return selectedId ? 'move' : 'default';
    if (['PEN', 'RECTANGLE', 'CIRCLE', 'HIGHLIGHTER', 'UNDERLINE', 'STRIKETHROUGH', 'SQUIGGLY'].includes(activeTool)) return 'crosshair';
    if (activeTool === 'TEXT') return 'text';
    if (['STAMP', 'SIGNATURE', 'INITIALS'].includes(activeTool)) return 'crosshair';
    return 'default';
}

export default AnnotationLayer;
