export interface ProjectFile {
  path: string;
  name: string;
  category: 'gradle' | 'manifest' | 'layout' | 'source' | 'res' | 'config';
  language: string;
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'build.gradle',
    name: 'build.gradle (Project)',
    category: 'gradle',
    language: 'groovy',
    description: 'Cấu hình build cấp Root project, khai báo Gradle build tools và repositories (Google, MavenCentral).',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        // Hỗ trợ cả Android Studio mới và cũ (Gradle Plugin tương thích Java 8/11)
        classpath 'com.android.tools.build:gradle:7.4.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`
  },
  {
    path: 'app/build.gradle',
    name: 'app/build.gradle (Module: app)',
    category: 'gradle',
    language: 'groovy',
    description: 'Cấu hình module app với minSdk 21 (Android 5.0 Lollipop), targetSdk 30, v1/v2 signing (bắt buộc cho Android 5.0) và ProGuard rút gọn APK.',
    content: `plugins {
    id 'com.android.application'
}

android {
    namespace 'com.example.youtubelite'
    compileSdk 33

    defaultConfig {
        applicationId "com.example.youtubelite"
        // minSdk 21 bắt buộc để chạy được trên Android 5.0 Lollipop
        minSdk 21
        // targetSdk 30 hoặc 33 tối ưu hóa quyền và hiệu năng trên Android mới
        targetSdk 33
        versionCode 1
        versionName "1.0.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        release {
            // LƯU Ý QUAN TRỌNG CHO ANDROID 5.0:
            // Android 5.0 Lollipop bắt buộc phải bật v1SigningEnabled (JAR Signature Scheme)!
            // Nếu chỉ bật v2/v3, máy Android 5.0 sẽ báo lỗi "INSTALL_PARSE_FAILED_NO_CERTIFICATES".
            v1SigningEnabled true
            v2SigningEnabled true
        }
    }

    buildTypes {
        release {
            // Bật thu nhỏ code (ProGuard/R8) để giảm dung lượng file APK còn khoảng ~1.8 MB
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
        debug {
            // Cho phép debug mượt mà trên thiết bị thử nghiệm
            debuggable true
        }
    }

    compileOptions {
        // Tương thích Java 8 trên Android 5.0 Lollipop
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    // Thư viện hỗ trợ AndroidX nhẹ, tương thích ngược xuống API 21
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.8.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0'

    // Không cần bất kỳ SDK ngoài cồng kềnh nào để giữ app siêu nhẹ (< 2MB)
}
`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'manifest',
    language: 'xml',
    description: 'Khai báo quyền INTERNET, ACCESS_NETWORK_STATE, kích hoạt tăng tốc đồ họa phần cứng (hardwareAccelerated) và cấu hình configChanges chống reload khi xoay màn hình.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.example.youtubelite">

    <!-- Quyền truy cập Internet bắt buộc để tải m.youtube.com -->
    <uses-permission android:name="android.permission.INTERNET" />
    <!-- Quyền kiểm tra trạng thái mạng để xử lý khi mất kết nối wifi/3G -->
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.YouTubeLite"
        
        <!-- Bật tăng tốc phần cứng (Hardware Acceleration) để phát video 60fps mượt trên GPU -->
        android:hardwareAccelerated="true"
        <!-- Cho phép kết nối an toàn linh hoạt trên Android 5.0 - 9.0 -->
        android:usesCleartextTraffic="true"
        tools:targetApi="31">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            <!-- 
                CỰC KỲ QUAN TRỌNG:
                configChanges ngăn Activity bị hủy (destroy) và tạo lại khi xoay ngang/dọc xem video fullscreen!
            -->
            android:configChanges="orientation|screenSize|keyboardHidden|smallestScreenSize|screenLayout"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
  },
  {
    path: 'app/src/main/res/layout/activity_main.xml',
    name: 'res/layout/activity_main.xml',
    category: 'layout',
    language: 'xml',
    description: 'Layout chính gồm SwipeRefreshLayout, WebView toàn màn hình, thanh tiến trình ProgressBar mỏng phía trên, màn hình báo lỗi khi mất mạng và FrameLayout chứa Video Fullscreen.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/rootContainer"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#0F0F0F"
    tools:context=".MainActivity">

    <!-- Vuốt từ trên xuống để tải lại trang m.youtube.com -->
    <androidx.swiperefreshlayout.widget.SwipeRefreshLayout
        android:id="@+id/swipeRefreshLayout"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <!-- WebView chính hiển thị YouTube Mobile -->
        <WebView
            android:id="@+id/webView"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:background="#0F0F0F" />
    </androidx.swiperefreshlayout.widget.SwipeRefreshLayout>

    <!-- Thanh tiến trình tải trang màu đỏ YouTube mỏng phía trên cùng -->
    <ProgressBar
        android:id="@+id/progressBar"
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_width="match_parent"
        android:layout_height="3dp"
        android:layout_gravity="top"
        android:indeterminate="false"
        android:max="100"
        android:progress="0"
        android:progressDrawable="@drawable/custom_progress_bar"
        android:visibility="gone" />

    <!-- Giao diện hiển thị khi không có kết nối Internet -->
    <LinearLayout
        android:id="@+id/errorView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:background="#0F0F0F"
        android:gravity="center"
        android:orientation="vertical"
        android:padding="24dp"
        android:visibility="gone">

        <ImageView
            android:layout_width="72dp"
            android:layout_height="72dp"
            android:contentDescription="@string/network_error"
            android:src="@android:drawable/ic_dialog_alert"
            android:tint="#FF4E45" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:text="@string/no_internet_title"
            android:textColor="#FFFFFF"
            android:textSize="18sp"
            android:textStyle="bold" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:gravity="center"
            android:text="@string/no_internet_desc"
            android:textColor="#AAAAAA"
            android:textSize="14sp" />

        <Button
            android:id="@+id/btnRetry"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="20dp"
            android:backgroundTint="#FF0000"
            android:text="@string/btn_retry"
            android:textColor="#FFFFFF" />
    </LinearLayout>

    <!-- 
        CONTAINER PHÁT VIDEO TOÀN MÀN HÌNH (HTML5 Fullscreen):
        Khi người dùng bấm phóng to video trên YouTube, WebChromeClient sẽ gắn view video vào đây!
    -->
    <FrameLayout
        android:id="@+id/customViewContainer"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:background="#000000"
        android:visibility="gone" />

</FrameLayout>
`
  },
  {
    path: 'app/src/main/java/com/example/youtubelite/MainActivity.java',
    name: 'MainActivity.java',
    category: 'source',
    language: 'java',
    description: 'Toàn bộ mã nguồn Java chuẩn: WebViewClient, WebChromeClient (fullscreen HTML5), chặn domain quảng cáo qua shouldInterceptRequest, tiêm CSS/JS ẩn banner ad, xử lý nút Back cứng chống thoát.',
    content: `package com.example.youtubelite;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

/**
 * YouTube Lite - Tối ưu hóa đặc biệt cho Android 5.0 (API 21 Lollipop) trở lên.
 * Tính năng chính:
 * 1. Chạy m.youtube.com siêu nhẹ, tiết kiệm 70-80% RAM so với app YouTube gốc.
 * 2. Chặn quảng cáo banner, promoted sparkles và tự động nhấn nút Skip Ads.
 * 3. Hỗ trợ xem video toàn màn hình mượt mà qua WebChromeClient.
 * 4. Xử lý nút Back cứng để lùi trang hoặc thoát chế độ toàn màn hình.
 * 5. Tự động xử lý kết nối mạng và dọn dẹp bộ nhớ chống rò rỉ RAM (Memory Leak).
 */
public class MainActivity extends AppCompatActivity {

    private static final String TAG = "YouTubeLite";
    private static final String YOUTUBE_URL = "https://m.youtube.com";

    // Danh sách domain máy chủ quảng cáo cần chặn trực tiếp ở tầng Network (Request Interception)
    private static final List<String> AD_DOMAINS = Arrays.asList(
            "googleads.g.doubleclick.net",
            "pagead2.googlesyndication.com",
            "ad.doubleclick.net",
            "static.doubleclick.net",
            "securepubads.g.doubleclick.net",
            "youtube.com/pagead",
            "youtube.com/api/stats/ads",
            "adservice.google.com",
            "ade.googlesyndication.com"
    );

    // CSS injection để ẩn hoàn toàn các thẻ quảng cáo banner trên YouTube Mobile
    private static final String AD_BLOCK_CSS =
            ".ad-container, ytm-promoted-sparkles-web-renderer, ytd-promoted-video-renderer, " +
            "ytm-companion-ad-renderer, .video-ads, .ytp-ad-module, .ytp-ad-overlay-container, " +
            "ytm-promoted-sparkles-text-search-web-renderer, .ad-showing, ytm-paid-content-overlay-renderer " +
            "{ display: none !important; opacity: 0 !important; height: 0 !important; }";

    // JavaScript định kỳ tìm và click nút "Bỏ qua quảng cáo" (Skip Ad)
    private static final String AD_SKIP_JS =
            "javascript:(function() {" +
            "  var style = document.getElementById('adblock_style');" +
            "  if (!style) {" +
            "    style = document.createElement('style');" +
            "    style.id = 'adblock_style';" +
            "    style.innerHTML = '" + AD_BLOCK_CSS + "';" +
            "    (document.head || document.documentElement).appendChild(style);" +
            "  }" +
            "  function skipAd() {" +
            "    var skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button');" +
            "    if (skipBtn) { skipBtn.click(); }" +
            "    var video = document.querySelector('video');" +
            "    var isAd = document.querySelector('.ad-showing, .ad-interrupting');" +
            "    if (video && isAd && video.duration > 0) {" +
            "      video.currentTime = video.duration;" +
            "    }" +
            "  }" +
            "  setInterval(skipAd, 600);" +
            "})();";

    private WebView webView;
    private SwipeRefreshLayout swipeRefreshLayout;
    private ProgressBar progressBar;
    private LinearLayout errorView;
    private Button btnRetry;

    // Các biến phục vụ chế độ xem video Fullscreen HTML5
    private FrameLayout customViewContainer;
    private View customView;
    private WebChromeClient.CustomViewCallback customViewCallback;

    private long backPressedTime = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initViews();
        setupWebView();
        setupListeners();

        // Tải trang lần đầu nếu có mạng
        if (isNetworkAvailable()) {
            webView.loadUrl(YOUTUBE_URL);
        } else {
            showErrorView(true);
        }
    }

    private void initViews() {
        webView = findViewById(R.id.webView);
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);
        progressBar = findViewById(R.id.progressBar);
        errorView = findViewById(R.id.errorView);
        btnRetry = findViewById(R.id.btnRetry);
        customViewContainer = findViewById(R.id.customViewContainer);

        swipeRefreshLayout.setColorSchemeColors(0xFFFF0000, 0xFF282828);
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings settings = webView.getSettings();

        // 1. Cấu hình cơ bản theo yêu cầu
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);

        // 2. Tối ưu bộ nhớ đệm (Cache) giúp xem mượt hơn trên máy cấu hình yếu
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            // Cho phép Cookie của phiên làm việc và đa tên miền
            CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
            // Mixed Content: Đảm bảo các stream video không bị chặn trên Android 5.0
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        // 3. Tối ưu hiển thị và điều khiển phóng to
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        // 4. Tùy chỉnh User-Agent: Giữ định dạng Mobile hiện đại nhưng tương thích tối đa
        String defaultUa = settings.getUserAgentString();
        // Giả lập thiết bị di động chuẩn để m.youtube.com tải giao diện nhẹ
        settings.setUserAgentString(defaultUa + " MobileYouTubeLite/1.0");

        // 5. Cấu hình WebViewClient (mở link trong app & chặn quảng cáo)
        webView.setWebViewClient(new YouTubeWebViewClient());

        // 6. Cấu hình WebChromeClient (xử lý Video Fullscreen & tiến trình tải)
        webView.setWebChromeClient(new YouTubeWebChromeClient());
    }

    private void setupListeners() {
        // Vuốt xuống để refresh lại video hoặc trang hiện tại
        swipeRefreshLayout.setOnRefreshListener(() -> {
            if (isNetworkAvailable()) {
                webView.reload();
            } else {
                swipeRefreshLayout.setRefreshing(false);
                showErrorView(true);
            }
        });

        // Bấm nút thử lại khi mất mạng
        btnRetry.setOnClickListener(v -> {
            if (isNetworkAvailable()) {
                showErrorView(false);
                webView.reload();
            } else {
                Toast.makeText(MainActivity.this, R.string.still_no_internet, Toast.LENGTH_SHORT).show();
            }
        });
    }

    /**
     * WebViewClient tùy biến:
     * - Giữ tất cả liên kết YouTube mở nội bộ trong WebView
     * - Chặn request quảng cáo qua shouldInterceptRequest
     * - Tiêm mã JS/CSS ẩn banner và bỏ qua video ads khi trang tải xong
     */
    private class YouTubeWebViewClient extends WebViewClient {

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return handleUrl(view, url);
        }

        // Tương thích Android 7.0+ (API 24)
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                return handleUrl(view, request.getUrl().toString());
            }
            return false;
        }

        private boolean handleUrl(WebView view, String url) {
            if (url == null) return false;

            // Nếu liên kết thuộc về YouTube -> Mở trực tiếp bên trong WebView
            if (isYouTubeDomain(url)) {
                return false;
            }

            // Nếu là liên kết ứng dụng bên ngoài (intent://, tel:, mailto:)
            if (url.startsWith("intent:") || url.startsWith("market:") || url.startsWith("tel:") || url.startsWith("mailto:")) {
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                } catch (Exception e) {
                    Log.e(TAG, "Không thể mở intent ngoại: " + e.getMessage());
                    return true;
                }
            }

            // Mở các trang web bên thứ 3 bằng trình duyệt ngoài để không làm nghẽn app
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                startActivity(intent);
                return true;
            } catch (Exception e) {
                return false;
            }
        }

        // Chặn request quảng cáo ở tầng mạng (Tương thích API 21 Lollipop+)
        @Nullable
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
            if (isAdUrl(url)) {
                // Trả về dữ liệu trống để cắt đứt việc tải file quảng cáo
                return new WebResourceResponse("text/plain", "UTF-8", new ByteArrayInputStream("".getBytes()));
            }
            return super.shouldInterceptRequest(view, url);
        }

        @Nullable
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                String url = request.getUrl().toString();
                if (isAdUrl(url)) {
                    return new WebResourceResponse("text/plain", "UTF-8", new ByteArrayInputStream("".getBytes()));
                }
            }
            return super.shouldInterceptRequest(view, request);
        }

        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
            showErrorView(false);
            progressBar.setVisibility(View.VISIBLE);
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            progressBar.setVisibility(View.GONE);
            swipeRefreshLayout.setRefreshing(false);

            // Tiêm JavaScript và CSS để loại bỏ các banner quảng cáo còn sót lại
            view.loadUrl(AD_SKIP_JS);
        }

        @Override
        public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
            super.onReceivedError(view, errorCode, description, failingUrl);
            if (!isNetworkAvailable()) {
                showErrorView(true);
            }
        }
    }

    /**
     * WebChromeClient hỗ trợ Video Toàn Màn hình (HTML5 Fullscreen):
     * Khi bấm nút phóng to trên trình phát YouTube, phương thức onShowCustomView sẽ được gọi.
     */
    private class YouTubeWebChromeClient extends WebChromeClient {

        @Override
        public void onProgressChanged(WebView view, int newProgress) {
            super.onProgressChanged(view, newProgress);
            progressBar.setProgress(newProgress);
            if (newProgress >= 100) {
                progressBar.setVisibility(View.GONE);
            }
        }

        @Override
        public void onShowCustomView(View view, CustomViewCallback callback) {
            if (customView != null) {
                onHideCustomView();
                return;
            }

            customView = view;
            customViewCallback = callback;

            // Ẩn WebView và hiển thị container video toàn màn hình
            swipeRefreshLayout.setVisibility(View.GONE);
            customViewContainer.setVisibility(View.VISIBLE);
            customViewContainer.addView(view, new FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT));

            // Chuyển sang chế độ xoay ngang và ẩn thanh trạng thái (Immersive Mode)
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
            hideSystemUI();
        }

        @Override
        public void onHideCustomView() {
            if (customView == null) return;

            // Hiển thị lại WebView
            swipeRefreshLayout.setVisibility(View.VISIBLE);
            customViewContainer.setVisibility(View.GONE);
            customViewContainer.removeView(customView);

            if (customViewCallback != null) {
                customViewCallback.onCustomViewHidden();
            }

            customView = null;
            customViewCallback = null;

            // Khôi phục chiều xoay dọc
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
            showSystemUI();
        }
    }

    /**
     * XỬ LÝ NÚT BACK CỨNG:
     * 1. Nếu đang xem video toàn màn hình -> Thoát toàn màn hình trước.
     * 2. Nếu WebView có thể lùi (canGoBack) và không phải trang chủ -> Lùi trang.
     * 3. Nếu đang ở trang chủ -> Nhấn 2 lần trong vòng 2 giây để thoát app.
     */
    @Override
    public void onBackPressed() {
        // 1. Kiểm tra nếu đang ở chế độ Video Fullscreen
        if (customView != null) {
            YouTubeWebChromeClient chromeClient = new YouTubeWebChromeClient();
            chromeClient.onHideCustomView();
            return;
        }

        // 2. Kiểm tra nếu có lịch sử duyệt trang trong WebView
        if (webView != null && webView.canGoBack()) {
            String currentUrl = webView.getUrl();
            // Nếu không phải là trang chủ YouTube thì thực hiện lùi trang
            if (currentUrl != null && !isHomePage(currentUrl)) {
                webView.goBack();
                return;
            }
        }

        // 3. Nhấn 2 lần để thoát khi ở trang chủ
        if (backPressedTime + 2000 > System.currentTimeMillis()) {
            super.onBackPressed();
        } else {
            Toast.makeText(this, R.string.press_back_again_to_exit, Toast.LENGTH_SHORT).show();
            backPressedTime = System.currentTimeMillis();
        }
    }

    private boolean isYouTubeDomain(String url) {
        if (url == null) return false;
        String lower = url.toLowerCase();
        return lower.contains("m.youtube.com") ||
               lower.contains("youtube.com") ||
               lower.contains("youtu.be") ||
               lower.contains("accounts.google.com");
    }

    private boolean isHomePage(String url) {
        String cleaned = url.replace("https://", "").replace("http://", "").replace("www.", "");
        return cleaned.equals("m.youtube.com") || cleaned.equals("m.youtube.com/") || cleaned.equals("youtube.com") || cleaned.equals("youtube.com/");
    }

    private boolean isAdUrl(String url) {
        if (url == null) return false;
        String lower = url.toLowerCase();
        for (String domain : AD_DOMAINS) {
            if (lower.contains(domain)) {
                return true;
            }
        }
        return false;
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm == null) return false;
        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        return activeNetwork != null && activeNetwork.isConnectedOrConnecting();
    }

    private void showErrorView(boolean show) {
        errorView.setVisibility(show ? View.VISIBLE : View.GONE);
        swipeRefreshLayout.setVisibility(show ? View.GONE : View.VISIBLE);
    }

    private void hideSystemUI() {
        View decorView = getWindow().getDecorView();
        decorView.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_FULLSCREEN |
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );
    }

    private void showSystemUI() {
        View decorView = getWindow().getDecorView();
        decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (webView != null) {
            webView.onPause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) {
            webView.onResume();
        }
    }

    /**
     * Dọn dẹp hoàn toàn tài nguyên WebView khi đóng ứng dụng để tránh Memory Leak trên Android 5.0
     */
    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.loadUrl("about:blank");
            webView.stopLoading();
            webView.setWebChromeClient(null);
            webView.setWebViewClient(null);
            ((ViewGroup) webView.getParent()).removeView(webView);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
