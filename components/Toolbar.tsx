
import React from 'react';
import { AnnotationTool } from '../types';
import { FONT_SIZES, STROKE_WIDTHS, STAMPS } from '../constants';
import { 
    SelectIcon, PenIcon, HighlighterIcon, FreeTextIcon, RectangleIcon, CircleIcon, EraserIcon, TrashIcon, 
    ZoomInIcon, ZoomOutIcon, DownloadIcon, PrintIcon, UnderlineIcon, StrikeoutIcon, SquigglyIcon, 
    StampIcon, SignatureIcon, InitialsIcon, UndoIcon, RedoIcon 
} from './Icons';

interface ToolbarProps {
  fileName: string;
  currentPage: number;
  totalPages: number;
  zoom: number;
  setZoom: (zoom: number) => void;
  setCurrentPage: (page: number) => void;
  activeTool: AnnotationTool;
  setActiveTool: (tool: AnnotationTool) => void;
  toolColor: string;
  setToolColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  onDownload: () => void;
  onPrint: () => void;
  isProcessing: boolean;
  onDelete: () => void;
  selectedAnnotationId: string | null;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onSignatureClick: () => void;
  onInitialsClick: () => void;
  activeStamp: string;
  setActiveStamp: (stamp: string) => void;
  readonly?: boolean;
}

const ToolButton: React.FC<{
  label: string;
  isActive?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}> = ({ label, isActive = false, onClick, children, disabled = false }) => (
  <button
    title={label}
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-md transition-colors ${
      isActive ? 'bg-indigo-500 text-white' : 'hover:bg-gray-600 text-gray-300'
    } disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const {
    fileName, currentPage, totalPages, zoom, setZoom, setCurrentPage, activeTool, setActiveTool,
    toolColor, setToolColor, strokeWidth, setStrokeWidth, fontSize, setFontSize,
    onDownload, onPrint, isProcessing, onDelete, selectedAnnotationId,
    undo, redo, canUndo, canRedo, onSignatureClick, onInitialsClick, activeStamp, setActiveStamp,
    readonly = false
  } = props;

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (val > 0 && val <= totalPages) {
      setCurrentPage(val);
    }
  };

  const annotationTools: { tool: AnnotationTool, icon: React.ReactNode, label: string }[] = [
    { tool: 'SELECT', icon: <SelectIcon />, label: 'Select' },
    { tool: 'PEN', icon: <PenIcon />, label: 'Pen' },
    { tool: 'HIGHLIGHTER', icon: <HighlighterIcon />, label: 'Highlighter' },
    { tool: 'ERASER', icon: <EraserIcon />, label: 'Eraser' },
  ];

  const shapeTools: { tool: AnnotationTool, icon: React.ReactNode, label: string }[] = [
    { tool: 'RECTANGLE', icon: <RectangleIcon />, label: 'Rectangle' },
    { tool: 'CIRCLE', icon: <CircleIcon />, label: 'Circle' },
  ];

  const textTools: { tool: AnnotationTool, icon: React.ReactNode, label: string }[] = [
    { tool: 'TEXT', icon: <FreeTextIcon />, label: 'Free Text' },
    { tool: 'UNDERLINE', icon: <UnderlineIcon />, label: 'Underline' },
    { tool: 'STRIKETHROUGH', icon: <StrikeoutIcon />, label: 'Strikethrough' },
    { tool: 'SQUIGGLY', icon: <SquigglyIcon />, label: 'Squiggly' },
  ];

  return (
    <header className="bg-gray-900 shadow-md p-2 flex flex-col gap-2 z-10">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg truncate max-w-xs" title={fileName}>{fileName}</span>
        {/* Page Controls & Zoom */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage <= 1} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50">‹</button>
            <div className="flex items-center">
              <input type="number" value={currentPage} onChange={handlePageInputChange} className="w-12 text-center bg-gray-800 rounded-md border border-gray-700" />
              <span className="mx-2">/</span><span>{totalPages}</span>
            </div>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50">›</button>
          </div>
          <div className="w-px h-6 bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <ToolButton label="Zoom Out" onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}><ZoomOutIcon /></ToolButton>
            <span className="w-16 text-center cursor-pointer" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</span>
            <ToolButton label="Zoom In" onClick={() => setZoom(Math.min(4, zoom + 0.25))}><ZoomInIcon /></ToolButton>
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-2">
          {!readonly && (
            <>
              <ToolButton label="Undo" onClick={undo} disabled={!canUndo}><UndoIcon /></ToolButton>
              <ToolButton label="Redo" onClick={redo} disabled={!canRedo}><RedoIcon /></ToolButton>
              <div className="w-px h-6 bg-gray-700"></div>
            </>
          )}
          <ToolButton label="Print" onClick={onPrint} disabled={isProcessing}><PrintIcon /></ToolButton>
          <ToolButton label="Download" onClick={onDownload} disabled={isProcessing}><DownloadIcon /></ToolButton>
        </div>
      </div>
      {!readonly && <div className="w-full h-px bg-gray-700"></div>}
      {/* Toolsets */}
      {!readonly && <div className="flex items-center justify-center gap-4 flex-wrap">
        {/* Annotate */}
        <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-lg">
          {annotationTools.map(t => <ToolButton key={t.tool} label={t.label} isActive={activeTool === t.tool} onClick={() => setActiveTool(t.tool)}>{t.icon}</ToolButton>)}
          <div className="w-px h-6 bg-gray-700 mx-1"></div>
          <ToolButton label="Delete" onClick={onDelete} disabled={!selectedAnnotationId}><TrashIcon /></ToolButton>
        </div>
        {/* Shapes */}
        <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-lg">
          {shapeTools.map(t => <ToolButton key={t.tool} label={t.label} isActive={activeTool === t.tool} onClick={() => setActiveTool(t.tool)}>{t.icon}</ToolButton>)}
        </div>
        {/* Text */}
        <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-lg">
          {textTools.map(t => <ToolButton key={t.tool} label={t.label} isActive={activeTool === t.tool} onClick={() => setActiveTool(t.tool)}>{t.icon}</ToolButton>)}
        </div>
        {/* Sign */}
        <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-lg">
            <ToolButton label="Add Signature" isActive={activeTool === 'SIGNATURE'} onClick={() => setActiveTool('SIGNATURE')}><SignatureIcon /></ToolButton>
            <ToolButton label="Add Initials" isActive={activeTool === 'INITIALS'} onClick={() => setActiveTool('INITIALS')}><InitialsIcon /></ToolButton>
            <ToolButton label="Create Signature/Initials" onClick={onSignatureClick}>Edit Sigs</ToolButton>
        </div>
        {/* Stamp */}
        <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-lg">
            <ToolButton label="Stamp" isActive={activeTool === 'STAMP'} onClick={() => setActiveTool('STAMP')}><StampIcon /></ToolButton>
            <select value={activeStamp} onChange={e => setActiveStamp(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {STAMPS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
        {/* Properties */}
        <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-lg">
          <input type="color" value={toolColor} onChange={(e) => setToolColor(e.target.value)} className="w-8 h-8 p-0 border-none rounded-md cursor-pointer bg-transparent" title="Select color" />
          <select value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" title="Stroke Width">
            {STROKE_WIDTHS.map(w => <option key={w} value={w}>{w}px</option>)}
          </select>
          <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" title="Font Size">
            {FONT_SIZES.map(s => <option key={s} value={s}>{s}pt</option>)}
          </select>
        </div>
      </div>}
    </header>
  );
};

export default Toolbar;
