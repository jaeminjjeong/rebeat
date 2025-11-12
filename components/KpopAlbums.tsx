import React from 'react';
import { kpopAlbumsData } from '../data/kpopAlbums';
import { KpopAlbum } from '../types';

const AlbumCard: React.FC<{ album: KpopAlbum }> = ({ album }) => (
  <div className="bg-white rounded-lg overflow-hidden border border-gray-200/80 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group flex flex-col">
    <div className="overflow-hidden">
      <img 
        src={album.imageUrl} 
        alt={`${album.title} by ${album.artist}`} 
        className="w-full h-auto object-cover aspect-square transform transition-transform duration-300 group-hover:scale-110" 
      />
    </div>
    <div className="p-4 text-left flex flex-col flex-grow">
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-900 truncate" title={album.title}>{album.title}</h3>
        <p className="text-sm text-gray-500 truncate" title={album.artist}>{album.artist}</p>
      </div>
      <div className="mt-4">
        {album.price && (
          <p className="text-xl font-extrabold text-gray-900 mb-3">${album.price.toFixed(2)}</p>
        )}
        <button className="w-full bg-rose-500 text-white font-semibold py-2 rounded-md hover:bg-rose-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-rose-500">
          View Details
        </button>
      </div>
    </div>
  </div>
);

export const KpopAlbumsPage = () => (
  <div className="container mx-auto px-4">
    <div className="max-w-4xl mx-auto text-center mb-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
        Explore <span className="text-rose-500">K-POP Albums</span>
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Discover the latest hits and all-time favorites from the world of K-POP.
      </p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {kpopAlbumsData.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  </div>
);