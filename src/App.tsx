import React, { useState, useEffect } from 'react';
import { 
  Music, 
  BookOpen, 
  Radio, 
  Calendar, 
  Hash
} from 'lucide-react';
import { Hymn, LyricLanguage } from './types/hymn';
import { BibleVerse } from './types/bible';
import { BroadcastRoom } from './types/room';
import { SetlistItem } from './types/setlist';
import { SEED_HYMNS } from './data/seedHymns';
import { SEED_BIBLE_VERSES } from './data/seedBible';
import { seedHymnsIfEmpty, seedBibleIfEmpty } from './services/db';
import { syncManager } from './services/broadcast';

// Components
import { Header } from './components/layout/Header';
import { QuickDialpadModal } from './components/dialpad/QuickDialpadModal';
import { HymnViewer } from './components/hymns/HymnViewer';
import { BibleViewer } from './components/bible/BibleViewer';
import { DesktopCommandCenter } from './components/live/DesktopCommandCenter';
import { OneThumbRemoteBar } from './components/live/OneThumbRemoteBar';
import { SetlistManager } from './components/setlist/SetlistManager';
import { ObsLowerThirdView } from './components/obs/ObsLowerThirdView';
import { SanctuaryProjectorView } from './components/projector/SanctuaryProjectorView';
import { ReportTypoModal } from './components/common/ReportTypoModal';

