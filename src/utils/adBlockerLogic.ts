/**
 * Logic for YouTube Lite Ad-blocking and URL filtering
 * Used both in Android WebView shouldInterceptRequest and in the simulator.
 */

export const AD_DOMAINS = [
  'googleads.g.doubleclick.net',
  'pagead2.googlesyndication.com',
  'ad.doubleclick.net',
  'static.doubleclick.net',
  'securepubads.g.doubleclick.net',
  'youtube.com/pagead',
  'youtube.com/api/stats/ads',
  'adservice.google.com',
  'ade.googlesyndication.com',
];

export const AD_CSS_SELECTORS = [
  '.ad-container',
  'ytm-promoted-sparkles-web-renderer',
  'ytd-promoted-video-renderer',
  'ytm-companion-ad-renderer',
  '.video-ads',
  '.ytp-ad-module',
  '.ytp-ad-overlay-container',
  'ytm-promoted-sparkles-text-search-web-renderer',
  '.ad-showing',
  'ytd-action-companion-ad-renderer',
  'ytm-paid-content-overlay-renderer',
];

export function isAdUrl(url: string): boolean {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return AD_DOMAINS.some(domain => lowerUrl.includes(domain));
}

export function isInternalYouTubeUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return (
      host === 'm.youtube.com' ||
      host === 'www.youtube.com' ||
      host === 'youtube.com' ||
      host === 'youtu.be'
    );
  } catch {
    // If relative or basic path
    return url.startsWith('/') || url.includes('youtube.com') || url.includes('youtu.be');
  }
}

export function generateAdBlockingCss(): string {
  return `${AD_CSS_SELECTORS.join(', ')} { display: none !important; opacity: 0 !important; pointer-events: none !important; height: 0 !important; width: 0 !important; min-height: 0 !important; }`;
}

export function generateAdSkippingJs(): string {
  return `(function() {
  function removeAds() {
    // 1. Hide ad elements via injected CSS
    var styleId = 'yt-lite-adblock-style';
    if (!document.getElementById(styleId)) {
      var style = document.createElement('style');
      style.id = styleId;
      style.textContent = '${generateAdBlockingCss()}';
      (document.head || document.documentElement).appendChild(style);
    }

    // 2. Auto-skip video ads
    var skipButtons = document.querySelectorAll('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, button.ytp-ad-skip-button');
    skipButtons.forEach(function(btn) {
      if (btn) btn.click();
    });

    // 3. Fast-forward ad video if playing
    var video = document.querySelector('video');
    var isAdShowing = document.querySelector('.ad-showing, .ad-interrupting');
    if (video && isAdShowing) {
      if (!isNaN(video.duration) && video.duration > 0) {
        video.currentTime = video.duration;
      }
      video.playbackRate = 16.0;
    }
  }

  setInterval(removeAds, 500);
  removeAds();
})();`;
}