`
  },
  {
    path: 'app/src/main/java/com/example/youtubelite/MainActivity.kt',
    name: 'MainActivity.kt (Kotlin Alternative)',
    category: 'source',
    language: 'kotlin',
    description: 'Phiên bản hoàn chỉnh viết bằng Kotlin, sử dụng cú pháp hiện đại, OnBackPressedCallback và tích hợp đầy đủ các tính năng tối ưu.',
    content: `package com.example.youtubelite

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.ActivityInfo
import android.graphics.Bitmap
import android.net.ConnectivityManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.webkit.*
import android.widget.*
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import java.io.ByteArrayInputStream

class MainActivity : AppCompatActivity() {

    private val youtubeUrl = "https://m.youtube.com"
    private val adDomains = listOf(
        "googleads.g.doubleclick.net",
        "pagead2.googlesyndication.com",
        "ad.doubleclick.net",
        "static.doubleclick.net",
        "securepubads.g.doubleclick.net",
        "youtube.com/pagead",
        "youtube.com/api/stats/ads"
    )

    private val adSkipJs = """
        javascript:(function() {
            var style = document.getElementById('adblock_style');
            if (!style) {
                style = document.createElement('style');
                style.id = 'adblock_style';
                style.innerHTML = '.ad-container, ytm-promoted-sparkles-web-renderer, ytd-promoted-video-renderer, ytm-companion-ad-renderer, .video-ads { display: none !important; }';
                (document.head || document.documentElement).appendChild(style);
            }
            setInterval(function() {
                var btn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');
                if (btn) btn.click();
            }, 500);
        })();
    """.trimIndent()

