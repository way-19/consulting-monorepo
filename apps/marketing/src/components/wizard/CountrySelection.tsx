import React from 'react';
import { Globe, Star, Clock, DollarSign } from 'lucide-react';

export interface Country {
  code: string;
  name: string;
  flag: string;
  price: number;
  timeframe: string;
  recommended?: boolean;
  active: boolean;
}

interface CountrySelectionProps {
  countries: Country[];
  selectedCountry: Country | null;
  onCountrySelect: (country: Country) => void;
}

const CountrySelection: React.FC<CountrySelectionProps> = ({
  countries,
  selectedCountry,
  onCountrySelect
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Country</h2>
        <p className="text-gray-600">Choose where you want to incorporate your company</p>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        
        @keyframes wave {
          0%, 100% { 
            transform: perspective(400px) rotateX(0deg) rotateY(0deg);
            filter: brightness(1);
          }
          25% { 
            transform: perspective(400px) rotateX(5deg) rotateY(-2deg);
            filter: brightness(1.1);
          }
          50% { 
            transform: perspective(400px) rotateX(0deg) rotateY(0deg);
            filter: brightness(1.05);
          }
          75% { 
            transform: perspective(400px) rotateX(-5deg) rotateY(2deg);
            filter: brightness(1.1);
          }
        }
        
        @keyframes flagWave {
          0%, 100% { 
            clip-path: polygon(0% 0%, 100% 0%, 95% 25%, 100% 50%, 95% 75%, 100% 100%, 0% 100%, 5% 75%, 0% 50%, 5% 25%);
            transform: scaleX(1);
          }
          50% { 
            clip-path: polygon(0% 0%, 100% 0%, 98% 25%, 100% 50%, 98% 75%, 100% 100%, 0% 100%, 2% 75%, 0% 50%, 2% 25%);
            transform: scaleX(1.02);
          }
        }
        
        @keyframes cardFloat {
          0%, 100% { 
            transform: translateY(0px) rotateX(0deg);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }
          50% { 
            transform: translateY(-5px) rotateX(1deg);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          }
        }

        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }
        
        .flag-wave {
          animation: flagWave 3s ease-in-out infinite;
          transform-origin: left center;
        }
        
        .card-float {
          animation: cardFloat 4s ease-in-out infinite;
        }
        
        .glass-morphism {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.1),
            0 4px 16px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glass-morphism:hover {
          transform: perspective(1000px) rotateX(-2deg) rotateY(2deg) translateY(-8px);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.15),
            0 12px 24px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }
        
        .glass-morphism-active {
          backdrop-filter: blur(25px);
          background: rgba(59, 130, 246, 0.15);
          border: 2px solid rgba(59, 130, 246, 0.3);
          box-shadow: 
            0 20px 40px rgba(59, 130, 246, 0.2),
            0 10px 20px rgba(59, 130, 246, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            0 0 0 4px rgba(59, 130, 246, 0.1);
          transform: perspective(1000px) rotateX(-1deg) rotateY(1deg) translateY(-4px);
        }
        
        .glass-morphism-active:hover {
          transform: perspective(1000px) rotateX(-3deg) rotateY(3deg) translateY(-12px);
          box-shadow: 
            0 30px 60px rgba(59, 130, 246, 0.25),
            0 15px 30px rgba(59, 130, 246, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            0 0 0 6px rgba(59, 130, 246, 0.15);
        }
        
        .glass-morphism-inactive {
          backdrop-filter: blur(10px);
          background: rgba(156, 163, 175, 0.1);
          border: 1px solid rgba(156, 163, 175, 0.2);
          box-shadow: 
            0 4px 16px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
        }
      `}</style>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {countries.map((country, index) => (
          <div
            key={country.code}
            className={`relative overflow-hidden rounded-xl cursor-pointer card-float ${
              country.active 
                ? selectedCountry?.code === country.code
                  ? 'glass-morphism-active ring-4 ring-blue-300 ring-opacity-50'
                  : 'glass-morphism'
                : 'glass-morphism-inactive opacity-60 cursor-not-allowed'
            }`}
            style={{
              backgroundImage: country.active 
                ? selectedCountry?.code === country.code
                  ? `linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 197, 253, 0.1) 100%), url(${country.flag})`
                  : `linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%), url(${country.flag})`
                : 'linear-gradient(135deg, rgba(156, 163, 175, 0.9) 0%, rgba(156, 163, 175, 0.7) 100%)',
              backgroundSize: country.active ? 'cover, cover' : 'cover',
              backgroundPosition: country.active ? 'center, center' : 'center',
              backgroundBlendMode: country.active ? 'overlay, normal' : 'normal',
              animationDelay: `${index * 0.2}s`
            }}
            onClick={() => country.active && onCountrySelect(country)}
          >
            {/* Dynamic Flag Background Overlay */}
            {country.active && (
              <div 
                className="absolute inset-0 flag-wave opacity-30"
                style={{
                  backgroundImage: `url(${country.flag})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  mixBlendMode: 'multiply'
                }}
              />
            )}
            {/* Shimmer effect for active countries */}
            {country.active && (
              <div className="absolute inset-0 shimmer opacity-30"></div>
            )}
            
            {/* Badges */}
            {country.recommended && country.active && (
              <div className="absolute top-2 right-2 z-20">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 text-xs font-medium rounded-md shadow-md">
                  <span className="flex items-center gap-1">
                    <span>⭐</span>
                    <span>RECOMMENDED</span>
                  </span>
                </div>
              </div>
            )}
            {country.active === false && (
              <div className="absolute top-2 left-2 z-20">
                <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-2 py-1 text-xs font-medium rounded-md shadow-md">
                  <span className="flex items-center gap-1">
                    <span>⏳</span>
                    <span>COMING SOON</span>
                  </span>
                </div>
              </div>
            )}

            <div className="relative p-4 pt-8 z-10 flex-1 flex flex-col justify-between">
              {/* Text Background Overlay for Better Readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/85 backdrop-blur-sm rounded-xl"></div>
              
              {/* Top Section - Flag and Country Info */}
              <div className="relative z-20">
                <div className="flex items-center space-x-3 mb-4 mt-2">
                  <div 
                    className={`w-10 h-7 rounded-sm overflow-hidden shadow-lg border border-white/30 flex-shrink-0 flag-wave ${
                      selectedCountry?.code === country.code ? 'ring-2 ring-blue-400 shadow-blue-400/50' : ''
                    } ${country.active ? 'hover:scale-110 transition-transform duration-300' : ''}`}
                    style={{
                      backgroundImage: `url(${country.flag})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: country.active ? 'brightness(1.1) contrast(1.1)' : 'brightness(0.7) grayscale(0.5)'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm leading-tight drop-shadow-sm ${
                      country.active ? 'text-gray-900' : 'text-gray-500'
                    }`}
                    style={{ textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)' }}>
                      {country.name}
                    </h3>
                    <p className={`text-xs mt-1 drop-shadow-sm ${
                      country.active ? 'text-gray-600' : 'text-gray-400'
                    }`}
                    style={{ textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)' }}>
                      {country.code}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-4 relative z-20">
                  <div className="flex items-center text-xs">
                    <DollarSign className={`w-3 h-3 mr-1 drop-shadow-sm ${
                      country.active ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <span className={`font-medium drop-shadow-sm ${
                      country.active ? 'text-gray-900' : 'text-gray-500'
                    }`}
                    style={{ textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)' }}>
                      ${country.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Clock className={`w-3 h-3 mr-1 drop-shadow-sm ${
                      country.active ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <span className={`drop-shadow-sm ${
                      country.active ? 'text-gray-700' : 'text-gray-500'
                    }`}
                    style={{ textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)' }}>
                      {country.timeframe}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Action */}
              <div className="mt-auto relative z-20">
                {country.active ? (
                  <div className={`w-full py-2 px-3 rounded-lg text-center text-xs font-medium transition-all duration-200 shadow-lg ${
                    selectedCountry?.code === country.code
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/40 ring-2 ring-blue-300/50'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/30 backdrop-blur-sm'
                  }`}>
                    {selectedCountry?.code === country.code ? '✓ Selected' : 'Select Country'}
                  </div>
                ) : (
                  <div className="w-full py-2 px-3 rounded-lg text-center text-xs font-medium bg-gradient-to-r from-gray-400 to-gray-500 text-white backdrop-blur-sm opacity-70">
                    Coming Soon
                  </div>
                )}
              </div>
            </div>

            {/* Selection indicator */}
            {selectedCountry?.code === country.code && country.active && (
              <div className="absolute top-2 left-2 z-20">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountrySelection;