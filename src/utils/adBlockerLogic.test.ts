import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isAdUrl,
  isInternalYouTubeUrl,
  generateAdBlockingCss,
  generateAdSkippingJs,
} from './adBlockerLogic';

test('isAdUrl correctly detects ad domains', () => {
  assert.equal(isAdUrl('https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub'), true);
  assert.equal(isAdUrl('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'), true);
  assert.equal(isAdUrl('https://ad.doubleclick.net/pixel'), true);
  assert.equal(isAdUrl('https://m.youtube.com/watch?v=dQw4w9WgXcQ'), false);
  assert.equal(isAdUrl('https://www.youtube.com/feed/trending'), false);
  assert.equal(isAdUrl(''), false);
});

test('isInternalYouTubeUrl correctly differentiates YouTube from external links', () => {
  assert.equal(isInternalYouTubeUrl('https://m.youtube.com/'), true);
  assert.equal(isInternalYouTubeUrl('https://www.youtube.com/watch?v=123'), true);
  assert.equal(isInternalYouTubeUrl('https://youtu.be/123'), true);
  assert.equal(isInternalYouTubeUrl('https://facebook.com/share'), false);
  assert.equal(isInternalYouTubeUrl('https://google.com/'), false);
});

test('generateAdBlockingCss produces valid CSS selector block', () => {
  const css = generateAdBlockingCss();
  assert.ok(css.includes('.ad-container'));
  assert.ok(css.includes('display: none !important'));
});

test('generateAdSkippingJs contains ad skipping script', () => {
  const js = generateAdSkippingJs();
  assert.ok(js.includes('ytp-ad-skip-button'));
  assert.ok(js.includes('removeAds'));
});
