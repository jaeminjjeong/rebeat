export interface SouvenirRequest {
  type: string;
  pickupDate: string;
  description: string;
  designSketch?: string; // Changed from designFile?: File
}

export interface KpopAlbum {
  id: number;
  artist: string;
  title: string;
  imageUrl: string;
  price?: number;
}

export interface Activity {
  id: number;
  title: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  duration: string;
  price: number;
  isPopular?: boolean;
  labels?: string[];
  article?: {
    title: string;
    content: string;
  };
}