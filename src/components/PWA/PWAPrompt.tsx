import { useState, useEffect } from 'react';
import { BsDownload, BsX, BsWifi, BsWifiOff } from 'react-icons/bs';
import './PWAPrompt.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const goOffline = () => {
      setIsOffline(true);
      setShowOffline(true);
    };
    const goOnline = () => {
      setIsOffline(false);
      setTimeout(() => setShowOffline(false), 3000);
    };

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
      setInstallPrompt(null);
    }
  }

  function handleDismiss() {
    setShowBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  }

  return (
    <>
      {showBanner && (
        <div className="pwa-install-banner">
          <div className="pwa-banner-content">
            <BsDownload className="pwa-banner-icon" />
            <div className="pwa-banner-text">
              <strong>Install FinAdvisor</strong>
              <span>Add to home screen for quick access</span>
            </div>
          </div>
          <div className="pwa-banner-actions">
            <button className="pwa-install-btn" onClick={handleInstall}>Install</button>
            <button className="pwa-dismiss-btn" onClick={handleDismiss}><BsX size={20} /></button>
          </div>
        </div>
      )}

      {showOffline && (
        <div className={`pwa-offline-toast ${isOffline ? 'offline' : 'online'}`}>
          {isOffline ? (
            <><BsWifiOff /> You're offline — chat history is saved locally</>
          ) : (
            <><BsWifi /> Back online</>
          )}
        </div>
      )}
    </>
  );
}
