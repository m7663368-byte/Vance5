import React, { useState } from 'react';
import {
  Hammer,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Smartphone,
  Copy,
  Check,
  Zap,
  Info,
  Layers,
  ShieldCheck,
  Download
} from 'lucide-react';

export function BuildGuide() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Crucial Warning for Android 5.0 */}
      <div className="bg-amber-950/40 border-2 border-amber-500/50 rounded-2xl p-5 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-white font-bold text-base flex items-center gap-2">
              LƯU Ý SỐNG CÒN KHI BUILD APK CHO ANDROID 5.0 (LOLLIPOP)
            </h4>
            <p className="text-amber-200/90 text-xs leading-relaxed">
              Android 5.0 (API 21) <strong>bắt buộc phải có chữ ký APK Scheme V1 (JAR Signature)</strong>.
              Nếu bạn chỉ bật V2 hoặc V3 khi tạo Signed APK trong Android Studio, khi cài file APK lên điện thoại Android 5.0 sẽ bị từ chối ngay lập tức với lỗi:
              <code className="mx-1 px-1.5 py-0.5 bg-black/60 rounded text-rose-300 font-mono">INSTALL_PARSE_FAILED_NO_CERTIFICATES</code>.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="bg-black/40 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/30 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                V1 (JAR Signature): BẮT BUỘC BẬT
              </span>
              <span className="bg-black/40 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/30 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                V2 (Full APK Signature): NÊN BẬT ĐI KÈM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* METHOD 1: ANDROID STUDIO GUI (RECOMMENDED) */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center font-bold">
            1
          </div>
          <div>
            <h3 className="text-white font-bold text-base">Cách 1: Sử dụng Android Studio (Khuyên dùng)</h3>
            <p className="text-slate-400 text-xs">Phương pháp trực quan, dễ thao tác và ít lỗi nhất</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Step 1 */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px]">A</span>
              Tạo dự án mới
            </div>
            <ul className="text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed text-[11px]">
              <li>Mở Android Studio &rarr; chọn <strong>New Project</strong>.</li>
              <li>Chọn template <strong>Empty Views Activity</strong> (hoặc <em>Empty Activity</em>).</li>
              <li>Đặt tên ứng dụng: <strong>YouTube Lite</strong>.</li>
              <li>Package name: <code className="text-rose-300 font-mono">com.example.youtubelite</code>.</li>
              <li>Language: Chọn <strong>Java</strong> (hoặc Kotlin tùy nhu cầu).</li>
              <li>Minimum SDK: Chọn <strong>API 21: Android 5.0 (Lollipop)</strong>.</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px]">B</span>
              Dán mã nguồn từ dự án
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Chép đè nội dung các tệp tương ứng từ tab <strong>"Mã nguồn dự án"</strong>:
            </p>
            <ul className="text-slate-300 space-y-1 list-disc list-inside text-[11px]">
              <li><code className="text-cyan-300">app/build.gradle</code> (cấu hình minSdk 21 và v1 signing)</li>
              <li><code className="text-cyan-300">app/src/main/AndroidManifest.xml</code> (quyền INTERNET)</li>
              <li><code className="text-cyan-300">res/layout/activity_main.xml</code> (giao diện WebView)</li>
              <li><code className="text-cyan-300">MainActivity.java</code> (logic chặn quảng cáo & Back)</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px]">C</span>
              Đồng bộ Gradle (Sync Project)
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Nhấn vào nút <strong>Sync Now</strong> (hoặc biểu tượng chú voi Gradle ở góc trên bên phải) để Android Studio tự động tải các thư viện AndroidX cơ bản về máy.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px]">D</span>
              Xuất file APK cài đặt
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              <strong>Cách nhanh nhất:</strong> Vào menu <code className="text-white">Build &rarr; Build Bundle(s) / APK(s) &rarr; Build APK(s)</code>.
            </p>
            <p className="text-slate-400 text-[10px]">
              Sau khi build hoàn tất trong khoảng 30 giây, một thông báo màu xanh sẽ hiện lên ở góc dưới kèm chữ <strong>"locate"</strong>. Bấm vào đó để mở thư mục chứa tệp <code className="text-emerald-400 font-mono">app-debug.apk</code>.
            </p>
          </div>
        </div>
      </div>

      {/* METHOD 2: COMMAND LINE (GRADLE CLI) */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <h3 className="text-white font-bold text-base">Cách 2: Build bằng dòng lệnh (Gradle CLI)</h3>
            <p className="text-slate-400 text-xs">Dành cho lập trình viên muốn tự động hóa hoặc dùng Terminal</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          {/* Command 1: assembleDebug */}
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5 text-slate-400 text-[11px]">
              <span>1. Lệnh tạo bản Debug APK:</span>
              <button
                onClick={() => copyToClipboard('./gradlew assembleDebug', 'cmd1')}
                className="hover:text-white flex items-center gap-1 text-[10px]"
              >
                {copiedCmd === 'cmd1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedCmd === 'cmd1' ? 'Đã chép' : 'Sao chép'}
              </button>
            </div>
            <code className="text-cyan-300 font-mono block overflow-x-auto text-xs py-1">
              ./gradlew assembleDebug
            </code>
            <p className="text-slate-500 text-[10px] mt-1">
              Đường dẫn file đầu ra: <code className="text-slate-400">app/build/outputs/apk/debug/app-debug.apk</code>
            </p>
          </div>

          {/* Command 2: assembleRelease */}
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5 text-slate-400 text-[11px]">
              <span>2. Lệnh tạo bản Release (đã tối ưu hóa ProGuard):</span>
              <button
                onClick={() => copyToClipboard('./gradlew assembleRelease', 'cmd2')}
                className="hover:text-white flex items-center gap-1 text-[10px]"
              >
                {copiedCmd === 'cmd2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedCmd === 'cmd2' ? 'Đã chép' : 'Sao chép'}
              </button>
            </div>
            <code className="text-cyan-300 font-mono block overflow-x-auto text-xs py-1">
              ./gradlew assembleRelease
            </code>
          </div>

          {/* Command 3: Signing with apksigner for Android 5.0 */}
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5 text-slate-400 text-[11px]">
              <span>3. Ký APK bằng apksigner (đảm bảo bật v1 và v2 cho Android 5.0):</span>
              <button
                onClick={() => copyToClipboard('apksigner sign --ks release-key.jks --v1-signing-enabled true --v2-signing-enabled true app-release-unsigned.apk', 'cmd3')}
                className="hover:text-white flex items-center gap-1 text-[10px]"
              >
                {copiedCmd === 'cmd3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedCmd === 'cmd3' ? 'Đã chép' : 'Sao chép'}
              </button>
            </div>
            <code className="text-cyan-300 font-mono block overflow-x-auto text-xs py-1">
              apksigner sign --ks release-key.jks --v1-signing-enabled true --v2-signing-enabled true app-release-unsigned.apk
            </code>
          </div>
        </div>
      </div>

      {/* TIPS FOR OPTIMAL ANDROID 5.0 PERFORMANCE */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">Mẹo tối ưu hiệu suất máy Android 5.0 cũ (RAM 512MB - 1GB)</h3>
            <p className="text-slate-400 text-xs">Đảm bảo xem YouTube mượt mà 60fps không bị đứng hình</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              1. Cập nhật Android System WebView
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Hầu hết máy Android 5.0 xuất xưởng có nhân Chromium rất cũ (v37). Bạn nên vào Google Play hoặc tải tệp APK <strong>Android System WebView</strong> (bản khoảng v70 - v80) để cài đè lên máy nhằm hỗ trợ bộ giải mã video VP9 / H.264 mới nhất.
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              2. Bật Hardware Acceleration
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Trong tệp <code className="text-rose-300">AndroidManifest.xml</code>, chúng tôi đã cấu hình <code className="text-cyan-300">android:hardwareAccelerated="true"</code>. Tính năng này ép GPU của chip điện thoại gánh tải render video thay vì vắt kiệt CPU.
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              3. Cho phép cài nguồn ngoài
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Trên điện thoại Android 5.0, hãy vào: <strong>Cài đặt (Settings) &rarr; Bảo mật (Security) &rarr; Bật "Nguồn không xác định" (Unknown sources)</strong> để có thể cài đặt trực tiếp file APK mà không bị hệ điều hành chặn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
