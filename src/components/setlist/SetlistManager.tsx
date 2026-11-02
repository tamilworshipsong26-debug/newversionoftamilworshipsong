import React, { useState } from 'react';
import { Trash2, Share2, Play, Calendar, Check } from 'lucide-react';
import { ServiceSetlist, SetlistItem } from '../../types/setlist';
import { Hymn } from '../../types/hymn';

interface SetlistManagerProps {
  roomId: string;
  onLaunchItem: (item: SetlistItem) => void;
  availableHymns: Hymn[];
}

export const SetlistManager: React.FC<SetlistManagerProps> = ({
  roomId,
  onLaunchItem
}) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [setlist, setSetlist] = useState<ServiceSetlist>({
    id: 'sunday-morning',
    title: 'Sunday Morning Worship Service',
    serviceDate: new Date().toISOString().split('T')[0],
    roomId,
    items: [
      {
        id: 'cue-1',
        type: 'hymn',
        refId: 'zion-1',
        title: 'துதிப்போம் வாருங்கள் தேவ தேவனை',
        subtitle: 'Songs of Zion #1 (Opening Praise)',
        order: 1
      },
      {
        id: 'cue-2',
        type: 'bible',
        refId: 'PSA-23',
        title: 'சங்கீதம் 23 / Psalm 23',
        subtitle: 'Scripture Reading (Tamil BSI + NKJV)',
        order: 2
      },
      {
        id: 'cue-3',
        type: 'hymn',
        refId: 'zion-142',
        title: 'எந்தக் காலத்திலும் எந்த நேரத்திலும்',
        subtitle: 'Songs of Zion #142 (Offertory Hymn)',
        order: 3
      }
    ],
    updatedAt: Date.now()
  });

  const handleShareWhatsApp = () => {
    const lines = [
      `🙏 *${setlist.title}* (${setlist.serviceDate})`,
      `Room: ${setlist.roomId}`,
      `--------------------------`,
      ...setlist.items.map((it, idx) => `${idx + 1}. [${it.type.toUpperCase()}] ${it.title} - ${it.subtitle}`)
    ];
    const text = lines.join('\n');
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = () => {
    const lines = [
      `*${setlist.title}* (${setlist.serviceDate})`,
      `Room: ${setlist.roomId}`,
      `--------------------------`,
      ...setlist.items.map((it, idx) => `${idx + 1}. ${it.title} - ${it.subtitle}`)
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleDeleteItem = (id: string) => {
    setSetlist(prev => ({
      ...prev,
      items: prev.items.filter(it => it.id !== id)
    }));
  };

  return (
    <div className="flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-xl max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <Calendar className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {setlist.title}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Date: {setlist.serviceDate} • Synced with Live Room: {setlist.roomId}
          </p>
        </div>

        {/* Share buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedShare ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Setlist Cues List */}
      <div className="divide-y divide-slate-800/60 my-3">
        {setlist.items.map((item, index) => (
          <div
            key={item.id}
            className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-slate-850/50 rounded-xl transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-7 h-7 rounded-lg bg-slate-800 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">
                {index + 1}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${
                    item.type === 'hymn' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {item.type}
                  </span>
                  <span className="font-semibold text-sm text-white font-tamil truncate">
                    {item.title}
                  </span>
                </div>
                <div className="text-xs text-slate-400 truncate mt-0.5">
                  {item.subtitle}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onLaunchItem(item)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
                title="Launch directly to live booth"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Launch</span>
              </button>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                title="Remove cue"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
