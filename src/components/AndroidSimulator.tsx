import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  ShieldCheck,
  ShieldAlert,
  Search,
  Wifi,
  BatteryCharging,
  ArrowLeft,
  Volume2,
  VolumeX,
  Share2,
  ThumbsUp,
  Cpu,
  Globe,
  Radio,
  CheckCircle2,
  Terminal,
  Layers,
  Smartphone,
  Eye,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { isAdUrl, generateAdBlockingCss } from '../utils/adBlockerLogic';

interface VideoItem {
  id: string;
  title: string;
  channel: string;
  views: string;
  time: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  hasAd: boolean;
}

const SAMPLE_VIDEOS: VideoItem[] = [
  {
    id: 'vid1',
    title: 'Khám phá Android 5.0 Lollipop: Cuộc cách mạng Material Design của Google',
    channel: 'Công Nghệ Số VN',
    views: '245K lượt xem',
    time: '2 ngày trước',
    duration: '14:20',
    thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    hasAd: true,
  },
  {
    id: 'vid2',
    title: 'Hướng dẫn tối ưu hóa Android WebView trên các thiết bị RAM 1GB',
    channel: 'Lập Trình Di Động',
    views: '118K lượt xem',
    time: '1 tuần trước',
    duration: '09:45',
    thumbnail: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    hasAd: true,
  },
  {
    id: 'vid3',
    title: 'Nhạc Acoustic Nhẹ Nhàng Thư Giãn Học Tập & Làm Việc Cực Mượt',
    channel: 'Chill & Relax Music',
    views: '1.2M lượt xem',
    time: '3 tuần trước',
    duration: '45:10',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    hasAd: false,
  },
  {
    id: 'vid4',
    title: 'Top 5 mẹo hồi sinh điện thoại Android cũ chạy mượt như máy mới',
    channel: 'Tech Hồi Sinh',
    views: '89K lượt xem',
    time: '1 tháng trước',
    duration: '11:15',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    hasAd: true,
  },
];

interface LogEntry {
  id: string;
  type: 'intercept' | 'inject' | 'nav' | 'video' | 'back';
  message: string;
  timestamp: string;
}

