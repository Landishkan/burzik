import { useState, useEffect } from 'react';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Проверяем, не запущено ли уже как PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone || 
                         document.referrer.includes('android-app://');

    if (!isStandalone) {
      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        // Показываем подсказку через 3 секунды после захода на сайт
        setTimeout(() => setShowPrompt(true), 3000);
      };
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt && !deferredPrompt) return null;

  // Для iOS (Safari), где beforeinstallprompt не работает
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-slate-800 border border-sky-500/30 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-sky-400">📱 Установи «Бурзик»</h4>
        <button onClick={() => setShowPrompt(false)} className="text-slate-400 hover:text-slate-200">✕</button>
      </div>
      
      {isIOS ? (
        <p className="text-sm text-slate-300 mb-3">
          Нажми кнопку <strong>«Поделиться»</strong> (квадрат со стрелкой) внизу Safari, а затем выбери <strong>«На экран "Домой"»</strong>.
        </p>
      ) : (
        <p className="text-sm text-slate-300 mb-3">
          Установи приложение на главный экран, чтобы учиться офлайн и без отвлекающих вкладок браузера.
        </p>
      )}

      {!isIOS && deferredPrompt && (
        <button 
          onClick={handleInstall}
          className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-slate-900 font-bold rounded-xl transition-colors"
        >
          Установить приложение
        </button>
      )}
    </div>
  );
}