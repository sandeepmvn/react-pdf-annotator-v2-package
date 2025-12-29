
import React, { useState, useRef, useEffect } from 'react';
import { AnnotationTool } from '../types';
import { FONT_SIZES, STROKE_WIDTHS, STAMPS } from '../constants';
import {
    SelectIcon, PenIcon, HighlighterIcon, FreeTextIcon, RectangleIcon, CircleIcon, TrashIcon,
    ZoomInIcon, ZoomOutIcon, DownloadIcon, PrintIcon, UnderlineIcon, StrikeoutIcon, SquigglyIcon,
    StampIcon, SignatureIcon, InitialsIcon, UndoIcon, RedoIcon, MoreIcon
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
      isActive ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200 text-gray-800'
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

  const [showDropdown, setShowDropdown] = useState(false);
  const [showAnnotationTools, setShowAnnotationTools] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

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
  ];

  const shapeTools: { tool: AnnotationTool, icon: React.ReactNode, label: string }[] = [
    { tool: 'RECTANGLE', icon: <RectangleIcon />, label: 'Rectangle' },
    { tool: 'CIRCLE', icon: <CircleIcon />, label: 'Circle' },
  ];

  const textTools: { tool: AnnotationTool, icon: React.ReactNode, label: string }[] = [
    { tool: 'TEXT', icon: <FreeTextIcon />, label: 'Free Text' },
    { tool: 'SQUIGGLY', icon: <SquigglyIcon />, label: 'Squiggly' },
  ];

  return (
    <header className="bg-gray-50 shadow-md p-2 flex flex-col gap-2 z-10">
      {/* Main Toolbar */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg truncate max-w-xs text-gray-800" title={fileName}>{fileName}</span>

        {/* Page Controls & Zoom */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage <= 1} className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 text-gray-800 transition-colors">‹</button>
            <div className="flex items-center text-gray-800">
              <input type="number" value={currentPage} onChange={handlePageInputChange} className="w-12 text-center bg-white rounded-md border border-gray-300 text-gray-800" />
              <span className="mx-2">/</span><span>{totalPages}</span>
            </div>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages} className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 text-gray-800 transition-colors">›</button>
          </div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <ToolButton label="Zoom Out" onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}><ZoomOutIcon /></ToolButton>
            <span className="w-16 text-center bg-white rounded-md border border-gray-300 cursor-pointer text-gray-800 py-1" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</span>
            <ToolButton label="Zoom In" onClick={() => setZoom(Math.min(4, zoom + 0.25))}><ZoomInIcon /></ToolButton>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!readonly && (
            <>
              <ToolButton label="Undo" onClick={undo} disabled={!canUndo}><UndoIcon /></ToolButton>
              <ToolButton label="Redo" onClick={redo} disabled={!canRedo}><RedoIcon /></ToolButton>
              <div className="w-px h-6 bg-gray-300"></div>
            </>
          )}

          {/* Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <ToolButton label="More options" onClick={() => setShowDropdown(!showDropdown)}>
              <MoreIcon />
            </ToolButton>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onPrint();
                      setShowDropdown(false);
                    }}
                    disabled={isProcessing}
                    className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    <PrintIcon />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => {
                      onDownload();
                      setShowDropdown(false);
                    }}
                    disabled={isProcessing}
                    className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    <DownloadIcon />
                    <span>Download</span>
                  </button>
                  {!readonly && (
                    <>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={() => {
                          setShowAnnotationTools(!showAnnotationTools);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 flex items-center gap-3"
                      >
                        <span className="w-5 h-5 flex items-center justify-center">
                          {showAnnotationTools ? '✓' : ''}
                        </span>
                        <span>Show Annotation Tools</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Annotation Toolbar */}
      {!readonly && showAnnotationTools && (
        <>
          <div className="w-full h-px bg-gray-300"></div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {/* Annotate */}
            <div className="flex items-center gap-1 bg-white border border-gray-300 p-1 rounded-lg">
              {annotationTools.map(t => <ToolButton key={t.tool} label={t.label} isActive={activeTool === t.tool} onClick={() => setActiveTool(t.tool)}>{t.icon}</ToolButton>)}
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <ToolButton label="Delete" onClick={onDelete} disabled={!selectedAnnotationId}><TrashIcon /></ToolButton>
            </div>
            {/* Shapes */}
            <div className="flex items-center gap-1 bg-white border border-gray-300 p-1 rounded-lg">
              {shapeTools.map(t => <ToolButton key={t.tool} label={t.label} isActive={activeTool === t.tool} onClick={() => setActiveTool(t.tool)}>{t.icon}</ToolButton>)}
            </div>
            {/* Text */}
            <div className="flex items-center gap-1 bg-white border border-gray-300 p-1 rounded-lg">
              {textTools.map(t => <ToolButton key={t.tool} label={t.label} isActive={activeTool === t.tool} onClick={() => setActiveTool(t.tool)}>{t.icon}</ToolButton>)}
            </div>
            {/* Stamp */}
            <div className="flex items-center gap-1 bg-white border border-gray-300 p-1 rounded-lg">
                <ToolButton label="Stamp" isActive={activeTool === 'STAMP'} onClick={() => setActiveTool('STAMP')}><StampIcon /></ToolButton>
                <select value={activeStamp} onChange={e => setActiveStamp(e.target.value)} className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {STAMPS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            {/* Properties */}
            <div className="flex items-center gap-2 bg-white border border-gray-300 p-1 rounded-lg">
              <input type="color" value={toolColor} onChange={(e) => setToolColor(e.target.value)} className="w-8 h-8 p-0 border-none rounded-md cursor-pointer bg-transparent" title="Select color" />
              <select value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" title="Stroke Width">
                {STROKE_WIDTHS.map(w => <option key={w} value={w}>{w}px</option>)}
              </select>
              <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" title="Font Size">
                {FONT_SIZES.map(s => <option key={s} value={s}>{s}pt</option>)}
              </select>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Toolbar;
