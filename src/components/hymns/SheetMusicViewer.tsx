import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  Music2, 
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';

interface SheetMusicViewerProps {
  sheetMusicUrls?: string[];
  hymnTitle: string;
  hymnNumber: number;
  bookName: string;
  keySignature?: string;
}

export const SheetMusicViewer: React.FC<SheetMusicViewerProps> = ({
  sheetMusicUrls = [],
  hymnTitle,
  hymnNumber,
  bookName,
  keySignature
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasSheetMusic = sheetMusicUrls && sheetMusicUrls.length > 0;
  const currentImageUrl = hasSheetMusic ? sheetMusicUrls[currentPage] : null;

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      setImageLoaded(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < sheetMusicUrls.length - 1) {
      setCurrentPage(prev => prev + 1);
      setImageLoaded(false);
    }
  };

  return (
    <div className={`flex flex-col bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-slate-950 p-4' : 'h-full min-h-[480px]'
    }`}>
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
            <Music2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-400">
                #{hymnNumber}
              </span>
              <span className="text-xs font-semibold text-white truncate">
                {hymnTitle}
              </span>
              {keySignature && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 font-mono border border-slate-700">
                  Key: {keySignature}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {bookName} • Cloudinary Music Sheet
            </div>
          </div>
        </div>

        {/* Zoom & Page Controls */}
        <div className="flex items-center gap-1.5">
          {/* Page Selector (if multi-page) */}
          {hasSheetMusic && sheetMusicUrls.length > 1 && (
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs mr-1">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-30"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px] text-slate-300">
                {currentPage + 1} / {sheetMusicUrls.length}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === sheetMusicUrls.length - 1}
                className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-30"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded text-slate-300 hover:text-white transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] text-amber-300 min-w-[40px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded text-slate-300 hover:text-white transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 transition"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Sheet Image Canvas */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center relative bg-slate-900/40">
        {hasSheetMusic && currentImageUrl && !imageError ? (
          <div 
            className="transition-transform duration-150 ease-out flex items-center justify-center max-w-full"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                <ImageIcon className="w-8 h-8 animate-pulse text-amber-500/50 mb-2" />
                <span className="text-xs font-mono">Loading Cloudinary Music Sheet...</span>
              </div>
            )}
            <img
              src={currentImageUrl}
              alt={`${hymnTitle} Sheet Music`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`rounded-xl shadow-2xl border border-slate-800 max-h-[75vh] w-auto object-contain bg-white transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        ) : (
          /* Placeholder / Sheet music not yet available */
          <div className="text-center p-8 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Music2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Music Sheet (நோட்ஸ்)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Music sheet notation image for <span className="text-amber-300 font-semibold font-tamil">#{hymnNumber} - {hymnTitle}</span> will load directly from Cloudinary.
            </p>
            {keySignature && (
              <div className="inline-flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs font-mono text-amber-300">
                <span>Key Signature: {keySignature}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom status */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>{hasSheetMusic ? `Page ${currentPage + 1} of ${sheetMusicUrls.length}` : 'Sheet Music Viewer'}</span>
        <span>Pinch or click +/- to zoom</span>
      </div>
    </div>
  );
};

