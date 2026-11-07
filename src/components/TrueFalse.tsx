import { useState } from 'react';
import type { TrueFalseTask } from '../content';

interface TrueFalseProps {
  task: TrueFalseTask;
  onAnswer: (isCorrect: boolean) => void;
}

export function TrueFalse({ task, onAnswer }: TrueFalseProps) {
  const [selected, setSelected] = useState<boolean | null>(null);

  const handleSelect = (value: boolean) => {
    if (selected !== null) return; // Блокируем повторные нажатия
    setSelected(value);
    const isCorrect = value === task.isTrue;
    setTimeout(() => onAnswer(isCorrect), 300); // Небольшая задержка для анимации
  };

  const isCorrect = selected === task.isTrue;

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <h3 className="text-xl font-bold text-center text-slate-100">{task.statement}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleSelect(true)}
          disabled={selected !== null}
          className={`p-4 rounded-2xl font-bold text-lg transition-all transform active:scale-95
            ${selected === null ? 'bg-slate-800 text-sky-400 border-2 border-slate-700 hover:border-sky-500' : ''}
            ${selected === true && isCorrect ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500' : ''}
            ${selected === true && !isCorrect ? 'bg-red-500/20 text-red-400 border-2 border-red-500' : ''}
            ${selected === false && isCorrect ? 'bg-slate-800 text-slate-500 border-2 border-slate-700 opacity-50' : ''}
            ${selected === false && !isCorrect ? 'bg-slate-800 text-slate-500 border-2 border-slate-700 opacity-50' : ''}
          `}
        >
          ✅ Верно
        </button>
        <button
          onClick={() => handleSelect(false)}
          disabled={selected !== null}
          className={`p-4 rounded-2xl font-bold text-lg transition-all transform active:scale-95
            ${selected === null ? 'bg-slate-800 text-amber-400 border-2 border-slate-700 hover:border-amber-500' : ''}
            ${selected === false && isCorrect ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500' : ''}
            ${selected === false && !isCorrect ? 'bg-red-500/20 text-red-400 border-2 border-red-500' : ''}
            ${selected === true && isCorrect ? 'bg-slate-800 text-slate-500 border-2 border-slate-700 opacity-50' : ''}
            ${selected === true && !isCorrect ? 'bg-slate-800 text-slate-500 border-2 border-slate-700 opacity-50' : ''}
          `}
        >
          ❌ Неверно
        </button>
      </div>

      {selected !== null && (
        <div className={`p-4 rounded-xl mt-2 ${isCorrect ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
          <p className="font-semibold">{isCorrect ? task.feedbackCorrect : task.feedbackWrong}</p>
        </div>
      )}
    </div>
  );
}