import { useState, useEffect } from 'react';
import { BioConfig } from './types';
import { BackgroundVideo } from './components/BackgroundVideo';
import { BioCard } from './components/BioCard';
import { PreviewScreen } from './components/PreviewScreen';

const DEFAULT_CONFIG: BioConfig = {
  views: 1,
  uid: '9799',
  avatarUrl: '/avatar.png',
  musicAvatarUrl: '/musik.png',
  videoSrc: '/techtok.mp4',
  username: 'UralRedux',
  verified: true,
  friends: {
    left: 'Paskal',
    right: 'Un1x',
  },
  tag: 'FX',
  location: 'kamchatka',
  discordHandle: 'UralRedux#0001',
  activity: {
    username: 'UralRedux',
    platform: 'Project Real',
    songTitle: 'shrekfarm_hub.luau',
    startedAtMinutesAgo: 180,
  },
  trackTitle: 'techtok',
  trackDurationSec: 14,
  tiltStrength: 5,
};

export default function App() {
  const [config, setConfig] = useState<BioConfig>(() => {
    const saved = localStorage.getItem('uralredux_bio_config_v4');
    if (saved) {
      try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  // Preview overlay state
  const [showPreview, setShowPreview] = useState(true);
  const [isPreviewExiting, setIsPreviewExiting] = useState(false);

  // Real visitor counter using server API
  useEffect(() => {
    let visitorId = localStorage.getItem('uralredux_visitor_uuid');
    let isNewVisitor = false;
    if (!visitorId) {
      visitorId = 'vis_' + Math.random().toString(36).substring(2, 11) + Date.now();
      localStorage.setItem('uralredux_visitor_uuid', visitorId);
      isNewVisitor = true;
    }

    // Call server to fetch or increment real views
    const url = `/api/views${isNewVisitor ? '?increment=true' : ''}`;
    fetch(url, {
      headers: {
        'x-visitor-id': visitorId,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data: { views: number }) => {
        if (typeof data.views === 'number' && data.views > 0) {
          setConfig((prev) => ({ ...prev, views: data.views }));
        }
      })
      .catch(() => {
        const localViews = parseInt(localStorage.getItem('uralredux_views') || '1', 10);
        if (isNewVisitor) {
          const next = localViews + 1;
          localStorage.setItem('uralredux_views', next.toString());
          setConfig((prev) => ({ ...prev, views: next }));
        } else {
          setConfig((prev) => ({ ...prev, views: localViews }));
        }
      });
  }, []);

  const handleEnterFromPreview = () => {
    setIsPreviewExiting(true);
    // Unmute and start audio from background video on user interaction
    const videoEl = document.getElementById('bg-video-element') as HTMLVideoElement | null;
    if (videoEl) {
      videoEl.muted = false;
      videoEl.volume = 0.8;
      videoEl.play().catch(() => {});
    }
    setTimeout(() => {
      setShowPreview(false);
      setIsPreviewExiting(false);
    }, 550);
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden p-4">
      {/* Background Video (/techtok.mp4) - frozen / still when splash screen is active */}
      <BackgroundVideo videoSrc={config.videoSrc} isFrozen={showPreview} />

      {/* Initial Preview Screen matching the uploaded image */}
      {showPreview && (
        <PreviewScreen
          onEnter={handleEnterFromPreview}
          isExiting={isPreviewExiting}
        />
      )}

      {/* Central 3D Bio Card */}
      <div 
        className={`z-10 flex flex-col items-center justify-center w-full my-auto transition-opacity duration-700 ${
          showPreview ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <BioCard config={config} isStarted={!showPreview} />
      </div>
    </main>
  );
}