export function AndroidSimulator() {
  const [currentUrl, setCurrentUrl] = useState('https://m.youtube.com');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [adBlockEnabled, setAdBlockEnabled] = useState(true);
  const [adSkipCount, setAdSkipCount] = useState(3);
  const [blockedRequestsCount, setBlockedRequestsCount] = useState(14);
  const [deviceFrame, setDeviceFrame] = useState<'lollipop' | 'modern'>('lollipop');
  const [userAgentMode, setUserAgentMode] = useState<'standard' | 'lightweight'>('lightweight');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastBackPressTime, setLastBackPressTime] = useState<number>(0);
  const [isAppExited, setIsAppExited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      type: 'nav',
      message: 'WebView khởi tạo: JavaScript=ON, DomStorage=ON, Database=ON',
      timestamp: '00:00:01',
    },
    {
      id: '2',
      type: 'intercept',
      message: '[BLOCKED] googleads.g.doubleclick.net/pagead/id (200 Empty Response)',
      timestamp: '00:00:02',
    },
    {
      id: '3',
      type: 'inject',
      message: 'Tiêm CSS ẩn banner (.ad-container, ytm-promoted-sparkles-web-renderer)',
      timestamp: '00:00:03',
    },
  ]);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const addLog = (type: LogEntry['type'], message: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setLogs(prev => [{ id: Math.random().toString(), type, message, timestamp: timeStr }, ...prev.slice(0, 49)]);
  };

  const showAndroidToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  // Simulating the exact onBackPressed() method of MainActivity.java
  const handleHardwareBackButton = () => {
    addLog('back', 'Nút Back cứng được nhấn -> MainActivity.onBackPressed()');

    // 1. If in Fullscreen custom view -> exit custom view first
    if (isFullscreen) {
      setIsFullscreen(false);
      addLog('video', 'Thoát chế độ Fullscreen về chế độ xoay dọc thông thường');
      return;
    }

    // 2. If watching a video in WebView -> go back to feed
    if (selectedVideo) {
      setSelectedVideo(null);
      setCurrentUrl('https://m.youtube.com');
      setIsPlaying(false);
      addLog('nav', 'webView.canGoBack() = true -> webView.goBack() trở về danh sách video');
      return;
    }

    // 3. If searching -> clear search
    if (searchQuery) {
      setSearchQuery('');
      addLog('nav', 'Xóa tìm kiếm, quay lại trang chủ');
      return;
    }

    // 4. If at home page -> double back to exit
    const now = Date.now();
    if (now - lastBackPressTime < 2000) {
      setIsAppExited(true);
      addLog('back', 'Đã nhấn Back 2 lần liên tiếp -> Thoát ứng dụng (finish())');
    } else {
      setLastBackPressTime(now);
      showAndroidToast('Nhấn lần nữa để thoát');
      addLog('back', 'Hiển thị Toast: "Nhấn lần nữa để thoát" (Yêu cầu nhấn lần 2 trong 2s)');
    }
  };

  const handleSelectVideo = (video: VideoItem) => {
    setIsLoading(true);
    setSelectedVideo(video);
    setCurrentUrl(`https://m.youtube.com/watch?v=${video.id}`);
    setIsPlaying(true);
    addLog('nav', `shouldOverrideUrlLoading: Mở nội bộ video [${video.title}] trong WebView`);

    if (adBlockEnabled) {
      setTimeout(() => {
        addLog('intercept', '[BLOCKED] securepubads.g.doubleclick.net/gampad/ads');
        addLog('inject', 'Tự động phát hiện và kích hoạt Skip Ad Button (.ytp-ad-skip-button)');
        setBlockedRequestsCount(prev => prev + 2);
        setAdSkipCount(prev => prev + 1);
      }, 500);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  const handleReload = () => {
    setIsLoading(true);
    addLog('nav', 'SwipeRefresh / Reload: webView.reload()');
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const filteredVideos = SAMPLE_VIDEOS.filter(v =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.channel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: The Interactive Android Phone Frame */}
      <div className="lg:col-span-7 flex flex-col items-center">
        {/* Controls above simulator */}
        <div className="w-full max-w-[420px] flex items-center justify-between mb-3 text-xs text-slate-300 bg-slate-900/80 backdrop-blur p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-rose-500" />
            <span className="font-semibold text-white">Khung thiết bị:</span>
            <button
              onClick={() => setDeviceFrame('lollipop')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                deviceFrame === 'lollipop' ? 'bg-rose-600 text-white font-medium' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Android 5.0 (Lollipop)
            </button>
            <button
              onClick={() => setDeviceFrame('modern')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                deviceFrame === 'modern' ? 'bg-rose-600 text-white font-medium' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Hiện đại
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] text-emerald-400 font-mono">60 FPS</span>
          </div>
        </div>

        {/* DEVICE FRAME */}
        <div
          className={`relative transition-all duration-300 select-none shadow-2xl ${
            deviceFrame === 'lollipop'
              ? 'w-[360px] bg-[#1a1a1a] rounded-[42px] p-3.5 border-4 border-[#333333] shadow-black/80 ring-1 ring-white/10'
              : 'w-[380px] bg-black rounded-[48px] p-3 border-4 border-slate-700 shadow-cyan-950/20'
          }`}
        >
          {/* Top Hardware Bezel (Earpiece speaker & selfie camera for Lollipop) */}
          {deviceFrame === 'lollipop' && (
            <div className="flex items-center justify-center gap-4 py-1.5 mb-1">
              <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-950"></div>
              </div>
              <div className="w-16 h-1.5 rounded-full bg-slate-700 border border-slate-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-800"></div>
            </div>
          )}

          {/* Device Screen Area */}
          <div className="relative w-full h-[640px] bg-[#0F0F0F] rounded-[28px] overflow-hidden flex flex-col border border-slate-900 shadow-inner">
            {/* ANDROID STATUS BAR (Classic Material Lollipop) */}
            <div className="h-6 bg-[#000000] px-3 flex items-center justify-between text-[11px] font-sans text-white/90 z-30">
              <span className="font-medium tracking-tight">12:30</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-white/70 font-mono">H+</span>
                <Wifi className="w-3.5 h-3.5 text-white/90" />
                <BatteryCharging className="w-3.5 h-3.5 text-white/90" />
              </div>
            </div>

            {/* APP CONTENT / WEBVIEW */}
            {isAppExited ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#121212]">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-3">
                  <Smartphone className="w-8 h-8 text-slate-500" />
                </div>
                <h4 className="text-white font-semibold text-base mb-1">Ứng dụng đã đóng</h4>
                <p className="text-slate-400 text-xs mb-5">
                  Bạn vừa nhấn nút Back 2 lần liên tiếp nên ứng dụng đã gọi <code className="text-rose-400 font-mono">finish()</code>.
                </p>
                <button
                  onClick={() => setIsAppExited(false)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-full shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Mở lại YouTube Lite
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Thin Red Loading Bar (WebChromeClient onProgressChanged) */}
                {isLoading && (
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-red-600 z-50 animate-pulse"></div>
                )}

                {/* Simulated URL Navigation Bar */}
                <div className="bg-[#181818] px-2.5 py-1.5 flex items-center gap-2 border-b border-[#282828] z-20">
                  <div className="flex-1 flex items-center gap-1.5 bg-[#0F0F0F] px-2.5 py-1 rounded-md text-[11px] text-slate-300 font-mono border border-slate-800">
                    <Globe className="w-3 h-3 text-emerald-400" />
                    <span className="truncate">{currentUrl}</span>
                  </div>
                  <button
                    onClick={handleReload}
                    aria-label="Tải lại trang"
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* YouTube Lite App Header (m.youtube.com banner) */}
                <div className="bg-[#0F0F0F] px-3 py-2 flex items-center justify-between border-b border-[#222222]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-4.5 bg-red-600 rounded flex items-center justify-center">
                      <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                    </div>
                    <span className="text-white font-bold text-sm tracking-tight">YouTube</span>
                    <span className="text-[10px] text-rose-400 font-semibold uppercase bg-rose-950/60 px-1 py-0.2 rounded border border-rose-800/40">Lite</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Search Input Toggle */}
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm..."
                        className="w-32 bg-[#222222] text-white text-xs pl-7 pr-2 py-1 rounded-full outline-none focus:ring-1 focus:ring-rose-500 placeholder-slate-500"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1.5" />
                    </div>
                  </div>
                </div>

                {/* MAIN WEBVIEW VIEWPORT */}
                <div className="flex-1 overflow-y-auto bg-[#0F0F0F] relative">
                  {selectedVideo ? (
                    /* VIDEO WATCH VIEW */
                    <div className="flex flex-col">
                      {/* Video Player */}
                      <div className={`relative bg-black ${isFullscreen ? 'fixed inset-0 z-50 flex items-center justify-center' : 'w-full aspect-video'}`}>
                        <video
                          ref={videoRef}
                          src={selectedVideo.videoUrl}
                          className="w-full h-full object-contain"
                          controls={false}
                          autoPlay
                          loop
                          muted={isMuted}
                          playsInline
                        />

                        {/* Custom In-Player Controls */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-3 opacity-95 hover:opacity-100 transition-opacity">
                          {/* Top controls */}
                          <div className="flex items-center justify-between text-white">
                            <button
                              onClick={() => {
                                setSelectedVideo(null);
                                setCurrentUrl('https://m.youtube.com');
                              }}
                              className="p-1 rounded-full bg-black/50 hover:bg-black/80 text-white"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-2 text-xs">
                              {adBlockEnabled && (
                                <span className="bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                  Đã lọc quảng cáo
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Center Play/Pause */}
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => {
                                if (videoRef.current) {
                                  if (isPlaying) videoRef.current.pause();
                                  else videoRef.current.play();
                                  setIsPlaying(!isPlaying);
                                }
                              }}
                              className="w-10 h-10 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                            >
                              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                            </button>
                          </div>

                          {/* Bottom controls */}
                          <div className="flex items-center justify-between text-white text-xs">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="p-1 text-slate-300 hover:text-white"
                              >
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                              </button>
                              <span className="text-[11px] font-mono text-slate-300">01:24 / {selectedVideo.duration}</span>
                            </div>

                            <button
                              onClick={() => {
                                setIsFullscreen(!isFullscreen);
                                addLog('video', `WebChromeClient: onShowCustomView() -> Fullscreen=${!isFullscreen}`);
                              }}
                              className="p-1 text-slate-300 hover:text-white"
                              title="Toàn màn hình (WebChromeClient)"
                            >
                              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Video Details */}
                      <div className="p-3">
                        <h3 className="text-white font-medium text-xs leading-snug mb-1">
                          {selectedVideo.title}
                        </h3>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-[#222]">
                          <span>{selectedVideo.views} • {selectedVideo.time}</span>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 hover:text-white cursor-pointer"><ThumbsUp className="w-3 h-3" /> 12K</span>
                            <span className="flex items-center gap-1 hover:text-white cursor-pointer"><Share2 className="w-3 h-3" /> Chia sẻ</span>
                          </div>
                        </div>

                        {/* Channel Bar */}
                        <div className="flex items-center justify-between py-2.5 border-b border-[#222]">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
                              {selectedVideo.channel[0]}
                            </div>
                            <div>
                              <p className="text-white text-xs font-medium">{selectedVideo.channel}</p>
                              <p className="text-[10px] text-slate-400">142K người đăng ký</p>
                            </div>
                          </div>
                          <button className="bg-white text-black font-semibold text-[11px] px-3 py-1 rounded-full hover:bg-slate-200">
                            Đăng ký
                          </button>
                        </div>

                        {/* SIMULATED AD BANNER (Visible only if AdBlock is disabled) */}
                        {!adBlockEnabled && selectedVideo.hasAd && (
                          <div className="mt-2.5 p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 flex items-start gap-2.5 animate-pulse">
                            <div className="w-6 h-6 rounded bg-amber-600 flex items-center justify-center text-black font-bold text-[10px]">
                              QC
                            </div>
                            <div className="flex-1">
                              <p className="text-amber-200 font-semibold text-[11px]">Mua sắm online giảm giá 50% hôm nay</p>
                              <p className="text-amber-400/80 text-[10px]">Tài trợ bởi Shopee Ad Network • m.youtube.com/ads</p>
                            </div>
                          </div>
                        )}

                        {/* Related Videos List */}
                        <div className="mt-3 space-y-2.5">
                          <p className="text-white text-xs font-semibold">Video liên quan</p>
                          {SAMPLE_VIDEOS.filter(v => v.id !== selectedVideo.id).map(relVid => (
                            <div
                              key={relVid.id}
                              onClick={() => handleSelectVideo(relVid)}
                              className="flex gap-2.5 cursor-pointer group"
                            >
                              <div className="relative w-28 h-16 rounded-md overflow-hidden bg-slate-800 flex-shrink-0">
                                <img src={relVid.thumbnail} alt={relVid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1 rounded font-mono">{relVid.duration}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-[11px] font-medium line-clamp-2 leading-tight group-hover:text-rose-400">{relVid.title}</p>
                                <p className="text-slate-400 text-[10px] mt-0.5 truncate">{relVid.channel}</p>
                                <p className="text-slate-500 text-[9px]">{relVid.views}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* FEED VIEW (m.youtube.com home) */
                    <div className="p-2 space-y-3">
                      {/* Category Pills */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                        {['Tất cả', 'Âm nhạc', 'Lập trình', 'Tin tức', 'Trò chơi'].map(cat => (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                              activeCategory === cat ? 'bg-white text-black font-semibold' : 'bg-[#222] text-slate-300 hover:bg-[#333]'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Video Cards */}
                      {filteredVideos.map(video => (
                        <div
                          key={video.id}
                          onClick={() => handleSelectVideo(video)}
                          className="bg-[#141414] rounded-lg overflow-hidden border border-[#222] hover:border-slate-700 cursor-pointer transition-all active:scale-[0.99]"
                        >
                          {/* Thumbnail */}
                          <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                            <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-medium">
                              {video.duration}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="p-2.5 flex gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {video.channel[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white text-xs font-medium line-clamp-2 leading-snug">
                                {video.title}
                              </h4>
                              <p className="text-slate-400 text-[10px] mt-0.5">{video.channel} • {video.views}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ANDROID TOAST NOTIFICATION OVERLAY */}
                {toastMessage && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#2a2a2a]/95 text-white text-xs px-4 py-1.5 rounded-full shadow-2xl border border-slate-600/50 backdrop-blur z-50 animate-bounce">
                    {toastMessage}
                  </div>
                )}
              </div>
            )}

            {/* ANDROID THREE-BUTTON NAVIGATION BAR (Lollipop Software Keys) */}
            <div className="h-11 bg-black flex items-center justify-around px-8 border-t border-slate-900 z-30">
              {/* Back Button (Triangle pointing left) */}
              <button
                onClick={handleHardwareBackButton}
                title="Nút Back cứng (MainActivity.onBackPressed)"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20 transition-colors group"
              >
                <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[10px] border-r-slate-300 group-hover:border-r-white transition-colors"></div>
              </button>

              {/* Home Button (Circle) */}
              <button
                onClick={() => {
                  setSelectedVideo(null);
                  setCurrentUrl('https://m.youtube.com');
                  setSearchQuery('');
                  setIsAppExited(false);
                  addLog('nav', 'Nút Home: Quay lại trang chủ m.youtube.com');
                }}
                title="Nút Home (Trang chủ)"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
              >
                <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 hover:border-white transition-colors"></div>
              </button>

              {/* Recents Button (Square) */}
              <button
                onClick={() => {
                  showAndroidToast('Tác vụ gần đây (Recent Apps)');
                  addLog('nav', 'Recent Apps: Danh sách ứng dụng chạy ngầm');
                }}
                title="Nút Recents (Đa nhiệm)"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
              >
                <div className="w-3 h-3 rounded-[2px] border-2 border-slate-300 hover:border-white transition-colors"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Caption below phone */}
        <p className="mt-3 text-xs text-slate-400 text-center max-w-sm">
          💡 <strong>Mẹo thử nghiệm:</strong> Nhấn nút hình tam giác <span className="font-mono font-bold">◂ (Back)</span> ở dưới đáy máy để kiểm tra tính năng lùi trang hoặc nhấn 2 lần để kích hoạt thông báo thoát app.
        </p>
      </div>

      {/* RIGHT COLUMN: Live Technical Inspector & Controls */}
      <div className="lg:col-span-5 space-y-4">
        {/* Performance & Features Dashboard */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Chỉ số tối ưu Android 5.0</h3>
                <p className="text-slate-400 text-xs">Cấu hình tiêu thụ tài nguyên thực tế</p>
              </div>
            </div>
            <span className="text-[11px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
              API 21 Ready
            </span>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">RAM Tiêu thụ (Lite)</span>
              <span className="text-emerald-400 font-bold font-mono text-base">~85 MB</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Tiết kiệm 80% so với app gốc</span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Dung lượng APK build</span>
              <span className="text-cyan-400 font-bold font-mono text-base">~1.8 MB</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Bật ProGuard + R8 minification</span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Quảng cáo bị chặn</span>
              <span className="text-amber-400 font-bold font-mono text-base">{blockedRequestsCount} requests</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">shouldInterceptRequest</span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Video Ads Skip tự động</span>
              <span className="text-rose-400 font-bold font-mono text-base">{adSkipCount} lượt</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Tiêm JS loop 500ms</span>
            </div>
          </div>

          {/* Interactive Feature Toggles */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <h4 className="text-white text-xs font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-rose-400" />
              Tùy chỉnh tính năng WebView
            </h4>

            {/* Adblock switch */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2">
                {adBlockEnabled ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                )}
                <div>
                  <p className="text-white text-xs font-medium">Chặn quảng cáo (AdBlock)</p>
                  <p className="text-slate-400 text-[10px]">Chặn request mạng & ẩn banner CSS</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAdBlockEnabled(!adBlockEnabled);
                  addLog('inject', `Bộ lọc quảng cáo đã ${!adBlockEnabled ? 'BẬT' : 'TẮT'}`);
                }}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  adBlockEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
              </button>
            </div>

            {/* User-Agent Switch */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-white text-xs font-medium">User-Agent</p>
                  <p className="text-slate-400 text-[10px]">
                    {userAgentMode === 'lightweight' ? 'Mobile Light (Lollipop 5.0)' : 'Chrome Mobile Hiện đại'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const next = userAgentMode === 'lightweight' ? 'standard' : 'lightweight';
                  setUserAgentMode(next);
                  addLog('nav', `Đổi User-Agent thành: ${next}`);
                }}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
              >
                Chuyển đổi
              </button>
            </div>
          </div>
        </div>

        {/* Live WebView Logs Inspector */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col h-[280px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-white">Log WebView Realtime (Logcat)</span>
            </div>
            <button
              onClick={() => setLogs([])}
              className="text-[10px] text-slate-400 hover:text-white"
            >
              Xóa log
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[11px] pr-1">
            {logs.map(log => (
              <div
                key={log.id}
                className={`p-1.5 rounded border leading-tight ${
                  log.type === 'intercept'
                    ? 'bg-rose-950/30 border-rose-900/40 text-rose-300'
                    : log.type === 'inject'
                    ? 'bg-amber-950/30 border-amber-900/40 text-amber-300'
                    : log.type === 'video'
                    ? 'bg-cyan-950/30 border-cyan-900/40 text-cyan-300'
                    : log.type === 'back'
                    ? 'bg-purple-950/30 border-purple-900/40 text-purple-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-70 mb-0.5">
                  <span className="uppercase font-bold tracking-wider">{log.type}</span>
                  <span>{log.timestamp}</span>
                </div>
                <div>{log.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
