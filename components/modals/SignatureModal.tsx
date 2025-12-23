
import React, { useRef, useState, MouseEvent as ReactMouseEvent, useEffect } from 'react';

interface SignatureModalProps {
  onClose: () => void;
  onSave: (dataUrl: string) => void;
  title: string;
}

const SignatureModal: React.FC<SignatureModalProps> = ({ onClose, onSave, title }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }
    return ctx;
  }

  useEffect(() => {
    getContext(); // Set initial context properties
  }, []);

  const startDrawing = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    const ctx = getContext();
    if (!ctx) return;
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = getContext();
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = getContext();
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Check if canvas is empty
    const blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    if (canvas.toDataURL() === blank.toDataURL()) {
        alert("Please provide a signature before saving.");
        return;
    }
    onSave(canvas.toDataURL('image/png'));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <canvas
          ref={canvasRef}
          width="460"
          height="200"
          className="bg-white rounded-md cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <div className="flex justify-end gap-4 mt-4">
          <button onClick={clearCanvas} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">Clear</button>
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition-colors">Save</button>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;
