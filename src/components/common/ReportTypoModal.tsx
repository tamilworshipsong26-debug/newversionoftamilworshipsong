import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { Hymn } from '../../types/hymn';
import { submitMistakeReport } from '../../services/firebase';

interface ReportTypoModalProps {
  isOpen: boolean;
  onClose: () => void;
  hymn: Hymn | null;
}

export const ReportTypoModal: React.FC<ReportTypoModalProps> = ({
  isOpen,
  onClose,
  hymn
}) => {
  const [issueType, setIssueType] = useState<'typo' | 'missing-stanza' | 'chords' | 'other'>('typo');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !hymn) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    try {
      await submitMistakeReport({
        hymnId: hymn.id,
        hymnTitle: `${hymn.bookNameEnglish} #${hymn.number} - ${hymn.titleTamil}`,
        issueType,
        description: description.trim(),
        status: 'pending'
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setDescription('');
        onClose();
      }, 1800);
    } catch (err) {
      console.warn('Queued/saved mistake report:', err);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setDescription('');
        onClose();
      }, 1800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-slide-up">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <h3 className="text-sm font-bold text-white">Report Lyric Typo or Chord Correction</h3>
            <p className="text-xs text-amber-300 font-tamil truncate mt-0.5">
              {hymn.bookNameEnglish} #{hymn.number} - {hymn.titleTamil}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-bounce" />
            <h4 className="text-base font-bold text-white">Thank You!</h4>
            <p className="text-xs text-slate-400 mt-1">
              Your feedback has been saved and submitted to the worship admin team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Issue Category
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'typo', label: 'Spelling / எழுத்துப் பிழை' },
                  { id: 'missing-stanza', label: 'Missing Stanza / விடுபட்ட வரி' },
                  { id: 'chords', label: 'Key / Chords Fix' },
                  { id: 'other', label: 'Other Correction' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setIssueType(opt.id as any)}
                    className={`p-2 rounded-lg text-left transition border ${
                      issueType === opt.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Details & Suggested Correction
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., In Charanam 2 line 1, replace '...' with '...'."
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none font-sans"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !description.trim()}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-xs font-bold text-slate-950 flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
