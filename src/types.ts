export interface MemeTemplate {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  defaultTop: string;
  defaultBottom: string;
}

export type FontStyle = 'Impact' | 'Inter' | 'Space Grotesk' | 'JetBrains Mono' | 'Arial' | 'Comic Sans MS';

export interface TextPosition {
  text: string;
  fontSize: number;
  color: string;
  strokeColor: string;
  hasStroke: boolean;
  isUppercase: boolean;
  x: number; // percentage of canvas width (0 to 100)
  y: number; // percentage of canvas height (0 to 100)
  fontFamily: FontStyle;
  weight: string;
  align: 'left' | 'center' | 'right';
}

export interface GeneratorState {
  currentTemplate: MemeTemplate | null;
  uploadedImage: string | null; // Base64 data URL
  textSettings: {
    top: TextPosition;
    bottom: TextPosition;
  };
  customTexts: CustomText[];
  magicCaptions: string[];
  isLoadingCaptions: boolean;
  contextBonusPrompt: string;
  canvasWidth: number;
  canvasHeight: number;
}

export interface CustomText {
  id: string;
  text: string;
  fontSize: number;
  color: string;
  strokeColor: string;
  hasStroke: boolean;
  isUppercase: boolean;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  fontFamily: FontStyle;
  align: 'left' | 'center' | 'right';
}