export const App: React.FC = () => {
  // Check URL parameters for standalone OBS or Projector views
  const urlParams = new URLSearchParams(window.location.search);
  const viewMode = urlParams.get('view');
  const urlRoom = urlParams.get('room') || 'SANCTUARY-1';

  if (viewMode === 'obs') {
    return <ObsLowerThirdView roomId={urlRoom} />;
  }

  if (viewMode === 'projector') {
    return <SanctuaryProjectorView roomId={urlRoom} />;
  }

  // State
  const [roomId, setRoomId] = useState<string>(urlRoom);
  const [activeTab, setActiveTab] = useState<'hymns' | 'bible' | 'setlist' | 'live'>('hymns');
  const [currentHymn, setCurrentHymn] = useState<Hymn | null>(SEED_HYMNS[0]);
  
  // Independent user-selectable language preferences for songs
  const [hymnPrimaryLang, setHymnPrimaryLang] = useState<LyricLanguage>('tamil');
  const [hymnSecondaryLang, setHymnSecondaryLang] = useState<LyricLanguage | 'none'>('tanglish');

  const [isDialpadOpen, setIsDialpadOpen] = useState(false);
  const [reportingHymn, setReportingHymn] = useState<Hymn | null>(null);

  // Live Room State
  const [activeRoom, setActiveRoom] = useState<BroadcastRoom>({
    roomId: urlRoom,
    sourceType: 'hymn',
    sourceId: 'zion-1',
    currentIndex: 0,
    isBlanked: false,
    bilingualMode: 'parallel',
    primaryText: SEED_HYMNS[0].stanzas[0].tamil.join('\n'),
    secondaryText: SEED_HYMNS[0].stanzas[0].tanglish?.join('\n'),
    referenceTitle: 'Songs of Zion #1',
    subReference: 'பல்லவி (Pallavi)',
    slideBadge: 'பல்லவி',
    obsStyle: 'dark-glass',
    fontScale: 1.0,
    updatedBy: 'console',
    updatedAt: Date.now()
  });

  // Seed local IndexedDB on mount
  useEffect(() => {
    seedHymnsIfEmpty(SEED_HYMNS).catch(console.error);
    seedBibleIfEmpty(SEED_BIBLE_VERSES).catch(console.error);
  }, []);

  // Subscribe to real-time room updates
  useEffect(() => {
    const cleanup = syncManager.setRoom(roomId, (updated) => {
      setActiveRoom(updated);
    });
    return () => cleanup();
  }, [roomId]);

  // Broadcast stanza with user's selected primary & secondary lyric languages
  const handleBroadcastHymnStanza = (
    hymn: Hymn, 
    stanzaIndex: number,
    primaryLang: LyricLanguage = hymnPrimaryLang,
    secondaryLang: LyricLanguage | 'none' = hymnSecondaryLang
  ) => {
    const stanza = hymn.stanzas[stanzaIndex];
    if (!stanza) return;

    const getLines = (lang: LyricLanguage): string[] => {
      if (lang === 'tamil') return stanza.tamil;
      if (lang === 'tanglish') return stanza.tanglish && stanza.tanglish.length ? stanza.tanglish : stanza.tamil;
      if (lang === 'english') return stanza.english && stanza.english.length ? stanza.english : stanza.tamil;
      return stanza.tamil;
    };

    const primaryLines = getLines(primaryLang);
    const secondaryLines = secondaryLang !== 'none' ? getLines(secondaryLang) : [];

    const isPrimaryTa = primaryLang === 'tamil';

    const payload: BroadcastRoom = {
      ...activeRoom,
      roomId,
      sourceType: 'hymn',
      sourceId: hymn.id,
      currentIndex: stanzaIndex,
      isBlanked: false,
      bilingualMode: secondaryLang !== 'none' ? 'parallel' : 'tamil-only',
      primaryText: primaryLines.join('\n'),
      secondaryText: secondaryLines.length ? secondaryLines.join('\n') : undefined,
      referenceTitle: isPrimaryTa 
        ? `${hymn.bookNameTamil || hymn.bookNameEnglish} #${hymn.number}`
        : `${hymn.bookNameEnglish} #${hymn.number}`,
      subReference: isPrimaryTa ? hymn.titleTamil : (hymn.titleTanglish || hymn.titleEnglish || hymn.titleTamil),
      slideBadge: stanza.label,
      updatedAt: Date.now()
    };

    setCurrentHymn(hymn);
    syncManager.broadcast(payload);
  };

  // Broadcast Bible verse with user's selected primary & secondary translations
  const handleBroadcastBibleVerse = (
    vPrimary: BibleVerse, 
    vSec?: BibleVerse, 
    bookPrimaryTitle?: string, 
    bookSecondaryTitle?: string
  ) => {
    const isPrimaryTa = vPrimary.translation === 'TAMIL_BSI';
    const payload: BroadcastRoom = {
      ...activeRoom,
      roomId,
      sourceType: 'bible',
      sourceId: `${vPrimary.bookId}-${vPrimary.chapter}-${vPrimary.verse}`,
      currentIndex: vPrimary.verse,
      isBlanked: false,
      bilingualMode: vSec ? 'parallel' : (isPrimaryTa ? 'tamil-only' : 'english-only'),
      primaryText: vPrimary.text,
      secondaryText: vSec ? vSec.text : undefined,
      referenceTitle: `${bookPrimaryTitle || vPrimary.bookId} ${vPrimary.chapter}:${vPrimary.verse}`,
      subReference: bookSecondaryTitle ? `${bookSecondaryTitle} ${vPrimary.chapter}:${vPrimary.verse}` : undefined,
      slideBadge: isPrimaryTa ? `வசனம் ${vPrimary.verse}` : `Verse ${vPrimary.verse}`,
      updatedAt: Date.now()
    };

    syncManager.broadcast(payload);
  };

  // Step controls (Prev / Next / Blank / Chorus)
  const handlePrev = () => {
    if (!currentHymn) return;
    const prevIdx = Math.max(0, (activeRoom.currentIndex || 0) - 1);
    handleBroadcastHymnStanza(currentHymn, prevIdx, hymnPrimaryLang, hymnSecondaryLang);
  };

  const handleNext = () => {
    if (!currentHymn) return;
    const nextIdx = Math.min(currentHymn.stanzas.length - 1, (activeRoom.currentIndex || 0) + 1);
    handleBroadcastHymnStanza(currentHymn, nextIdx, hymnPrimaryLang, hymnSecondaryLang);
  };

  const handleJumpChorus = () => {
    if (!currentHymn) return;
    const pallaviIdx = currentHymn.stanzas.findIndex(
      s => s.type === 'pallavi' || s.type === 'chorus'
    );
    if (pallaviIdx !== -1) {
      handleBroadcastHymnStanza(currentHymn, pallaviIdx, hymnPrimaryLang, hymnSecondaryLang);
    }
  };

  const handleToggleBlank = () => {
    syncManager.broadcast({
      ...activeRoom,
      roomId,
      isBlanked: !activeRoom.isBlanked,
      updatedAt: Date.now()
    });
  };

  const handleLaunchSetlistItem = (item: SetlistItem) => {
    if (item.type === 'hymn') {
      const h = SEED_HYMNS.find(x => x.id === item.refId);
      if (h) {
        setCurrentHymn(h);
        handleBroadcastHymnStanza(h, 0, hymnPrimaryLang, hymnSecondaryLang);
        setActiveTab('live');
      }
    } else if (item.type === 'bible') {
      setActiveTab('bible');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      {/* Top Universal Header */}
      <Header
        roomId={roomId}
        setRoomId={setRoomId}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDialpad={() => setIsDialpadOpen(true)}
        isLiveActive={!activeRoom.isBlanked}
      />

      {/* Main Tab Bar (Desktop / Tablet view) */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex space-x-1 sm:space-x-3 py-2">
            {[
              { id: 'hymns', label: 'Hymns & Songs', icon: Music, sub: '4 Books' },
              { id: 'bible', label: 'Holy Bible', icon: BookOpen, sub: 'BSI + NKJV' },
              { id: 'setlist', label: 'Service Setlist', icon: Calendar, sub: 'Sunday Cue' },
              { id: 'live', label: 'Sanctuary Booth', icon: Radio, sub: 'OBS Console' }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className="hidden md:inline text-[10px] text-slate-500 font-mono">
                    ({tab.sub})
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-6 pb-28 sm:pb-8">
        {activeTab === 'hymns' && (
          <HymnViewer
            hymns={SEED_HYMNS}
            currentHymn={currentHymn}
            onSelectHymn={(h) => setCurrentHymn(h)}
            activeRoom={activeRoom}
            onBroadcastStanza={handleBroadcastHymnStanza}
            primaryLang={hymnPrimaryLang}
            setPrimaryLang={setHymnPrimaryLang}
            secondaryLang={hymnSecondaryLang}
            setSecondaryLang={setHymnSecondaryLang}
            onOpenReportModal={(h) => setReportingHymn(h)}
          />
        )}

        {activeTab === 'bible' && (
          <BibleViewer
            activeRoom={activeRoom}
            onBroadcastVerse={handleBroadcastBibleVerse}
          />
        )}

        {activeTab === 'setlist' && (
          <SetlistManager
            roomId={roomId}
            onLaunchItem={handleLaunchSetlistItem}
            availableHymns={SEED_HYMNS}
          />
        )}

        {activeTab === 'live' && (
          <DesktopCommandCenter
            roomId={roomId}
            activeRoom={activeRoom}
            currentHymn={currentHymn}
            onPrev={handlePrev}
            onNext={handleNext}
            onJumpChorus={handleJumpChorus}
            onToggleBlank={handleToggleBlank}
            onSelectStanza={(h, idx) => handleBroadcastHymnStanza(h, idx, hymnPrimaryLang, hymnSecondaryLang)}
            onChangeTheme={(theme) => syncManager.broadcast({ ...activeRoom, obsStyle: theme })}
            onChangeFontScale={(scale) => syncManager.broadcast({ ...activeRoom, fontScale: scale })}
          />
        )}
      </main>

      {/* Docked One-Thumb Remote Bar for Mobile Phones */}
      <OneThumbRemoteBar
        activeRoom={activeRoom}
        onPrev={handlePrev}
        onNext={handleNext}
        onJumpChorus={handleJumpChorus}
        onToggleBlank={handleToggleBlank}
      />

      {/* 5-Tab Bottom Navigation Bar for Mobile Phones */}
      <nav aria-label="Mobile Navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 sm:hidden flex justify-around items-center">
        <button
          onClick={() => setActiveTab('hymns')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition ${
            activeTab === 'hymns' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Music className="w-4 h-4 mb-0.5" />
          <span>Hymns</span>
        </button>

        <button
          onClick={() => setActiveTab('bible')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition ${
            activeTab === 'bible' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>Bible</span>
        </button>

        {/* Center Quick Dial Button */}
        <button
          onClick={() => setIsDialpadOpen(true)}
          className="flex flex-col items-center -mt-4 bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 p-2.5 rounded-full shadow-lg shadow-amber-500/30 active:scale-95 transition"
        >
          <Hash className="w-5 h-5 font-bold" />
        </button>

        <button
          onClick={() => setActiveTab('setlist')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition ${
            activeTab === 'setlist' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-4 h-4 mb-0.5" />
          <span>Setlist</span>
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition ${
            activeTab === 'live' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Radio className="w-4 h-4 mb-0.5" />
          <span>Booth</span>
        </button>
      </nav>

      {/* Quick Dialpad Bottom Sheet / Modal */}
      <QuickDialpadModal
        isOpen={isDialpadOpen}
        onClose={() => setIsDialpadOpen(false)}
        hymns={SEED_HYMNS}
        onSelectHymn={(h, project) => {
          setCurrentHymn(h);
          if (project) {
            handleBroadcastHymnStanza(h, 0, hymnPrimaryLang, hymnSecondaryLang);
            setActiveTab('live');
          } else {
            setActiveTab('hymns');
          }
        }}
        onSelectScripture={() => {
          setActiveTab('bible');
        }}
      />

      {/* Typo / Mistake Report Modal */}
      <ReportTypoModal
        isOpen={!!reportingHymn}
        onClose={() => setReportingHymn(null)}
        hymn={reportingHymn}
      />
    </div>
  );
};