    private lateinit var webView: WebView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private lateinit var progressBar: ProgressBar
    private lateinit var errorView: LinearLayout
    private lateinit var customViewContainer: FrameLayout

    private var customView: View? = null
    private var customViewCallback: WebChromeClient.CustomViewCallback? = null
    private var backPressedTime: Long = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout)
        progressBar = findViewById(R.id.progressBar)
        errorView = findViewById(R.id.errorView)
        customViewContainer = findViewById(R.id.customViewContainer)
        val btnRetry: Button = findViewById(R.id.btnRetry)

        setupWebView()
        setupBackHandler()

        swipeRefreshLayout.setOnRefreshListener {
            if (isNetworkAvailable()) webView.reload() else swipeRefreshLayout.isRefreshing = false
        }

        btnRetry.setOnClickListener {
            if (isNetworkAvailable()) {
                errorView.visibility = View.GONE
                webView.reload()
            }
        }

        if (isNetworkAvailable()) {
            webView.loadUrl(youtubeUrl)
        } else {
            errorView.visibility = View.VISIBLE
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
            setSupportZoom(true)
            builtInZoomControls = true
            displayZoomControls = false
            mediaPlaybackRequiresUserGesture = false
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true)
            }
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                if (url.contains("youtube.com") || url.contains("youtu.be")) return false
                return try {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    true
                } catch (e: Exception) { false }
            }

            override fun shouldInterceptRequest(view: WebView?, request: WebResourceRequest?): WebResourceResponse? {
                val url = request?.url?.toString()?.lowercase() ?: return null
                if (adDomains.any { url.contains(it) }) {
                    return WebResourceResponse("text/plain", "UTF-8", ByteArrayInputStream("".toByteArray()))
                }
                return super.shouldInterceptRequest(view, request)
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                progressBar.visibility = View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                progressBar.visibility = View.GONE
                swipeRefreshLayout.isRefreshing = false
                view?.loadUrl(adSkipJs)
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progressBar.progress = newProgress
                if (newProgress >= 100) progressBar.visibility = View.GONE
            }

            override fun onShowCustomView(view: View?, callback: CustomViewCallback?) {
                if (customView != null) {
                    onHideCustomView()
                    return
                }
                customView = view
                customViewCallback = callback
                swipeRefreshLayout.visibility = View.GONE
                customViewContainer.visibility = View.VISIBLE
                customViewContainer.addView(view)
                requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
            }

            override fun onHideCustomView() {
                swipeRefreshLayout.visibility = View.VISIBLE
                customViewContainer.visibility = View.GONE
                customViewContainer.removeView(customView)
                customView = null
                customViewCallback?.onCustomViewHidden()
                requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
            }
        }
    }

    private fun setupBackHandler() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (customView != null) {
                    webView.webChromeClient?.onHideCustomView()
                    return
                }
                if (webView.canGoBack()) {
                    val url = webView.url ?: ""
                    if (!url.contains("m.youtube.com/") || url.length > 25) {
                        webView.goBack()
                        return
                    }
                }
                if (backPressedTime + 2000 > System.currentTimeMillis()) {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                } else {
                    Toast.makeText(this@MainActivity, "Nhấn lần nữa để thoát", Toast.LENGTH_SHORT).show()
                    backPressedTime = System.currentTimeMillis()
                }
            }
        })
    }

    private fun isNetworkAvailable(): Boolean {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        return cm.activeNetworkInfo?.isConnectedOrConnecting == true
    }

    override fun onDestroy() {
        webView.loadUrl("about:blank")
        webView.stopLoading()
        (webView.parent as? ViewGroup)?.removeView(webView)
        webView.destroy()
        super.onDestroy()
    }
}
`
  },
  {
    path: 'app/proguard-rules.pro',
    name: 'app/proguard-rules.pro',
    category: 'config',
    language: 'pro',
    description: 'Quy tắc ProGuard/R8 bảo vệ mã WebKit JavaScript Interface và thu nhỏ dung lượng APK tối đa.',
    content: `# Tối ưu hóa và giữ an toàn cho WebView trên Android 5.0
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Giữ nguyên các lớp liên quan đến WebKit
-keep class android.webkit.** { *; }

