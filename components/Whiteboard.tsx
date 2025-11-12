import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TrashIcon, BrushSmallIcon, BrushMediumIcon, BrushLargeIcon } from './Icons';

interface WhiteboardProps {
  onChange: (dataUrl: string | undefined) => void;
}

const COLORS = ['#000000', '#EF4444', '#3B82F6', '#22C55E', '#FFFFFF'];
const BRUSH_SIZES = [
  { size: 2, Icon: BrushSmallIcon, label: 'Small' },
  { size: 5, Icon: BrushMediumIcon, label: 'Medium' },
  { size: 10, Icon: BrushLargeIcon, label: 'Large' },
];

export const Whiteboard: React.FC<WhiteboardProps> = ({ onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [lineWidth, setLineWidth] = useState(BRUSH_SIZES[1].size);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Adjust for device pixel ratio for sharper drawing
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.scale(dpr, dpr);

    // Fill with a white background initially
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    contextRef.current = context;
    
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = lineWidth;
    }
  }, [color, lineWidth]);
  
  const getCoords = (event: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in event) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    }
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    const coords = getCoords(event.nativeEvent);
    if (!coords || !contextRef.current) return;
    contextRef.current.beginPath();
    contextRef.current.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  }, []);

  const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    if (!isDrawing) return;
    const coords = getCoords(event.nativeEvent);
    if (!coords || !contextRef.current) return;
    contextRef.current.lineTo(coords.x, coords.y);
    contextRef.current.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    if (!contextRef.current || !canvasRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
    onChange(canvasRef.current.toDataURL('image/png'));
  }, [onChange]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'white';
      context.fillRect(0, 0, width, height);
      onChange(undefined);
    }
  };

  return (
    <div className="space-y-2">
      <div className="bg-gray-100 p-2 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 border-black/10 transition-transform transform focus:outline-none ${
                color === c ? 'ring-2 ring-offset-2 ring-offset-gray-100 ring-rose-500' : ''
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-gray-200/70 rounded-md">
            {BRUSH_SIZES.map(({ size, Icon, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => setLineWidth(size)}
                className={`p-1.5 rounded-md transition-colors ${
                  lineWidth === size
                    ? 'bg-rose-500 text-white'
                    : 'text-gray-500 hover:bg-gray-300 hover:text-gray-800'
                }`}
                aria-label={`Set brush size to ${label}`}
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
          <div className="w-px h-6 bg-gray-300" />
          <button
            type="button"
            onClick={clearCanvas}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-300 hover:text-gray-800 transition-colors"
            aria-label="Clear canvas"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full h-48 bg-white border-2 border-gray-300 border-dashed rounded-md cursor-crosshair"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};