export type TitisEmotion = 'happy' | 'sad' | 'worried' | 'serious' | 'hopeful' | 'surprised' | 'thoughtful';

export interface Hotspot {
  id: string;
  title: string;
  description: string;
  position3D: [number, number, number]; // [x, y, z] in scene space
  icon?: string;
}

export interface KeyScienceTerm {
  term: string;
  meaning: string;
}

export interface SceneData {
  id: number;
  babakNumber: number;
  title: string;
  theme: string;
  startTime: number;
  endTime: number;
  duration: number;
  narrationText: string;
  speechSubtitles: { startOffset: number; endOffset: number; text: string }[];
  visualDescription: string;
  titisEmotion: TitisEmotion;
  bgmMood: 'peaceful' | 'dry_heat' | 'rain_storm' | 'sombre' | 'wilting' | 'fragile' | 'curious' | 'celebratory';
  ambientSound: 'nature_stream' | 'scorching_wind' | 'heavy_rain' | 'water_drip' | 'dry_breeze' | 'shallow_stream' | 'wind_chimes' | 'happy_forest';
  environmentStyle: {
    skyColor: string;
    groundColor: string;
    lightColor: string;
    sunPosition: [number, number, number];
    fogColor: string;
    fogDensity: number;
  };
  hotspots: Hotspot[];
  keyTerms: KeyScienceTerm[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