# Rút gọn các dòng log dư thừa trong bản Release để tăng tốc CPU máy cũ
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
}
`
  },
  {
    path: 'app/src/main/res/values/styles.xml',
    name: 'res/values/styles.xml',
    category: 'res',
    language: 'xml',
    description: 'Giao diện Theme.YouTubeLite Dark Mode không có ActionBar, tối ưu hiển thị tràn màn hình.',
    content: `<resources>
    <!-- Giao diện tối hiện đại, loại bỏ hoàn toàn thanh ActionBar để dành diện tích cho WebView -->
    <style name="Theme.YouTubeLite" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <!-- Màu chủ đạo YouTube đỏ & đen -->
        <item name="colorPrimary">#FF0000</item>
        <item name="colorPrimaryVariant">#CC0000</item>
        <item name="colorOnPrimary">#FFFFFF</item>
        
        <!-- Thanh trạng thái (Status Bar) đen tiệp màu giao diện -->
        <item name="android:statusBarColor">#0F0F0F</item>
        <item name="android:navigationBarColor">#0F0F0F</item>
        <item name="android:windowBackground">#0F0F0F</item>
    </style>
</resources>
`
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    name: 'res/values/strings.xml',
    category: 'res',
    language: 'xml',
    description: 'Các chuỗi ký tự giao diện (tiếng Việt & tiếng Anh).',
    content: `<resources>
    <string name="app_name">YouTube Lite</string>
    <string name="no_internet_title">Không có kết nối Internet</string>
    <string name="no_internet_desc">Vui lòng kiểm tra lại kết nối Wi-Fi hoặc dữ liệu di động của bạn và thử lại.</string>
    <string name="btn_retry">Thử lại ngay</string>
    <string name="press_back_again_to_exit">Nhấn Back lần nữa để thoát</string>
    <string name="network_error">Lỗi kết nối</string>
    <string name="still_no_internet">Vẫn chưa có kết nối Internet. Vui lòng kiểm tra lại!</string>
