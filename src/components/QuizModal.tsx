import React, { useState } from 'react';
import { ElementData } from '../types/element';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, RefreshCw, Trophy } from 'lucide-react';
import { getCategoryColor } from '../utils/theme';

export function QuizModal({ 
  elements, 
  onClose 
}: { 
  elements: ElementData[]; 
  onClose: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState<number>(1);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [targetElement, setTargetElement] = useState<ElementData | null>(null);
  const [options, setOptions] = useState<ElementData[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startQuiz = () => {
    setIsPlaying(true);
    setScore(0);
    setCurrentQuestion(0);
    nextQuestion();
  };

  const nextQuestion = () => {
    setFeedback(null);
    const pool = elements.filter(e => e.atomicNumber <= (difficulty * 24)); // scale pool by difficulty
    const target = pool[Math.floor(Math.random() * pool.length)];
    
    const opts = [target];
    while (opts.length < 4) {
      const random = pool[Math.floor(Math.random() * pool.length)];
      if (!opts.find(o => o.atomicNumber === random.atomicNumber)) {
        opts.push(random);
      }
    }
    // Shuffle
    setTargetElement(target);
    setOptions(opts.sort(() => Math.random() - 0.5));
    setCurrentQuestion(prev => prev + 1);
  };

  const handleGuess = (el: ElementData) => {
    if (feedback) return; // Prevent multiple clicks
    
    if (el.atomicNumber === targetElement?.atomicNumber) {
      setFeedback('correct');
      setScore(s => s + difficulty * 10);
    } else {
      setFeedback('wrong');
    }
    
    setTimeout(() => {
      if (currentQuestion < 10) {
        nextQuestion();
      } else {
        setIsPlaying(false);
        setTargetElement(null);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-panel w-full max-w-lg rounded-2xl p-6 relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        {!isPlaying && !targetElement ? (
          <div className="text-center py-8">
            <Trophy size={48} className="mx-auto text-yellow-400 mb-4" />
            <h2 className="text-3xl font-display font-bold mb-2">Element Quiz</h2>
            <p className="text-muted-foreground mb-8">Test your knowledge of the periodic table.</p>
            
            {score > 0 && (
              <div className="mb-8 text-xl">
                Last Score: <span className="font-bold text-primary">{score}</span>
              </div>
            )}

            <div className="mb-8">
              <label className="text-sm font-medium text-muted-foreground block mb-4">Select Difficulty</label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      difficulty === level ? 'bg-primary text-background' : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={startQuiz}
              className="bg-primary text-background px-8 py-3 rounded-full font-bold text-lg hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(79,195,247,0.3)] flex items-center gap-2 mx-auto"
            >
              <Play size={20} fill="currentColor" /> Start Quiz
            </button>
          </div>
        ) : targetElement && (
          <div className="py-4">
            <div className="flex justify-between items-center mb-8">
              <div className="text-muted-foreground font-mono">Question {currentQuestion}/10</div>
              <div className="text-lg font-bold text-primary">Score: {score}</div>
            </div>

            <div className="glass rounded-xl p-8 mb-8 text-center border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
              <h3 className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">Which element has these properties?</h3>
              <div className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto">
                <div className="glass p-3 rounded-lg"><span className="text-xs text-muted-foreground block">Atomic Mass</span> {targetElement.atomicMass}</div>
                <div className="glass p-3 rounded-lg"><span className="text-xs text-muted-foreground block">Group</span> {targetElement.group || '-'}</div>
                <div className="glass p-3 rounded-lg"><span className="text-xs text-muted-foreground block">Period</span> {targetElement.period}</div>
                <div className="glass p-3 rounded-lg"><span className="text-xs text-muted-foreground block">State at STP</span> {targetElement.stateAtSTP}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {options.map((opt, i) => {
                let statusClass = 'border-white/10 hover:border-primary/50 hover:bg-white/5';
                if (feedback && opt.atomicNumber === targetElement.atomicNumber) {
                  statusClass = 'border-emerald-500 bg-emerald-500/20 text-emerald-400';
                } else if (feedback === 'wrong') {
                  statusClass = 'border-white/5 opacity-50 grayscale';
                }

                return (
                  <button
                    key={i}
                    disabled={feedback !== null}
                    onClick={() => handleGuess(opt)}
                    className={`glass p-4 rounded-xl flex items-center gap-4 transition-all duration-300 border ${statusClass}`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center font-display font-bold text-xl" style={{ color: getCategoryColor(opt.category) }}>
                      {opt.symbol}
                    </div>
                    <div className="text-left">
                      <div className="font-bold">{opt.name}</div>
                      <div className="text-xs text-muted-foreground">{opt.atomicNumber}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`absolute inset-x-0 bottom-0 p-4 text-center font-bold text-lg backdrop-blur-xl ${
                    feedback === 'correct' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                  }`}
                >
                  {feedback === 'correct' ? 'Correct! +10 Points' : `Incorrect. It was ${targetElement.name}`}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
