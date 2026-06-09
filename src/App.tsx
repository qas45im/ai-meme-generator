import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Type as FontIcon, 
  Layout, 
  Sliders, 
  Check, 
  AlertCircle,
  HelpCircle,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Info,
  Copy,
  ExternalLink
} from 'lucide-react';
import { TRENDING_TEMPLATES } from './templates';
import { MemeTemplate, FontStyle, TextPosition, CustomText } from './types';

export default function App() {
  const [templates] = useState<MemeTemplate[]>(TRENDING_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate>(TRENDING_TEMPLATES[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Custom Bonus topic hint for AI Analysis
  const [contextBonusPrompt, setContextBonusPrompt] = useState<string>('programmer humor');
  
  // AI Captain response list
  const [magicCaptions, setMagicCaptions] = useState<string[]>([
    "When you find the bug in production at 4:59 PM",
    "That face you make when the code compiles on the first try",
    "Me explaining my highly optimal layout logic to the senior developer",
    "0 errors. 0 warnings. 100% confusion.",
    "Wait, you guys are actually getting documentation?"
  ]);
  const [isLoadingCaptions, setIsLoadingCaptions] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Standard text options
  const [topText, setTopText] = useState<string>(TRENDING_TEMPLATES[0].defaultTop);
  const [bottomText, setBottomText] = useState<string>(TRENDING_TEMPLATES[0].defaultBottom);
  
  // High-fidelity typography choices
  const [fontSize, setFontSize] = useState<number>(36);
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [strokeColor, setStrokeColor] = useState<string>('#000000');
  const [hasStroke, setHasStroke] = useState<boolean>(true);
  const [fontFamily, setFontFamily] = useState<FontStyle>('Impact');
  const [isUppercase, setIsUppercase] = useState<boolean>(true);
  const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right'>('center');
  
  // Position offsets in percentages (0-100)
  const [topY, setTopY] = useState<number>(12);
  const [topX, setTopX] = useState<number>(50);
  const [bottomY, setBottomY] = useState<number>(88);
  const [bottomX, setBottomX] = useState<number>(50);

  // Dragging support
  const [draggingId, setDraggingId] = useState<'top' | 'bottom' | string | null>(null);
  const [dragStartOffset, setDragStartOffset] = useState<{ x: number, y: number } | null>(null);

  // Art board Zooming
  const [zoom, setZoom] = useState<number>(100);

  // Different quality exports
  const [exportQuality, setExportQuality] = useState<'low' | 'medium' | 'ultra'>('medium');

  // Prompt writer and extractor states
  const [promptTweaks, setPromptTweaks] = useState<string>('');
  const [isExtractingPrompt, setIsExtractingPrompt] = useState<boolean>(false);
  const [extractedPromptData, setExtractedPromptData] = useState<{
    extractedStyle: string;
    idealPrompt: string;
    suggestedStylePreset: string;
  } | null>(null);
  const [promptError, setPromptError] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Additional custom floating texts
  const [customTexts, setCustomTexts] = useState<CustomText[]>([]);
  const [activeTextId, setActiveTextId] = useState<'top' | 'bottom' | string>('top');

  // Server health status indicator
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // Detect server status on start
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') setServerOnline(true);
      })
      .catch(() => setServerOnline(false));
  }, []);

  // Update default text when switching templates
  const selectTemplate = (tpl: MemeTemplate) => {
    setSelectedTemplate(tpl);
    setUploadedImage(null);
    const parsed = tpl.defaultTop.split('|');
    if (parsed.length > 1) {
      setTopText(parsed[0].trim());
      setBottomText(parsed[1].trim());
    } else {
      setTopText(tpl.defaultTop);
      setBottomText(tpl.defaultBottom);
    }
    // Reset defaults position
    setTopY(12);
    setTopX(50);
    setBottomY(88);
    setBottomX(50);
  };

  // Image File Uploader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setUploadedImage(base64);
        setTopText("Me loading my custom photo");
        setBottomText("Into the ultimate AI Meme Engine");
        // Reset coordinates
        setTopY(12);
        setTopX(50);
        setBottomY(88);
        setBottomX(50);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and Drop support
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };
  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setUploadedImage(uploadEvent.target?.result as string);
        setTopText("Dropped custom file");
        setBottomText("Let's hit Magic Caption!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Use Effect to load image source object safely when image/template selection state updates
  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    // Fallback source check
    const srcToLoad = uploadedImage || selectedTemplate.imageUrl;
    
    img.onload = () => {
      setImageElement(img);
      setImageLoaded(true);
    };
    img.onerror = (e) => {
      console.error("Error loading image content into canvas", e);
    };
    img.src = srcToLoad;
  }, [selectedTemplate, uploadedImage]);

  // Hook up full Canvas Redraw whenever any variable or custom texts update!
  useEffect(() => {
    if (!canvasRef.current || !imageElement || !imageLoaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set fixed render size for high quality memes (e.g., 800 x 800 ratio-dependent size)
    const baseWidth = 800;
    // Keep aspect ratio of original image
    const aspectRatio = imageElement.naturalHeight / imageElement.naturalWidth || 1;
    const baseHeight = Math.floor(baseWidth * aspectRatio);

    canvas.width = baseWidth;
    canvas.height = baseHeight;

    // Draw base context image
    ctx.clearRect(0, 0, baseWidth, baseHeight);
    ctx.drawImage(imageElement, 0, 0, baseWidth, baseHeight);

    // Dynamic scale font calculations relative to baseWidth
    const scaleFactor = baseWidth / 500; // calibrated for base width 500 styling

    // Helper to draw text block with word-wrap
    const drawMemeText = (
      rawText: string,
      xPercent: number,
      yPercent: number,
      isTop: boolean,
      custom?: CustomText
    ) => {
      const displayStr = isUppercase ? rawText.toUpperCase() : rawText;
      if (!displayStr.trim()) return;

      const fFamily = custom ? custom.fontFamily : fontFamily;
      const fSize = (custom ? custom.fontSize : fontSize) * scaleFactor;
      const fCol = custom ? custom.color : textColor;
      const fStroke = custom ? custom.strokeColor : strokeColor;
      const fHasStroke = custom ? custom.hasStroke : hasStroke;
      const fAlign = custom ? custom.align : textAlignment;

      // Select system font format
      let fontStyleStr = 'black 900';
      if (fFamily === 'Impact') {
        fontStyleStr = `900 ${fSize}px Impact, Impact-Bold, "Arial Black", sans-serif`;
      } else if (fFamily === 'Space Grotesk') {
        fontStyleStr = `800 ${fSize}px "Space Grotesk", Arial, sans-serif`;
      } else if (fFamily === 'JetBrains Mono') {
        fontStyleStr = `700 ${fSize}px "JetBrains Mono", monospace`;
      } else if (fFamily === 'Comic Sans MS') {
        fontStyleStr = `700 ${fSize}px "Comic Sans MS", cursive, sans-serif`;
      } else {
        fontStyleStr = `800 ${fSize}px "${fFamily}", sans-serif`;
      }

      ctx.font = fontStyleStr;
      ctx.textAlign = fAlign;
      ctx.textBaseline = 'middle';

      // Setup positions
      const actualX = (xPercent / 100) * baseWidth;
      const actualY = (yPercent / 100) * baseHeight;

      // Word wrapping logic
      const maxWidth = baseWidth * 0.9;
      const words = displayStr.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);

      // Line height multiplier
      const lineHeight = fSize * 1.15;
      
      // Compute starting point for text layout (y coordinate adjusts so content centers perfectly)
      const totalHeight = lines.length * lineHeight;
      let startY = actualY;
      
      if (isTop) {
        // Adjust for top stacked lines
        startY = actualY - (totalHeight / 2) + (fSize / 2);
      } else {
        // Center-aligned stack context
        startY = actualY - (totalHeight / 2) + (fSize / 2);
      }

      lines.forEach((line, index) => {
        const lineY = startY + (index * lineHeight);

        // Fill background color
        ctx.fillStyle = fCol;

        if (fHasStroke) {
          ctx.strokeStyle = fStroke;
          ctx.lineWidth = Math.max(3, fSize / 5);
          ctx.lineJoin = 'round';
          ctx.strokeText(line, actualX, lineY);
        }

        ctx.fillText(line, actualX, lineY);
      });
    };

    // Draw traditional top text
    drawMemeText(topText, topX, topY, true);

    // Draw traditional bottom text
    drawMemeText(bottomText, bottomX, bottomY, false);

    // Draw any user-defined extra floating text layers 
    customTexts.forEach(txt => {
      drawMemeText(txt.text, txt.x, txt.y, false, txt);
    });

  }, [
    imageElement,
    imageLoaded,
    topText,
    bottomText,
    fontSize,
    textColor,
    strokeColor,
    hasStroke,
    fontFamily,
    isUppercase,
    textAlignment,
    topY,
    bottomY,
    topX,
    bottomX,
    customTexts
  ]);

  // Pointer position detection for dragging text on canvas preview
  const findTextAtPosition = (pctX: number, pctY: number) => {
    let closestId: 'top' | 'bottom' | string | null = null;
    let minDistance = 15; // maximum percentage threshold radius to match click

    // Check custom floating text elements first
    customTexts.forEach(txt => {
      const dist = Math.hypot(txt.x - pctX, txt.y - pctY);
      if (dist < minDistance) {
        minDistance = dist;
        closestId = txt.id;
      }
    });

    // Check standard bottom text
    const distBottom = Math.hypot(bottomX - pctX, bottomY - pctY);
    if (distBottom < minDistance) {
      minDistance = distBottom;
      closestId = 'bottom';
    }

    // Check standard top text
    const distTop = Math.hypot(topX - pctX, topY - pctY);
    if (distTop < minDistance) {
      minDistance = distTop;
      closestId = 'top';
    }

    return closestId;
  };

  const handleCanvasPointerDown = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    const pctX = (clickX / rect.width) * 100;
    const pctY = (clickY / rect.height) * 100;

    const hitId = findTextAtPosition(pctX, pctY);
    if (hitId) {
      setActiveTextId(hitId);
      setDraggingId(hitId);

      let origX = 50;
      let origY = 50;
      if (hitId === 'top') {
        origX = topX;
        origY = topY;
      } else if (hitId === 'bottom') {
        origX = bottomX;
        origY = bottomY;
      } else {
        const txt = customTexts.find(t => t.id === hitId);
        if (txt) {
          origX = txt.x;
          origY = txt.y;
        }
      }
      setDragStartOffset({ x: pctX - origX, y: pctY - origY });
    }
  };

  const handleCanvasPointerMove = (clientX: number, clientY: number) => {
    if (!draggingId || !canvasRef.current || !dragStartOffset) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;

    const pctX = (currentX / rect.width) * 100;
    const pctY = (currentY / rect.height) * 100;

    let targetX = Math.max(0, Math.min(100, pctX - dragStartOffset.x));
    let targetY = Math.max(0, Math.min(100, pctY - dragStartOffset.y));

    targetX = Math.round(targetX * 10) / 10;
    targetY = Math.round(targetY * 10) / 10;

    if (draggingId === 'top') {
      setTopX(targetX);
      setTopY(targetY);
    } else if (draggingId === 'bottom') {
      setBottomX(targetX);
      setBottomY(targetY);
    } else {
      updateCustomTextProp(draggingId, 'x', targetX);
      updateCustomTextProp(draggingId, 'y', targetY);
    }
  };

  const handleCanvasPointerUp = () => {
    setDraggingId(null);
    setDragStartOffset(null);
  };

  // TRIGGER THE AI GEMINI AGENT FOR UNIQUE CONTEXTUAL CAPTIONS
  const handleMagicCaption = async () => {
    setIsLoadingCaptions(true);
    setApiError(null);
    try {
      console.log("Requesting dynamic suggestions from server-side Gemini module...");
      
      const requestPayload = {
        image: uploadedImage ? uploadedImage : null,
        templateName: !uploadedImage ? selectedTemplate.name : null,
        templateDescription: !uploadedImage ? selectedTemplate.description : null,
        contextBonusPrompt: contextBonusPrompt
      };

      const response = await fetch('/api/generate-captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Meme engine is currently too busy. Try again shortly!");
      }

      const data = await response.json();
      if (data.captions && data.captions.length > 0) {
        setMagicCaptions(data.captions);
      } else {
        throw new Error("No caption recommendations parsed correctly.");
      }

    } catch (err: any) {
      console.error("AI Generation Error: ", err);
      setApiError(err?.message || "Failed to sync suggestions. Please try again!");
    } finally {
      setIsLoadingCaptions(false);
    }
  };

  // TRIGGER GEMINI PROMPT LAB WRITER & STYLE EXTRACTOR
  const handleExtractPrompt = async () => {
    setIsExtractingPrompt(true);
    setPromptError(null);
    setCopiedPrompt(false);
    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedImage ? uploadedImage : null,
          templateName: !uploadedImage ? selectedTemplate.name : null,
          templateDescription: !uploadedImage ? selectedTemplate.description : null,
          tweaks: promptTweaks
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to extract optimal prompt.");
      }

      const data = await response.json();
      setExtractedPromptData(data);
    } catch (err: any) {
      console.error("Prompt extractor error:", err);
      setPromptError(err?.message || "Error analyzing styles. Please try again.");
    } finally {
      setIsExtractingPrompt(false);
    }
  };

  // Instantly apply caption to canvas
  const applyCaption = (caption: string) => {
    // If double sided separated by '|', split properly
    if (caption.includes('|')) {
      const parts = caption.split('|');
      setTopText(parts[0].trim());
      setBottomText(parts[1].trim());
    } else {
      // Otherwise replace top or place intelligently based on string length
      if (caption.length > 50) {
        setTopText(caption.substring(0, Math.floor(caption.length / 2)).trim());
        setBottomText(caption.substring(Math.floor(caption.length / 2)).trim());
      } else {
        setTopText(caption);
        setBottomText('');
      }
    }
  };

  // Physical export download trigger handling multiple qualities
  const triggerDownload = (quality: 'low' | 'medium' | 'ultra' = exportQuality) => {
    if (!imageElement || !imageLoaded) return;
    try {
      // Create an off-screen high-fidelity canvas
      const downloadCanvas = document.createElement('canvas');
      const ctx = downloadCanvas.getContext('2d');
      if (!ctx) return;
      
      // Determine base sizing based on selected quality
      let targetWidth = 800; // default medium standard
      if (quality === 'low') targetWidth = 450;
      else if (quality === 'ultra') targetWidth = 1600; // Ultra high res Double pixel density
      
      const aspectRatio = imageElement.naturalHeight / imageElement.naturalWidth || 1;
      const targetHeight = Math.floor(targetWidth * aspectRatio);
      
      downloadCanvas.width = targetWidth;
      downloadCanvas.height = targetHeight;
      
      // Clear and draw background template/image 
      ctx.clearRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(imageElement, 0, 0, targetWidth, targetHeight);
      
      // Sizing scale factor relative to standard 500 calibration
      const scaleFactor = targetWidth / 500;
      
      // Symmetrical inner text drawing function for exporter
      const drawMemeTextOnDownload = (
        rawText: string,
        xPercent: number,
        yPercent: number,
        isTop: boolean,
        custom?: CustomText
      ) => {
        const displayStr = isUppercase ? rawText.toUpperCase() : rawText;
        if (!displayStr.trim()) return;

        const fFamily = custom ? custom.fontFamily : fontFamily;
        const fSize = (custom ? custom.fontSize : fontSize) * scaleFactor;
        const fCol = custom ? custom.color : textColor;
        const fStroke = custom ? custom.strokeColor : strokeColor;
        const fHasStroke = custom ? custom.hasStroke : hasStroke;
        const fAlign = custom ? custom.align : textAlignment;

        let fontStyleStr = 'black 900';
        if (fFamily === 'Impact') {
          fontStyleStr = `900 ${fSize}px Impact, Impact-Bold, "Arial Black", sans-serif`;
        } else if (fFamily === 'Space Grotesk') {
          fontStyleStr = `800 ${fSize}px "Space Grotesk", Arial, sans-serif`;
        } else if (fFamily === 'JetBrains Mono') {
          fontStyleStr = `700 ${fSize}px "JetBrains Mono", monospace`;
        } else if (fFamily === 'Comic Sans MS') {
          fontStyleStr = `700 ${fSize}px "Comic Sans MS", cursive, sans-serif`;
        } else {
          fontStyleStr = `800 ${fSize}px "${fFamily}", sans-serif`;
        }

        ctx.font = fontStyleStr;
        ctx.textAlign = fAlign;
        ctx.textBaseline = 'middle';

        const actualX = (xPercent / 100) * targetWidth;
        const actualY = (yPercent / 100) * targetHeight;

        const maxWidth = targetWidth * 0.9;
        const words = displayStr.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (let i = 0; i < words.length; i++) {
          const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && i > 0) {
            lines.push(currentLine);
            currentLine = words[i];
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine);

        const lineHeight = fSize * 1.15;
        const totalHeight = lines.length * lineHeight;
        let startY = actualY - (totalHeight / 2) + (fSize / 2);

        lines.forEach((line, index) => {
          const lineY = startY + (index * lineHeight);
          ctx.fillStyle = fCol;

          if (fHasStroke) {
            ctx.strokeStyle = fStroke;
            ctx.lineWidth = Math.max(3, fSize / 5);
            ctx.lineJoin = 'round';
            ctx.strokeText(line, actualX, lineY);
          }
          ctx.fillText(line, actualX, lineY);
        });
      };

      // Draw standard text positions
      drawMemeTextOnDownload(topText, topX, topY, true);
      drawMemeTextOnDownload(bottomText, bottomX, bottomY, false);

      // Draw user-defined custom layers
      customTexts.forEach(txt => {
        drawMemeTextOnDownload(txt.text, txt.x, txt.y, false, txt);
      });

      // Export settings variables
      let mimeType = 'image/png';
      let compressionQuality = 1.0;
      if (quality === 'low') {
        mimeType = 'image/jpeg';
        compressionQuality = 0.55; // lightweight compressed draft
      }

      const dataUrl = downloadCanvas.toDataURL(mimeType, compressionQuality);
      const link = document.createElement('a');
      const extension = quality === 'low' ? 'jpg' : 'png';
      link.download = `ai_meme_${quality}_quality_${Date.now()}.${extension}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error("Export process failed with canvas compression error", err);
    }
  };

  // Floating text blocks CRUD
  const addNewCustomText = () => {
    const newId = `custom_${Math.random().toString(36).substr(2, 9)}`;
    const newBlock: CustomText = {
      id: newId,
      text: 'Sticker text (Drag me!)',
      fontSize: 28,
      color: '#CDFF00', // Matches aesthetic green/lime highlight
      strokeColor: '#000000',
      hasStroke: true,
      isUppercase: true,
      x: 50,
      y: 50,
      fontFamily: 'Space Grotesk',
      align: 'center'
    };
    setCustomTexts([...customTexts, newBlock]);
    setActiveTextId(newId);
  };

  const removeCustomText = (id: string) => {
    setCustomTexts(customTexts.filter(t => t.id !== id));
    if (activeTextId === id) {
      setActiveTextId('top');
    }
  };

  const updateCustomTextProp = (id: string, key: keyof CustomText, value: any) => {
    setCustomTexts(customTexts.map(t => {
      if (t.id === id) {
        return { ...t, [key]: value };
      }
      return t;
    }));
  };

  // Helper values to ease current editing node selector
  const activeBlockData = customTexts.find(t => t.id === activeTextId);

  return (
    <div id="meme-app-root" className="min-h-screen w-full bg-[#0E0E0E] text-[#F0F0F0] font-sans flex flex-col select-none overflow-x-hidden">
      
      {/* Visual Header */}
      <header className="min-h-16 h-auto py-3 sm:py-0 border-b-2 border-[#2A2A2A] flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 bg-[#161616] gap-3">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-[#CDFF00] rounded-sm flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            <div className="w-4 h-4 border-2 border-black rotate-45 bg-[#161616]" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
              MEME.LAB <span className="text-[#CDFF00] bg-black/40 px-1.5 py-0.5 rounded text-[10px] tracking-widest border border-zinc-800 font-mono">VISION AI</span>
            </h1>
          </div>
        </div>
        
        <nav className="hidden md:flex gap-4 lg:gap-8 text-xs font-bold uppercase tracking-widest text-[#777]">
          <a href="#generator" className="text-[#CDFF00] border-b border-[#CDFF00] pb-1">AI GENERATOR</a>
          <span className="text-zinc-800">|</span>
          <span className="text-zinc-600 cursor-not-allowed">COMMUNITY</span>
          <span className="text-zinc-800">|</span>
          <span className="text-zinc-600 cursor-not-allowed" title="Storage in persistent client DB coming soon">PERSISTENT VAULT</span>
        </nav>

        <div className="flex items-center gap-4">
          {serverOnline === true ? (
            <span className="text-[9px] font-mono font-bold uppercase text-[#CDFF00] bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#CDFF00] rounded-full animate-pulse" />
              GEMINI_ONLINE
            </span>
          ) : serverOnline === false ? (
            <span className="text-[9px] font-mono font-bold uppercase text-red-500 bg-red-950/80 px-2 py-1 rounded border border-red-500/30">
              OFFLINE_MODE
            </span>
          ) : (
            <span className="text-[9px] font-mono font-bold uppercase text-yellow-500 bg-yellow-950/80 px-2 py-1 rounded border border-yellow-500/30">
              CONNECTING...
            </span>
          )}
          
          <button 
            id="download-btn-header"
            onClick={triggerDownload}
            className="px-4 py-1.5 border border-[#CDFF00] text-[#CDFF00] hover:bg-[#CDFF00] hover:text-black transition-all text-xs font-black uppercase tracking-widest flex items-center gap-1"
          >
            <Download size={13} />
            EXPORT PNG
          </button>
        </div>
      </header>

      {/* Main Studio Area */}
      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-[1400px] mx-auto overflow-visible">
        
        {/* Left Interactive Canvas Panel */}
        <section className="w-full lg:w-[55%] xl:w-[660px] shrink-0 p-4 sm:p-6 flex flex-col items-center justify-start bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:24px_24px] overflow-visible lg:overflow-y-auto lg:max-h-[calc(100vh-64px)] gap-4">
          
          {/* Zoom & Art Board Header Control Strip */}
          <div className="w-full max-w-[500px] flex items-center justify-between gap-2.5 bg-[#161616] border-2 border-[#2A2A2A] p-2 sm:p-3 rounded shadow-lg">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black text-[#CDFF00] tracking-wider flex items-center gap-1">
                <Sliders size={11} /> Viewport Scale
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">Zoom and slide layers</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="w-8 h-8 flex items-center justify-center rounded bg-black hover:bg-zinc-900 border border-zinc-800 hover:border-[#CDFF00] text-zinc-400 hover:text-[#CDFF00] font-black text-sm transition-all shadow-md active:scale-90"
                title="Zoom Out"
              >
                -
              </button>
              <span className="font-mono text-xs font-bold text-white bg-black/80 px-2.5 py-1.5 rounded min-w-[48px] text-center border border-zinc-800">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 10))}
                className="w-8 h-8 flex items-center justify-center rounded bg-black hover:bg-zinc-900 border border-zinc-800 hover:border-[#CDFF00] text-zinc-400 hover:text-[#CDFF00] font-black text-sm transition-all shadow-md active:scale-90"
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={() => setZoom(100)}
                className="text-[9px] uppercase font-black bg-zinc-900 hover:bg-black px-2.5 py-2 border border-zinc-800 rounded text-zinc-400 hover:text-[#CDFF00] transition active:scale-95"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Interactive Drag-Drop & Canvas Arena Frame */}
          <div 
            className="w-full max-w-[500px] h-[360px] sm:h-[460px] bg-[#0A0A0A] border-4 border-[#2A2A2A] shadow-[8px_8px_0px_0px_rgba(205,255,0,0.2)] rounded relative overflow-hidden flex items-center justify-center select-none"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Visual Indicator of file loading status */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-[#0E0E0E]/95 flex flex-col items-center justify-center p-6 text-center z-20">
                <div className="w-10 h-10 border-4 border-t-[#CDFF00] border-zinc-800 rounded-full animate-spin mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#CDFF00]">Calibrating AI Canvas...</p>
              </div>
            )}

            {/* Simulated target outline on drag */}
            {isDraggingFile && (
              <div className="absolute inset-2 border-2 border-dashed border-[#CDFF00] flex flex-col items-center justify-center bg-black/90 z-20 pointer-events-none rounded">
                <Upload size={36} className="text-[#CDFF00] animate-bounce mb-2" />
                <span className="text-xs uppercase font-black tracking-widest text-[#CDFF00]">RELEASE ZIP OR FILE HERE</span>
              </div>
            )}

            {/* Scale Wrapper Div */}
            <div 
              style={{ 
                transform: `scale(${zoom / 100})`, 
                transformOrigin: 'center center',
                transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
              }} 
              className="shrink-0 flex items-center justify-center max-w-full"
            >
              <canvas 
                id="meme-canvas-render-node"
                ref={canvasRef} 
                className="block shadow-2xl max-h-[420px] h-auto object-contain transition-shadow border border-zinc-800/30"
                style={{ 
                  width: '380px', 
                  maxHeight: '400px',
                  cursor: draggingId ? 'grabbing' : 'grab' 
                }}
                onMouseDown={(e) => {
                  handleCanvasPointerDown(e.clientX, e.clientY);
                }}
                onMouseMove={(e) => {
                  handleCanvasPointerMove(e.clientX, e.clientY);
                }}
                onMouseUp={handleCanvasPointerUp}
                onMouseLeave={handleCanvasPointerUp}
                onTouchStart={(e) => {
                  if (e.touches.length === 1) {
                    handleCanvasPointerDown(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                onTouchMove={(e) => {
                  if (e.touches.length === 1) {
                    if (e.cancelable) e.preventDefault();
                    handleCanvasPointerMove(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                onTouchEnd={handleCanvasPointerUp}
              />
            </div>

            {/* Active editing element HUD badge overlay */}
            <div className="absolute bottom-2 left-2 bg-black/85 px-2.5 py-1 rounded text-[8px] font-mono border border-zinc-800/80 uppercase text-zinc-400 flex items-center gap-1 z-10 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CDFF00] animate-pulse" />
              Active Layer: <strong className="text-white">{activeTextId === 'top' ? 'Text 1 (Top)' : activeTextId === 'bottom' ? 'Text 2 (Bottom)' : 'Sticker Add-on'}</strong>
            </div>

            <div className="absolute bottom-2 right-2 bg-black/85 px-2.5 py-1 rounded text-[8px] font-mono border border-zinc-800/80 uppercase text-zinc-500 pointer-events-none z-10 hidden sm:block">
              👈 Drag directly on canvas to reposition
            </div>
          </div>

          {/* Bottom Templates selection row */}
          <div className="w-full mt-6 bg-[#161616] border-2 border-[#2A2A2A] p-3 rounded shadow-inner">
            <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">SELECT MEME TEMPLATE OR UPLOAD YOUR OWN</span>
              <label className="flex items-center gap-1.5 text-[10px] bg-black hover:bg-zinc-900 border border-zinc-800 text-[#CDFF00] hover:text-white px-2 py-1 rounded cursor-pointer font-bold uppercase transition">
                <Upload size={10} />
                <span>Upload JPEG/PNG</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-zinc-800">
              {templates.map(tpl => {
                const isSelected = selectedTemplate.id === tpl.id && !uploadedImage;
                return (
                  <button
                    key={tpl.id}
                    id={`template-card-${tpl.id}`}
                    onClick={() => selectTemplate(tpl)}
                    className={`relative shrink-0 w-20 h-20 border-2 rounded bg-black/60 overflow-hidden transition-all group ${
                      isSelected 
                      ? 'border-[#CDFF00] ring-1 ring-[#CDFF00] scale-95' 
                      : 'border-[#2A2A2A] hover:border-zinc-400 grayscale hover:grayscale-0'
                    }`}
                    title={tpl.name}
                  >
                    <img 
                      src={tpl.imageUrl} 
                      alt={tpl.name} 
                      className="w-full h-full object-cover select-none pointer-events-none" 
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/85 p-0.5 text-center">
                      <span className="text-[8px] tracking-tight font-bold text-zinc-300 line-clamp-1 uppercase">
                        {tpl.name.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </section>

        {/* Right Editor & Magic AI controls Sidebar */}
        <aside className="flex-1 w-full bg-[#161616] border-t-2 lg:border-t-0 lg:border-l-2 border-[#2A2A2A] p-4 sm:p-5 flex flex-col gap-4 lg:overflow-y-auto lg:max-h-[calc(100vh-64px)]">
          
          {/* MAGIC CAPTION ZONE CARD */}
          <div className="border border-zinc-800 rounded bg-[#0E0E0E] p-4 flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CDFF00]/10 to-transparent pointer-events-none rounded-bl-full" />
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xs uppercase font-black text-white flex items-center gap-1">
                  <Sparkles size={14} className="text-[#CDFF00]" />
                  MAGIC CAPTION ROTATOR
                </h3>
                <p className="text-[9px] text-zinc-500 uppercase mt-0.5">Let Gemini analyze context for raw memes</p>
              </div>
              <span className="text-[8px] bg-[#CDFF00]/10 text-[#CDFF00] border border-[#CDFF00]/30 font-mono px-1 py-0.2 rounded font-black uppercase">
                v3.5 FLASH
              </span>
            </div>

            {/* Custom bonus contextual input */}
            <div className="flex gap-1.5 items-center">
              <span className="text-[9px] font-mono text-zinc-400 uppercase shrink-0">Topic Hint:</span>
              <input
                id="ai-bonus-input"
                type="text"
                placeholder="e.g. software engineer, exams, crypto, office life"
                value={contextBonusPrompt}
                onChange={(e) => setContextBonusPrompt(e.target.value)}
                className="flex-1 bg-black text-[#CDFF00] border border-zinc-800 rounded text-[10px] px-2 py-1 focus:outline-none focus:border-[#CDFF00] font-mono"
              />
            </div>

            {/* The absolute epic Magic Caption Button */}
            <button
              id="magic-caption-trigger"
              onClick={handleMagicCaption}
              disabled={isLoadingCaptions}
              className="w-full bg-[#CDFF00] text-black font-black py-2.5 rounded uppercase text-xs tracking-wider hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#FFFFFF] disabled:opacity-50 disabled:cursor-wait"
            >
              {isLoadingCaptions ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>ANALYZING IMAGE SCENE...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} fill="currentColor" />
                  <span>✨ GENERATE 5 AI SUGGESTIONS</span>
                </>
              )}
            </button>

            {/* API Error indicator */}
            {apiError && (
              <div className="text-[10px] bg-red-950/80 border border-red-500/30 text-red-300 p-2 rounded flex items-start gap-1.5">
                <AlertCircle size={12} className="shrink-0 mt-0.5" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Captions suggestion list block */}
            <div className="flex flex-col gap-1.5 mt-1 max-h-[175px] overflow-y-auto">
              {magicCaptions.map((cap, ind) => {
                return (
                  <button
                    key={ind}
                    id={`caps-btn-${ind}`}
                    onClick={() => applyCaption(cap)}
                    className="p-2 border border-zinc-800 bg-zinc-950 hover:bg-[#CDFF00] text-zinc-300 hover:text-black hover:border-[#CDFF00] text-[11px] font-bold text-left rounded tracking-tight transition-all duration-150 relative group flex justify-between items-center"
                    title="Click to instantly paste onto canvas"
                  >
                    <span className="line-clamp-2 italic leading-snug">
                      {cap.replace('|', ' | ')}
                    </span>
                    <span className="text-[8px] opacity-0 group-hover:opacity-100 uppercase tracking-widest bg-black text-[#CDFF00] px-1 rounded font-mono font-bold shrink-0 ml-1">
                      PASTE +
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TEXT CONTENT CONTROLLER */}
          <div className="border border-zinc-800 rounded bg-[#111111] p-3 flex flex-col gap-2.5">
            <div className="flex justify-between items-center bg-black/40 p-1.5 rounded border border-zinc-900 gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase font-black text-zinc-400 flex items-center gap-1">
                <FontIcon size={12} className="text-[#CDFF00]" /> Layer Settings
              </span>
              
              <div className="flex items-center gap-1">
                {/* Switch Active Layer */}
                <select
                  id="active-layer-selector"
                  value={activeTextId}
                  onChange={(e) => setActiveTextId(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-[#CDFF00] text-[10px] font-bold uppercase rounded px-1.5 py-0.5 focus:outline-none"
                >
                  <option value="top">TEXT 1 (TOP)</option>
                  <option value="bottom">TEXT 2 (BOTTOM)</option>
                  {customTexts.map((ct, idx) => (
                    <option key={ct.id} value={ct.id}>EXTRA TEXT {idx + 1}</option>
                  ))}
                </select>

                <button
                  id="add-custom-text-btn"
                  onClick={addNewCustomText}
                  className="bg-[#CDFF00] text-black hover:brightness-110 p-1 rounded font-black flex items-center gap-0.5 text-[9px] uppercase tracking-tighter"
                  title="Add multi-style floating stickers reference layer"
                >
                  <Plus size={10} />
                  ADD TEXT
                </button>
              </div>
            </div>

            {/* Show controls based on active Selection */}
            {activeTextId === 'top' ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono uppercase text-zinc-500">Edit Text 1 Content</label>
                <textarea
                  id="top-text-raw-input"
                  rows={2}
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="Enter funny top header phrase..."
                  className="w-full bg-black text-[#F0F0F0] border border-zinc-800 rounded text-xs p-2 focus:outline-none focus:border-[#CDFF00]"
                />
                
                {/* Positional slide X and Y */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="flex items-center gap-1 bg-black/30 p-1.5 rounded">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase">X%:</span>
                    <input 
                      type="range" 
                      min={0} 
                      max={100} 
                      value={topX} 
                      onChange={(e) => setTopX(Number(e.target.value))}
                      className="flex-1 accent-[#CDFF00] h-1" 
                    />
                    <span className="text-[9px] font-mono text-[#CDFF00] min-w-[20px] text-right">{topX}%</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/30 p-1.5 rounded">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase">Y%:</span>
                    <input 
                      type="range" 
                      min={0} 
                      max={100} 
                      value={topY} 
                      onChange={(e) => setTopY(Number(e.target.value))}
                      className="flex-1 accent-[#CDFF00] h-1" 
                    />
                    <span className="text-[9px] font-mono text-[#CDFF00] min-w-[20px] text-right">{topY}%</span>
                  </div>
                </div>
              </div>
            ) : activeTextId === 'bottom' ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono uppercase text-zinc-500">Edit Text 2 Content</label>
                <textarea
                  id="bottom-text-raw-input"
                  rows={2}
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="Enter bottom punchline sentence..."
                  className="w-full bg-black text-[#F0F0F0] border border-zinc-800 rounded text-xs p-2 focus:outline-none focus:border-[#CDFF00]"
                />

                {/* Positional slide X and Y */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="flex items-center gap-1 bg-black/30 p-1.5 rounded">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase">X%:</span>
                    <input 
                      type="range" 
                      min={0} 
                      max={100} 
                      value={bottomX} 
                      onChange={(e) => setBottomX(Number(e.target.value))}
                      className="flex-1 accent-[#CDFF00] h-1" 
                    />
                    <span className="text-[9px] font-mono text-[#CDFF00] min-w-[20px] text-right">{bottomX}%</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/30 p-1.5 rounded">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase">Y%:</span>
                    <input 
                      type="range" 
                      min={0} 
                      max={100} 
                      value={bottomY} 
                      onChange={(e) => setBottomY(Number(e.target.value))}
                      className="flex-1 accent-[#CDFF00] h-1" 
                    />
                    <span className="text-[9px] font-mono text-[#CDFF00] min-w-[20px] text-right">{bottomY}%</span>
                  </div>
                </div>
              </div>
            ) : (
              // Floating Extra Text Options
              <div className="flex flex-col gap-1.5 bg-zinc-900/60 p-2 rounded border border-zinc-800/40">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-[#CDFF00] font-mono uppercase">EDIT EXTRA FLOATING TEXT</span>
                  <button
                    id="delete-custom-text-btn"
                    onClick={() => removeCustomText(activeTextId)}
                    className="text-red-400 hover:text-red-500 p-0.5"
                    title="Remove layer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <textarea
                  id="extra-text-raw-input"
                  rows={2}
                  value={activeBlockData?.text || ''}
                  onChange={(e) => updateCustomTextProp(activeTextId, 'text', e.target.value)}
                  placeholder="Type anything on the sticker..."
                  className="w-full bg-black text-[#F0F0F0] border border-zinc-800 rounded text-xs p-2 focus:outline-none focus:border-[#CDFF00]"
                />

                {/* Floating Coordinates controllers */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase">X%:</span>
                    <input 
                      type="range" 
                      min={0} 
                      max={100} 
                      value={activeBlockData?.x || 50} 
                      onChange={(e) => updateCustomTextProp(activeTextId, 'x', Number(e.target.value))}
                      className="flex-1 accent-[#CDFF00] h-1" 
                    />
                    <span className="text-[8px] font-mono text-[#CDFF00] w-6 text-right">{activeBlockData?.x || 50}</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase">Y%:</span>
                    <input 
                      type="range" 
                      min={0} 
                      max={100} 
                      value={activeBlockData?.y || 50} 
                      onChange={(e) => updateCustomTextProp(activeTextId, 'y', Number(e.target.value))}
                      className="flex-1 accent-[#CDFF00] h-1" 
                    />
                    <span className="text-[8px] font-mono text-[#CDFF00] w-6 text-right">{activeBlockData?.y || 50}</span>
                  </div>
                </div>

                {/* Font Selector Override for Custom Block */}
                <div className="flex items-center justify-between gap-1 mt-1">
                  <span className="text-[8px] font-mono text-zinc-500">Sticker Font:</span>
                  <select
                    id="sticker-font-selector"
                    value={activeBlockData?.fontFamily || 'Space Grotesk'}
                    onChange={(e) => updateCustomTextProp(activeTextId, 'fontFamily', e.target.value)}
                    className="bg-black text-[9px] border border-zinc-800 rounded p-1 text-[#CDFF00] font-mono"
                  >
                    <option value="Space Grotesk">Space Grotesk</option>
                    <option value="Impact">Impact Bold</option>
                    <option value="JetBrains Mono">JetBrains Mono</option>
                    <option value="Comic Sans MS">Comic Sans</option>
                    <option value="Arial">Arial Standard</option>
                  </select>
                </div>
              </div>
            )}

            {/* Context-aware horizontal drag guidance */}
            <div className="flex items-center justify-between gap-2 mt-1.5 bg-black/40 p-2 rounded border border-zinc-900/60">
              <span className="text-[8px] font-mono text-zinc-400">Positioning tips:</span>
              <span className="text-[8px] font-mono text-[#CDFF00] uppercase">
                💡 Drag layer directly on the preview to place
              </span>
            </div>
          </div>

          {/* GLOBAL CANVAS STYLE DECK */}
          <div className="border border-zinc-800 rounded bg-[#111111] p-3 flex flex-col gap-3">
            <h3 className="text-[10px] text-zinc-500 uppercase font-black tracking-widest flex items-center gap-1">
              <Sliders size={11} className="text-[#CDFF00]" />
              Typography Controls
            </h3>

            {/* Fonts list selector */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { name: 'IMPACT', val: 'Impact' },
                { name: 'SPACE GROTESK', val: 'Space Grotesk' },
                { name: 'JETBRAINS MONO', val: 'JetBrains Mono' },
                { name: 'COMIC SANS', val: 'Comic Sans MS' }
              ].map(fnt => {
                const active = fontFamily === fnt.val;
                return (
                  <button
                    key={fnt.val}
                    id={`font-opt-${fnt.val}`}
                    onClick={() => setFontFamily(fnt.val as FontStyle)}
                    className={`py-1.5 border uppercase text-[9px] font-black tracking-wider text-center transition-all ${
                      active 
                      ? 'bg-[#CDFF00] text-black border-[#CDFF00]' 
                      : 'border-zinc-800 hover:border-zinc-500 text-zinc-400 bg-black/40'
                    }`}
                  >
                    {fnt.name}
                  </button>
                );
              })}
            </div>

            {/* Sliders for Size */}
            <div className="flex flex-col gap-1 bg-black/20 p-2 rounded border border-zinc-900">
              <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400">
                <span>Font Weight Size:</span>
                <span className="text-[#CDFF00] font-bold">{fontSize}px</span>
              </div>
              <input
                id="font-size-slider"
                type="range"
                min={16}
                max={72}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-[#CDFF00] h-1"
              />
            </div>

            {/* Color grid & Custom Outline toggler */}
            <div className="flex items-center justify-between mt-1 bg-black/40 p-2 rounded">
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-mono text-zinc-500 uppercase">Text Fill:</span>
                <div className="flex gap-1">
                  {['#FFFFFF', '#000000', '#CDFF00', '#FF3E3E', '#3EACFF'].map(col => (
                    <button
                      key={col}
                      onClick={() => {
                        if (activeTextId === 'top' || activeTextId === 'bottom') {
                          setTextColor(col);
                        } else {
                          updateCustomTextProp(activeTextId, 'color', col);
                        }
                      }}
                      className={`w-5 h-5 rounded-sm border transition-transform ${
                        (activeTextId === 'top' || activeTextId === 'bottom' ? textColor === col : activeBlockData?.color === col) 
                        ? 'scale-110 border-[#CDFF00] ring-1 ring-[#CDFF05]' 
                        : 'border-zinc-700 hover:scale-[1.05]'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              {/* Stroke configuration */}
              <button
                id="stroke-toggle"
                onClick={() => {
                  if (activeTextId === 'top' || activeTextId === 'bottom') {
                    setHasStroke(!hasStroke);
                  } else {
                    updateCustomTextProp(activeTextId, 'hasStroke', !activeBlockData?.hasStroke);
                  }
                }}
                className={`px-2 py-1 text-[8px] font-mono uppercase font-black tracking-tighter border transition-colors ${
                  (activeTextId === 'top' || activeTextId === 'bottom' ? hasStroke : activeBlockData?.hasStroke) 
                  ? 'bg-zinc-800 text-[#CDFF00] border-[#CDFF00]' 
                  : 'bg-black text-zinc-600 border-zinc-800 hover:text-zinc-400'
                }`}
              >
                Black Outer Outline
              </button>
            </div>

            {/* Uppercase and formatting configurations row */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1">
                <input
                  id="uppercase-toggle-box"
                  type="checkbox"
                  checked={isUppercase}
                  onChange={(e) => setIsUppercase(e.target.checked)}
                  className="accent-[#CDFF00] w-3 h-3 rounded"
                />
                <label htmlFor="uppercase-toggle-box" className="text-[8px] font-mono uppercase text-zinc-500 cursor-pointer">
                  FORCE UPPERCASE CAPS
                </label>
              </div>

              {/* Alignment Selector */}
              <div className="flex bg-black p-0.5 border border-zinc-800 rounded">
                {(['left', 'center', 'right'] as const).map(align => {
                  const match = textAlignment === align;
                  return (
                    <button
                      key={align}
                      onClick={() => setTextAlignment(align)}
                      className={`p-1 rounded-sm transition ${
                        match ? 'bg-[#CDFF00] text-black' : 'text-zinc-500 hover:text-white'
                      }`}
                      title={`Align ${align}`}
                    >
                      {align === 'left' ? <AlignLeft size={10} /> : align === 'center' ? <AlignCenter size={10} /> : <AlignRight size={10} />}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* HIGH FIDELITY EXPORT OPTIONS DECK */}
          <div className="border border-zinc-800 rounded bg-[#111111] p-3 flex flex-col gap-2 relative">
            <span className="text-[9px] uppercase font-black text-zinc-500 tracking-wider">Meme Export Quality Preset</span>
            <div className="grid grid-cols-3 gap-1.5 mt-1">
              {[
                { id: 'low', label: 'Draft Mode', desc: 'JPEG compressed 450px' },
                { id: 'medium', label: 'Standard', desc: 'PNG social 800px' },
                { id: 'ultra', label: 'Ultra HD', desc: 'PNG crisp 1600px' }
              ].map(opt => {
                const isSelected = exportQuality === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setExportQuality(opt.id as 'low' | 'medium' | 'ultra')}
                    className={`p-2 border rounded text-left transition-all flex flex-col justify-between ${
                      isSelected 
                      ? 'border-[#CDFF00] bg-black/80' 
                      : 'border-zinc-800 bg-zinc-950 hover:bg-black/40 hover:border-zinc-700'
                    }`}
                  >
                    <span className={`text-[10px] font-black uppercase ${isSelected ? 'text-[#CDFF00]' : 'text-zinc-300'}`}>
                      {opt.label}
                    </span>
                    <span className="text-[7.5px] text-zinc-500 font-mono mt-0.5 leading-none">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => triggerDownload(exportQuality)}
              className="w-full bg-[#CDFF00] text-black hover:brightness-110 font-black py-2 rounded uppercase text-xs tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] mt-2 flex items-center justify-center gap-1 px-4"
            >
              <Download size={13} />
              EXPORT MEME ({exportQuality.toUpperCase()} PRESET)
            </button>
          </div>

          {/* GEMINI PROMPT LAB & VISUAL CO-PILOT */}
          <div className="border border-zinc-800 rounded bg-[#0E0E0E] p-4 flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#00D1FF]/10 to-transparent pointer-events-none rounded-bl-full" />
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xs uppercase font-black text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#00D1FF]" />
                  GEMINI PROMPT STUDIO
                </h3>
                <p className="text-[9px] text-zinc-500 uppercase mt-0.5">Prompt Extractor, Writer & Creator Launch</p>
              </div>
              <span className="text-[8px] bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/30 font-mono px-1.5 py-0.5 rounded font-black uppercase">
                CO-PILOT
              </span>
            </div>

            <div className="text-zinc-400 text-[10px] bg-black/40 p-2.5 rounded border border-zinc-900 leading-relaxed">
              💡 <strong>How to use:</strong> Describe creative visual tweaks you want in the box below. Gemini will analyze the current image and engineer a <strong>perfectly optimized prompt</strong> for advanced AI Image Models.
            </div>

            {/* User Tweak Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-mono text-zinc-500 uppercase">Describe your creative tweaks / style twists</label>
              <textarea
                id="prompt-tweaks-input"
                rows={2}
                placeholder="e.g. Add glowing neon blue lasers shoot from eyes, make background a dark cyberpunk sky, oil-painting renaissance style..."
                value={promptTweaks}
                onChange={(e) => setPromptTweaks(e.target.value)}
                className="w-full bg-[#111111] text-[#F0F0F0] border border-zinc-805 rounded text-xs p-2 focus:outline-none focus:border-[#00D1FF] placeholder-zinc-650 font-mono focus:ring-1 focus:ring-[#00D1FF]"
              />
            </div>

            {/* BUTTONS */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              {/* Extract Prompt Button */}
              <button
                id="extract-prompt-action"
                onClick={handleExtractPrompt}
                disabled={isExtractingPrompt}
                className="bg-black text-[#00D1FF] hover:bg-[#00D1FF] hover:text-black border border-[#00D1FF] font-black py-2 rounded uppercase text-[10px] tracking-wider transition-all flex items-center justify-center gap-1 opacity-90 disabled:opacity-50"
              >
                {isExtractingPrompt ? (
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles size={11} />
                    <span>EXTRACT PROMPT</span>
                  </>
                )}
              </button>

              {/* Take user directly to Gemini Image Model / External Web App */}
              <a
                href="https://gemini.google.com"
                target="_blank"
                rel="noreferrer"
                className="bg-[#00D1FF] text-black font-black py-2 rounded uppercase text-[10px] tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-1 active:scale-95"
                title="Launch Google Gemini Web App for free unlimited Image Generation"
              >
                <ExternalLink size={11} />
                <span>LAUNCH GEMINI</span>
              </a>
            </div>

            {/* Extractor Prompt Results Panel */}
            {promptError && (
              <div className="text-[10px] bg-red-950/80 border border-red-500/30 text-red-300 p-2 rounded flex items-start gap-1.5">
                <AlertCircle size={11} className="shrink-0 mt-0.5" />
                <span>{promptError}</span>
              </div>
            )}

            {extractedPromptData && (
              <div className="bg-zinc-950 p-3 rounded border border-zinc-800/80 flex flex-col gap-2 mt-1.5 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5">
                  <span className="text-[9px] font-mono font-black text-[#00D1FF] uppercase">Engineered Ideal Prompt</span>
                  <span className="text-[8px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-1 py-0.2 rounded uppercase tracking-wider font-bold">
                    {extractedPromptData.suggestedStylePreset}
                  </span>
                </div>

                <div className="relative">
                  <pre className="text-[10px] text-zinc-300 whitespace-pre-wrap font-mono bg-black p-2.5 rounded border border-zinc-900 leading-normal select-text max-h-[140px] overflow-y-auto">
                    {extractedPromptData.idealPrompt}
                  </pre>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(extractedPromptData.idealPrompt);
                      setCopiedPrompt(true);
                      setTimeout(() => setCopiedPrompt(false), 2000);
                    }}
                    className="absolute top-1.5 right-1.5 bg-zinc-900/95 hover:bg-[#00D1FF] hover:text-black text-zinc-400 p-1 rounded border border-zinc-800 transition active:scale-90"
                    title="Copy Ideal Prompt to Clipboard"
                  >
                    {copiedPrompt ? <Check size={11} /> : <Copy size={11} />}
                  </button>
                </div>

                <div className="text-[9px] text-zinc-500 leading-normal mt-0.5">
                  <strong className="text-zinc-400 uppercase font-mono font-black">Original Style:</strong> {extractedPromptData.extractedStyle}
                  <div className="text-[8px] mt-1 text-[#00D1FF]/70">
                    💡 Click copy icon & click LAUNCH GEMINI to generate picture there instantly!
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action reset option */}
          <button
            id="reset-state-triggers"
            onClick={() => {
              setUploadedImage(null);
              selectTemplate(TRENDING_TEMPLATES[0]);
              setCustomTexts([]);
              setContextBonusPrompt('programmer humor');
              setPromptTweaks('');
              setExtractedPromptData(null);
            }}
            className="w-full border border-dashed border-zinc-800 hover:border-red-500/50 hover:bg-red-950/10 text-zinc-600 hover:text-red-400 transition-all font-mono text-[9px] uppercase tracking-wider py-1.5 rounded flex items-center justify-center gap-1"
          >
            <RotateCcw size={10} />
            RESET EDITOR TO FACTORY DEFAULTS
          </button>

        </aside>
      </main>

      {/* Futuristic Cyberpunk Telemetry Footer */}
      <footer className="min-h-12 h-auto py-3 sm:py-0 border-t-2 border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-8 bg-[#0E0E0E] text-[10px] text-zinc-600 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#CDFF00] opacity-75 animate-ping shrink-0" />
          <span>STATUS: AI_ENGINES_READY // CHIP: GEMINI_3.5_FLASH // ACCENT_THEME: ARTISTIC_FLAIR</span>
        </div>
        <div className="text-center sm:text-right">
          <span>&copy; 2026 MEMELAB.AI &bull; DESIGN: NEOPRUTALIST // ALL INTENTS SATISFIED</span>
        </div>
      </footer>

    </div>
  );
}
