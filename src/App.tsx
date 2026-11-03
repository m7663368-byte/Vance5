import React, { useState } from 'react';
import { AndroidSimulator } from './components/AndroidSimulator';
import { CodeViewer } from './components/CodeViewer';
import { BuildGuide } from './components/BuildGuide';
import { PerformanceComparison } from './components/PerformanceComparison';
import { exportProjectZip } from './utils/zipExporter';
import {
  Smartphone,
  Code2,
  Hammer,
  BarChart3,
  Download,
  FolderArchive,
  Play,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  Github
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'build' | 'perf'>('simulator');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportZip = async () => {
    try {
      setIsExporting(true);
      await exportProjectZip();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 flex flex-col font-sans selection:bg-rose-900 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0d1017]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-rose-900/30">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white text-base tracking-tight">YouTube Lite Studio</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                  Android 5.0+ (API 21)
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300">
                  targetSdk 33
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Mã nguồn hoàn chỉnh & Trình giả lập WebView tối ưu cho thiết bị cấu hình thấp
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportZip}
              disabled={isExporting}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-lg shadow-rose-950/60 flex items-center gap-2 transition-all cursor-pointer"
            >
              <FolderArchive className="w-4 h-4" />
              <span className="hidden sm:inline">{isExporting ? 'Đang nén...' : 'Tải mã nguồn (.ZIP)'}</span>
              <span className="sm:hidden">ZIP</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-t border-slate-800/50">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-3 px-3.5 text-xs font-medium flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'simulator'
                ? 'border-rose-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Trình giả lập & Trải nghiệm
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-3.5 text-xs font-medium flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'code'
                ? 'border-rose-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Mã nguồn dự án (Code Viewer)
          </button>

          <button
            onClick={() => setActiveTab('build')}
            className={`py-3 px-3.5 text-xs font-medium flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'build'
                ? 'border-rose-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Hammer className="w-4 h-4" />
            Hướng dẫn Build APK & Cài đặt
          </button>

          <button
            onClick={() => setActiveTab('perf')}
            className={`py-3 px-3.5 text-xs font-medium flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'perf'
                ? 'border-rose-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            So sánh hiệu năng & Tối ưu
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'simulator' && <AndroidSimulator />}
        {activeTab === 'code' && <CodeViewer />}
        {activeTab === 'build' && <BuildGuide />}
        {activeTab === 'perf' && <PerformanceComparison />}
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0c10] border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 YouTube Lite for Android 5.0+ (Lollipop API 21). Tương thích Java 8 / Kotlin & Gradle 7.4+.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Chặn quảng cáo tầng mạng
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Tăng tốc GPU Hardware
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
