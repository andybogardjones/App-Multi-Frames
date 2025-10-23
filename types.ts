
export interface StoryboardImage {
  id: string;
  src: string; // base64 data URL
  prompt: string;
}

export interface Suggestion {
  category: string;
  prompt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
