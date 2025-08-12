import { useState, useEffect } from 'react';

interface PlatformInfo {
  isMobile: boolean;
  isDesktop: boolean;
  isElectron: boolean;
  isPWA: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  isWindows: boolean;
  isMacOS: boolean;
  isLinux: boolean;
  platform: 'mobile' | 'desktop' | 'web';
  deviceType: 'phone' | 'tablet' | 'desktop';
  capabilities: {
    notifications: boolean;
    offline: boolean;
    camera: boolean;
    geolocation: boolean;
    fileSystem: boolean;
    haptics: boolean;
  };
}

export const usePlatform = (): PlatformInfo => {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    isMobile: false,
    isDesktop: false,
    isElectron: false,
    isPWA: false,
    isAndroid: false,
    isIOS: false,
    isWindows: false,
    isMacOS: false,
    isLinux: false,
    platform: 'web',
    deviceType: 'desktop',
    capabilities: {
      notifications: false,
      offline: false,
      camera: false,
      geolocation: false,
      fileSystem: false,
      haptics: false
    }
  });

  useEffect(() => {
    const detectPlatform = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isElectron = !!(window as any).electronAPI;
      const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                    (window.navigator as any).standalone === true;
      
      // Mobile detection
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isAndroid = /android/i.test(userAgent);
      const isIOS = /iphone|ipad|ipod/i.test(userAgent);
      
      // Desktop OS detection
      const isWindows = /windows/i.test(userAgent);
      const isMacOS = /macintosh|mac os x/i.test(userAgent);
      const isLinux = /linux/i.test(userAgent) && !isAndroid;
      
      // Device type detection
      const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent);
      let deviceType: 'phone' | 'tablet' | 'desktop' = 'desktop';
      
      if (isMobile && !isTablet) {
        deviceType = 'phone';
      } else if (isTablet) {
        deviceType = 'tablet';
      }
      
      // Platform categorization
      let platform: 'mobile' | 'desktop' | 'web' = 'web';
      if (isElectron) {
        platform = 'desktop';
      } else if (isMobile || isPWA) {
        platform = 'mobile';
      }
      
      // Capability detection
      const capabilities = {
        notifications: 'Notification' in window && Notification.permission !== 'denied',
        offline: 'serviceWorker' in navigator,
        camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
        geolocation: 'geolocation' in navigator,
        fileSystem: isElectron || 'showOpenFilePicker' in window,
        haptics: 'vibrate' in navigator || !!(window as any).DeviceMotionEvent
      };

      setPlatformInfo({
        isMobile,
        isDesktop: !isMobile || isElectron,
        isElectron,
        isPWA,
        isAndroid,
        isIOS,
        isWindows,
        isMacOS,
        isLinux,
        platform,
        deviceType,
        capabilities
      });
    };

    detectPlatform();

    // Listen for PWA installation
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPlatformInfo(prev => ({ ...prev, isPWA: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return platformInfo;
};

// Platform-specific utilities
export const platformUtils = {
  // Contact methods based on platform
  getContactMethod: (platform: PlatformInfo) => {
    if (platform.isMobile) {
      return {
        phone: 'tel:+919363717744',
        whatsapp: 'https://wa.me/919363717744',
        email: 'mailto:glow24@gmail.com'
      };
    } else {
      return {
        phone: '+91 93637 17744',
        whatsapp: 'https://wa.me/919363717744',
        email: 'glow24@gmail.com'
      };
    }
  },

  // Get appropriate app store link
  getAppStoreLink: (platform: PlatformInfo) => {
    if (platform.isAndroid) {
      return 'https://play.google.com/store/apps/details?id=com.glow24organics.app';
    } else if (platform.isIOS) {
      return 'https://apps.apple.com/app/glow24-organics/id123456789';
    }
    return null;
  },

  // Check if feature is available
  hasFeature: (platform: PlatformInfo, feature: keyof PlatformInfo['capabilities']) => {
    return platform.capabilities[feature];
  },

  // Get platform-specific styling
  getPlatformStyles: (platform: PlatformInfo) => {
    return {
      padding: platform.isMobile ? 'p-4' : 'p-6',
      fontSize: platform.isMobile ? 'text-sm' : 'text-base',
      spacing: platform.isMobile ? 'space-y-4' : 'space-y-6',
      buttonSize: platform.isMobile ? 'py-3 px-6' : 'py-2 px-4'
    };
  }
};
