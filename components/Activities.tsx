import React, { useState } from 'react';
import { activitiesData } from '../data/activities';
import { Activity } from '../types';
import { ClockIcon, StarIcon } from './Icons';

const ActivityCard: React.FC<{ activity: Activity; onSelect: (activity: Activity) => void }> = ({ activity, onSelect }) => (
  <div className="bg-white rounded-lg overflow-hidden border border-gray-200/80 flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="relative overflow-hidden">
      <img 
        src={activity.imageUrl} 
        alt={activity.title}
        className="w-full h-40 object-cover transform transition-transform duration-300 group-hover:scale-110" 
      />
      {activity.isPopular && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
          LIKELY TO SELL OUT
        </div>
      )}
    </div>
    <div className="p-4 flex flex-col flex-grow">
      {activity.labels && activity.labels.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {activity.labels.map((label) => (
            <span key={label} className="bg-rose-100 text-rose-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {label}
            </span>
          ))}
        </div>
      )}
      <h3 className="text-md font-bold text-gray-900 flex-grow mb-2" title={activity.title}>{activity.title}</h3>
      <div className="flex items-center gap-1 text-sm text-yellow-500">
        <StarIcon className="w-4 h-4" />
        <span className="font-bold">{activity.rating.toFixed(1)}</span>
        <span className="text-gray-500 text-xs">({activity.reviews} reviews)</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
        <ClockIcon className="w-4 h-4" />
        <span>{activity.duration}</span>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <p className="text-lg text-gray-900">
          <span className="text-sm text-gray-500">from</span>{' '}
          <span className="font-extrabold">${activity.price}</span>
        </p>
        <button 
          onClick={() => onSelect(activity)}
          className="bg-rose-500 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-rose-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-rose-500"
        >
          View Details
        </button>
      </div>
    </div>
  </div>
);

const ActivityDetailView: React.FC<{ activity: Activity, onBack: () => void }> = ({ activity, onBack }) => (
    <div className="container mx-auto px-4 animate-fade-in">
        <button onClick={onBack} className="mb-8 text-sm text-rose-500 hover:text-rose-600 font-semibold">
            &larr; Back to all activities
        </button>
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
             <img src={activity.imageUrl} alt={activity.title} className="w-full h-64 object-cover" />
             <div className="p-8">
                <h1 className="text-3xl font-extrabold text-gray-900">{activity.title}</h1>

                {activity.labels && activity.labels.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {activity.labels.map((label) => (
                            <span key={label} className="bg-rose-100 text-rose-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                {label}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600 mt-4">
                    <div className="flex items-center gap-1 text-yellow-500">
                        <StarIcon className="w-4 h-4" />
                        <span className="font-bold">{activity.rating.toFixed(1)}</span>
                        <span className="text-gray-500 text-xs">({activity.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        <span>{activity.duration}</span>
                    </div>
                </div>

                {activity.article ? (
                    <div className="mt-6 prose prose-p:text-gray-600 prose-strong:text-gray-900 prose-headings:text-rose-600 max-w-none">
                        <h2 className="text-2xl font-bold text-rose-600">{activity.article.title}</h2>
                        {activity.article.content.split('\n\n').map((paragraph, i) => (
                             <div key={i}>
                                {paragraph.split('\n').map((line, j) => {
                                     if (line.startsWith('- ')) {
                                        return <p key={j} className="ml-4">{line}</p>;
                                     }
                                     if (line.startsWith('**') && line.endsWith('**')) {
                                         return <p key={j}><strong>{line.slice(2, -2)}</strong></p>;
                                     }
                                     return <p key={j}>{line}</p>;
                                })}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-6 text-gray-600">More details about this activity will be available soon. Ready to book?</p>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                    <p className="text-3xl text-gray-900">
                        <span className="text-lg text-gray-500">Price</span>{' '}
                        <span className="font-extrabold">${activity.price}</span>
                        <span className="text-base font-normal text-gray-500"> / person</span>
                    </p>
                    <button className="bg-red-600 text-white font-semibold py-3 px-8 rounded-md text-base hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-red-500">
                        Book Now
                    </button>
                </div>
             </div>
        </div>
    </div>
);


export const ActivitiesPage = () => {
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

    if (selectedActivity) {
        return <ActivityDetailView activity={selectedActivity} onBack={() => setSelectedActivity(null)} />;
    }

    return (
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Unforgettable <span className="text-rose-500">Korean Experiences</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            From K-POP dance classes to historical tours, discover and book the best activities Seoul has to offer.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {activitiesData.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} onSelect={setSelectedActivity} />
          ))}
        </div>
      </div>
    );
};