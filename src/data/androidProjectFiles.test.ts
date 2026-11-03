import test from 'node:test';
import assert from 'node:assert/strict';
import { ANDROID_PROJECT_FILES } from './androidProjectFiles';

test('Android project contains all essential files', () => {
  const filePaths = ANDROID_PROJECT_FILES.map(f => f.path);
  assert.ok(filePaths.includes('build.gradle'), 'Must have root build.gradle');
  assert.ok(filePaths.includes('app/build.gradle'), 'Must have app/build.gradle');
  assert.ok(filePaths.includes('app/src/main/AndroidManifest.xml'), 'Must have AndroidManifest.xml');
  assert.ok(filePaths.includes('app/src/main/res/layout/activity_main.xml'), 'Must have activity_main.xml');
  assert.ok(filePaths.includes('app/src/main/java/com/example/youtubelite/MainActivity.java'), 'Must have MainActivity.java');
  assert.ok(filePaths.includes('app/src/main/java/com/example/youtubelite/MainActivity.kt'), 'Must have MainActivity.kt');
});

test('app/build.gradle satisfies Android 5.0 Lollipop (minSdk 21) requirements', () => {
  const appGradle = ANDROID_PROJECT_FILES.find(f => f.path === 'app/build.gradle');
  assert.ok(appGradle);
  assert.ok(appGradle.content.includes('minSdk 21'), 'Must specify minSdk 21');
  assert.ok(appGradle.content.includes('targetSdk'), 'Must specify targetSdk');
  assert.ok(appGradle.content.includes('v1SigningEnabled true'), 'Must enable v1 signing for Android 5.0');
});

test('AndroidManifest.xml contains internet permissions and hardware acceleration', () => {
  const manifest = ANDROID_PROJECT_FILES.find(f => f.path === 'app/src/main/AndroidManifest.xml');
  assert.ok(manifest);
  assert.ok(manifest.content.includes('android.permission.INTERNET'), 'Must declare INTERNET');
  assert.ok(manifest.content.includes('android:hardwareAccelerated="true"'), 'Must declare hardwareAccelerated');
  assert.ok(manifest.content.includes('configChanges'), 'Must handle orientation configChanges');
});

test('MainActivity.java implements all required WebView and Adblock features', () => {
  const mainJava = ANDROID_PROJECT_FILES.find(f => f.path.endsWith('MainActivity.java'));
  assert.ok(mainJava);
  assert.ok(mainJava.content.includes('setJavaScriptEnabled(true)'), 'Must enable JavaScript');
  assert.ok(mainJava.content.includes('setDomStorageEnabled(true)'), 'Must enable DOM storage');
  assert.ok(mainJava.content.includes('shouldInterceptRequest'), 'Must intercept requests for ad-blocking');
  assert.ok(mainJava.content.includes('onBackPressed'), 'Must handle back button');
  assert.ok(mainJava.content.includes('WebChromeClient'), 'Must support WebChromeClient for fullscreen video');
  assert.ok(mainJava.content.includes('m.youtube.com'), 'Must load m.youtube.com');
});
