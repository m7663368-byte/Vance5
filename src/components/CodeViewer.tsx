import React, { useState } from 'react';
import { ANDROID_PROJECT_FILES, ProjectFile } from '../data/androidProjectFiles';
import {
  Copy,
  Check,
  Download,
  FileCode,
  FolderArchive,
  Search,
  ExternalLink,
  Code2,
  FileText,
  Boxes
} from 'lucide-react';
import { exportProjectZip } from '../utils/zipExporter';

export function CodeViewer() {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(
    ANDROID_PROJECT_FILES.find(f => f.path.endsWith('MainActivity.java')) || ANDROID_PROJECT_FILES[0]
  );
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.path.split('/').pop() || 'file.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportZip = async () => {
    try {
      setIsExporting(true);
      await exportProjectZip();
    } catch (err) {
      console.error('Lỗi khi xuất ZIP:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredFiles = ANDROID_PROJECT_FILES.filter(
    f => f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Top Banner with Project Download CTA */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 p-5 rounded-2xl border border-rose-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-600 text-white uppercase tracking-wider">
              Mã nguồn chuẩn Android 5.0+
            </span>
            <span className="text-slate-400 text-xs">minSdk 21 • targetSdk 33</span>
          </div>
          <h3 className="text-white font-bold text-lg">Trọn bộ tệp mã nguồn dự án Android Studio</h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Bao gồm cả phiên bản Java và Kotlin, tệp cấu hình ProGuard, Manifest và Layout toàn màn hình.
          </p>
        </div>

        <button
          onClick={handleExportZip}
          disabled={isExporting}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-rose-950/50 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
        >
          <FolderArchive className="w-4 h-4" />
          {isExporting ? 'Đang tạo tệp ZIP...' : 'Tải trọn bộ dự án (.ZIP)'}
        </button>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* File List Navigation (Left Sidebar) */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
              <Boxes className="w-4 h-4 text-rose-400" />
              Cấu trúc thư mục ({ANDROID_PROJECT_FILES.length} tệp)
            </h4>
          </div>

          {/* Search files */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Lọc tệp mã nguồn..."
              className="w-full bg-slate-950 text-white text-xs pl-8 pr-3 py-2 rounded-xl outline-none focus:ring-1 focus:ring-rose-500 placeholder-slate-500 border border-slate-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* File list items */}
          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 border ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-700/60 text-white shadow-sm'
                      : 'bg-slate-950/40 border-slate-900 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <FileCode className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSelected ? 'text-rose-400' : 'text-slate-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-mono text-[11px] truncate ${isSelected ? 'font-semibold text-rose-300' : 'text-slate-200'}`}>
                      {file.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {file.path}
                    </p>
                  </div>
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${
                    file.language === 'java' ? 'bg-amber-950 text-amber-300' :
                    file.language === 'kotlin' ? 'bg-purple-950 text-purple-300' :
                    file.language === 'xml' ? 'bg-emerald-950 text-emerald-300' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {file.language}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content View (Right Window) */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          {/* Header Bar */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-rose-400" />
              <div>
                <p className="text-white text-xs font-mono font-semibold">{selectedFile.path}</p>
                <p className="text-slate-400 text-[11px] mt-0.5">{selectedFile.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
                title="Sao chép toàn bộ mã nguồn"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>

              <button
                onClick={handleDownloadFile}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
                title="Tải tệp này về máy"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải tệp</span>
              </button>
            </div>
          </div>

          {/* Code Viewer with Line Numbers */}
          <div className="relative bg-[#0a0d12] max-h-[580px] overflow-auto text-xs font-mono p-4 text-slate-200 leading-relaxed selection:bg-rose-900 selection:text-white">
            <pre className="overflow-x-auto whitespace-pre">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