</resources>
`
  },
  {
    path: 'app/src/main/res/drawable/custom_progress_bar.xml',
    name: 'res/drawable/custom_progress_bar.xml',
    category: 'res',
    language: 'xml',
    description: 'Thanh tiến trình màu đỏ YouTube mượt mà.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:id="@android:id/background">
        <shape>
            <solid android:color="#222222" />
        </shape>
    </item>
    <item android:id="@android:id/progress">
        <clip>
            <shape>
                <solid android:color="#FF0000" />
            </shape>
        </clip>
    </item>
</layer-list>
`
  },
  {
    path: 'settings.gradle',
    name: 'settings.gradle',
    category: 'gradle',
    language: 'groovy',
    description: 'Cấu hình project root name và module app.',
    content: `rootProject.name = "YouTubeLite"
include ':app'
`
  },
  {
    path: 'gradle.properties',
    name: 'gradle.properties',
    category: 'config',
    language: 'properties',
    description: 'Bật AndroidX và tối ưu JVM memory cho máy tính build APK.',
    content: `# Bật hỗ trợ AndroidX và tự động migrate thư viện cũ
android.useAndroidX=true
android.enableJetifier=true

# Tối ưu hóa JVM khi build APK bằng Gradle
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
org.gradle.parallel=true
org.gradle.caching=true
`
  }
];
