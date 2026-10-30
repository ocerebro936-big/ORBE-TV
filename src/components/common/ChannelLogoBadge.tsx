import React, { useState } from 'react';
import { Channel } from '../../types/content';
import { Tv, Sparkles } from 'lucide-react';

interface ChannelLogoBadgeProps {
  channel: Channel;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showCornerUBlueBadge?: boolean;
}

export const ChannelLogoBadge: React.FC<ChannelLogoBadgeProps> = ({
  channel,
  size = 'md',
  className = '',
  showCornerUBlueBadge = true,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg'
  };

  // Helper to extract clean initials (e.g., "TVM 1" -> "TVM", "STV" -> "STV", "UBlue TV" -> "UB")
  const getInitials = (name: string): string => {
    if (name.includes('TVM')) return 'TVM';
    if (name.includes('STV')) return 'STV';
    if (name.includes('Miramar')) return 'MIR';
    if (name.includes('Sucesso')) return 'SUC';
    if (name.includes('RTP')) return 'RTP';
    if (name.includes('DW')) return 'DW';
    if (name.includes('Euronews')) return 'EUR';
    if (name.includes('Red Bull')) return 'RB';
    if (name.includes('NASA')) return 'NASA';
    if (name.includes('UBlue') || name.includes('UB')) return 'UB';
    if (name.includes('KTV')) return 'KTV';
    if (name.includes('CNN')) return 'CNN';
    if (name.includes('SIC')) return 'SIC';

    const words = name.replace(/[^a-zA-Z0-9 ]/g, '').trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (words[0] || 'TV').slice(0, 3).toUpperCase();
  };

  // Category based gradient colors for fallback tiles
  const getGradientByCategory = (cat: string) => {
    switch (cat) {
      case 'sports':
        return 'from-emerald-900 via-teal-950 to-slate-950 text-emerald-300 border-emerald-500/40';
      case 'music':
        return 'from-fuchsia-900 via-purple-950 to-slate-950 text-fuchsia-300 border-fuchsia-500/40';
      case 'news':
        return 'from-red-900 via-slate-900 to-slate-950 text-red-300 border-red-500/40';
      case 'movies':
        return 'from-amber-900 via-amber-950 to-slate-950 text-amber-300 border-amber-500/40';
      case 'kids':
        return 'from-pink-900 via-orange-950 to-slate-950 text-pink-300 border-pink-500/40';
      default:
        return 'from-blue-900 via-indigo-950 to-slate-950 text-cyan-300 border-blue-500/40';
    }
  };

  const hasCustomLogo = Boolean(channel.logo && !imageError);

  return (
    <div className={`relative rounded-xl overflow-hidden shrink-0 shadow-md ${sizeClasses[size]} ${className}`}>
      {hasCustomLogo ? (
        <img
          src={channel.logo}
          alt={channel.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover bg-slate-900"
          loading="lazy"
        />
      ) : (
        /* Fallback branded card with Channel Initials & UBlue Style */
        <div
          className={`w-full h-full flex flex-col items-center justify-center font-black tracking-wider bg-gradient-to-br ${getGradientByCategory(
            channel.category
          )} border p-1 select-none`}
        >
          <span className="font-mono leading-none drop-shadow-md">
            {getInitials(channel.name)}
          </span>
          {size !== 'xs' && size !== 'sm' && (
            <span className="text-[8px] font-sans font-semibold text-slate-400 leading-tight mt-0.5">
              CH {channel.number}
            </span>
          )}
        </div>
      )}

      {/* Official UBlue TV Corner Watermark Badge */}
      {showCornerUBlueBadge && (
        <div
          className="absolute -bottom-0.5 -right-0.5 px-1 py-0.2 rounded-tl-md bg-blue-600/95 border-t border-l border-cyan-300/40 text-[7px] font-black tracking-tight text-white shadow-sm flex items-center gap-0.5 pointer-events-none select-none z-10"
          title="UBlue TV Certified Broadcast"
        >
          <span className="w-1 h-1 rounded-full bg-cyan-300 animate-pulse" />
          <span>UB</span>
        </div>
      )}
    </div>
  );
};
