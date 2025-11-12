import React, { useState, useCallback, useMemo, useRef } from 'react';
import { SouvenirRequest } from './types';
import { generateSouvenirIdeas, SouvenirIdea } from './services/geminiService';
import { RebeatLogo, CalendarIcon, SparklesIcon, LoaderIcon, UploadIcon, TrashIcon } from './components/Icons';
import { KpopAlbumsPage } from './components/KpopAlbums';
import { ActivitiesPage } from './components/Activities';
import { Whiteboard } from './components/Whiteboard';

type Page = 'souvenir' | 'kpop' | 'activity';

const Header: React.FC<{ currentPage: Page; onNavigate: (page: Page) => void }> = ({ currentPage, onNavigate }) => {
  const navItemClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 whitespace-nowrap";
  const activeClasses = "bg-rose-500 text-white shadow-sm";
  const inactiveClasses = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between p-3">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('souvenir')}>
          <RebeatLogo className="w-24 h-auto text-gray-900" />
        </div>
        <nav className="flex items-center gap-2 bg-white/50 p-1 rounded-lg border border-gray-200/80">
          <button
            onClick={() => onNavigate('souvenir')}
            className={`${navItemClasses} ${currentPage === 'souvenir' ? activeClasses : inactiveClasses}`}
            aria-current={currentPage === 'souvenir' ? 'page' : undefined}
          >
            Create Souvenir
          </button>
          <button
            onClick={() => onNavigate('kpop')}
            className={`${navItemClasses} ${currentPage === 'kpop' ? activeClasses : inactiveClasses}`}
            aria-current={currentPage === 'kpop' ? 'page' : undefined}
          >
            K-POP Albums
          </button>
          <button
            onClick={() => onNavigate('activity')}
            className={`${navItemClasses} ${currentPage === 'activity' ? activeClasses : inactiveClasses}`}
            aria-current={currentPage === 'activity' ? 'page' : undefined}
          >
            Activities
          </button>
        </nav>
      </div>
    </header>
  );
};

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
};

const ImageUploader: React.FC<{ onChange: (dataUrl: string | undefined) => void }> = ({ onChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB size limit
          alert("File is too large! Please upload an image under 10MB.");
          return;
      }
      setFileName(file.name);
      try {
        const base64 = await fileToBase64(file);
        setPreview(base64);
        onChange(base64);
      } catch (error) {
        console.error("Error converting file to base64:", error);
        alert("Could not read the file. Please try another image.");
      }
    }
  }, [onChange]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files);
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName('');
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleClick = () => {
      fileInputRef.current?.click();
  }

  return (
    <div className="space-y-2">
       <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e.target.files)}
        accept="image/*"
        className="hidden"
      />
      {preview ? (
        <div className="bg-gray-50 p-2 rounded-md text-center border-2 border-gray-300">
          <img src={preview} alt="Preview" className="max-h-36 mx-auto rounded" />
          <div className="mt-2 flex items-center justify-between text-xs text-gray-600 px-1">
            <span className="truncate flex-1 text-left">{fileName}</span>
            <button
              type="button"
              onClick={handleRemove}
              className="ml-2 p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Remove image"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="w-full h-48 bg-gray-50 border-2 border-gray-300 border-dashed rounded-md cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-rose-400 transition-colors"
          role="button"
          aria-label="Upload an image"
        >
          <UploadIcon className="w-10 h-10 mb-2" />
          <p className="font-semibold">Click to upload or drag and drop</p>
          <p className="text-xs mt-1">PNG, JPG up to 10MB</p>
        </div>
      )}
    </div>
  );
};

const ImageSketchUploader: React.FC<{ onChange: (dataUrl: string | undefined) => void }> = ({ onChange }) => {
  const [mode, setMode] = useState<'upload' | 'draw'>('upload');

  const handleModeChange = (newMode: 'upload' | 'draw') => {
    if (mode !== newMode) {
      setMode(newMode);
      onChange(undefined); // Clear data when switching modes
    }
  };

  const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => {
    const baseClasses = "w-1/2 text-center px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500 rounded-t-md border-b-2";
    const activeClasses = "bg-white text-gray-900 border-rose-500";
    const inactiveClasses = "text-gray-500 hover:bg-gray-100 hover:text-gray-600 border-transparent";
    return (
      <button type="button" onClick={onClick} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
        {children}
      </button>
    );
  };

  return (
    <div>
      <div className="flex">
        <TabButton active={mode === 'upload'} onClick={() => handleModeChange('upload')}>
          Upload Image
        </TabButton>
        <TabButton active={mode === 'draw'} onClick={() => handleModeChange('draw')}>
          Draw Sketch
        </TabButton>
      </div>
      <div className="bg-white rounded-b-md p-2">
        {mode === 'upload' ? (
          <ImageUploader onChange={onChange} />
        ) : (
          <Whiteboard onChange={onChange} />
        )}
      </div>
    </div>
  );
};

const SouvenirForm: React.FC<{ onSubmit: (data: SouvenirRequest) => void; initialData?: SouvenirRequest | null }> = ({ onSubmit, initialData }) => {
  const [type, setType] = useState(initialData?.type || 'Jibbitz for Crocs');
  const [description, setDescription] = useState(initialData?.description || '');
  const [designSketch, setDesignSketch] = useState<string | undefined>(undefined);
  
  const defaultPickupDate = useMemo(() => {
    const aWeekFromNow = new Date();
    aWeekFromNow.setDate(aWeekFromNow.getDate() + 7);
    return aWeekFromNow.toISOString().split('T')[0];
  }, []);

  const [pickupDate, setPickupDate] = useState(initialData?.pickupDate || defaultPickupDate);

  const minDate = useMemo(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ type, pickupDate, description, designSketch });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full animate-fade-in">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">What would you like to make?</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900"
        >
          <option>Jibbitz for Crocs</option>
          <option>Fridge Magnet</option>
          <option>Keychain</option>
          <option>Phone Grip</option>
          <option>Miniature Figurine</option>
          <option>Lamp</option>
          <option>Photo Frame</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700">When do you need it by?</label>
        <div className="relative mt-1">
          <input
            type="date"
            id="pickupDate"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            required
            min={minDate}
            className="block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900 pr-10"
          />
          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Describe your design idea</label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., 'A cute Shiba Inu wearing a traditional Hanbok', or 'The Namsan Tower with cherry blossoms'..."
          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Upload an image or draw a sketch (optional)</label>
        <div className="mt-1">
           <ImageSketchUploader onChange={setDesignSketch} />
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 focus:ring-rose-500 disabled:bg-rose-500/50 disabled:cursor-not-allowed transition-colors"
      >
        Bring My Idea to Life!
      </button>
    </form>
  );
};

const SouvenirPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [souvenirIdeas, setSouvenirIdeas] = useState<SouvenirIdea[] | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<SouvenirIdea | null>(null);
  const [lastRequest, setLastRequest] = useState<SouvenirRequest | null>(null);

  const handleFormSubmit = useCallback(async (formData: SouvenirRequest) => {
    setIsLoading(true);
    setSouvenirIdeas(null);
    setSelectedIdea(null);
    setError('');
    setLastRequest(formData);
    
    try {
      const results = await generateSouvenirIdeas(
        formData.type,
        formData.description,
        formData.designSketch
      );
      setSouvenirIdeas(results);
    } catch (err: any) {
       setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setSouvenirIdeas(null);
    setSelectedIdea(null);
    setError('');
    setLastRequest(null);
  };
  
  const handleSelectIdea = (idea: SouvenirIdea) => {
      setSelectedIdea(idea);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center space-y-4 animate-fade-in">
          <LoaderIcon className="mx-auto w-12 h-12 animate-spin text-rose-500" />
          <h2 className="text-xl font-semibold text-gray-900">Designing Your Souvenirs...</h2>
          <p className="text-gray-600">Our AI is drafting 5 unique concepts for you!</p>
        </div>
      );
    }

    if (selectedIdea) {
      return (
        <div className="text-center w-full animate-fade-in">
          <SparklesIcon className="mx-auto h-12 w-12 text-rose-500" />
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Great Choice!</h2>
          <div className="mt-6 aspect-square w-full max-w-sm mx-auto bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-lg">
            <img src={selectedIdea.imageUrl} alt={selectedIdea.title} className="w-full h-full object-contain" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mt-4">{selectedIdea.title}</h3>
          <p className="mt-2 text-gray-600 whitespace-pre-wrap">{selectedIdea.description}</p>
          <p className="mt-4 text-sm text-gray-500">Our team will be in touch shortly with a quote and next steps.</p>
          <button
            onClick={handleReset}
            className="mt-8 w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-rose-500"
          >
            Create Another Souvenir
          </button>
        </div>
      );
    }

    if (souvenirIdeas) {
      return (
        <div className="w-full animate-fade-in text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">We've designed 5 ideas for you!</h2>
            <div className="space-y-4">
                {souvenirIdeas.map((idea, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors">
                        <img src={idea.imageUrl} alt={idea.title} className="w-24 h-24 object-contain rounded-md bg-gray-100 flex-shrink-0" />
                        <div className="flex-grow">
                            <h3 className="font-bold text-gray-900">{idea.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
                        </div>
                        <button 
                            onClick={() => handleSelectIdea(idea)}
                            className="bg-rose-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-rose-700 transition-colors flex-shrink-0"
                        >
                            Select
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={handleReset}
                className="mt-8 text-sm font-semibold text-rose-500 hover:text-rose-600"
            >
                Or, start over with a new idea
            </button>
        </div>
      );
    }

    return (
        <div className="w-full">
           {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm text-left animate-fade-in">
                <p className="font-bold">Generation Failed</p>
                <p>{error}</p>
            </div>
          )}
          <SouvenirForm onSubmit={handleFormSubmit} initialData={lastRequest} />
        </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="mb-8 overflow-hidden rounded-2xl shadow-xl border-2 border-white aspect-video animate-fade-in">
          <img 
            src="https://storage.googleapis.com/aistudio-hosting/prompts/1721899148518.jpeg" 
            alt="A person holding a miniature 3D printed model of a Korean pagoda, representing a personalized souvenir." 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Your Korean Souvenir, <span className="text-rose-500">Uniquely Yours</span>.
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Don't just buy a souvenir—create one. Upload an image of your idea, and we'll 3D print a personalized memento of your trip to Korea.
            </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200/80 min-h-[500px] flex items-center justify-center">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};


const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('souvenir');

  return (
    <div className="relative min-h-screen bg-slate-50 font-sans">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="relative pt-24 pb-12">
        {currentPage === 'souvenir' && <SouvenirPage />}
        {currentPage === 'kpop' && <KpopAlbumsPage />}
        {currentPage === 'activity' && <ActivitiesPage />}
      </main>
    </div>
  );
};

export default App;