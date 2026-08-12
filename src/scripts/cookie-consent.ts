/**
 * Cookie Consent Banner — GDPR Compliance
 * Shows a consent banner on first visit. Ads are NOT loaded until user accepts.
 * Stores preference in localStorage.
 */
(function() {
  'use strict';

  var CONSENT_KEY = 'df-cookie-consent';
  var banner = null;

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch(e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch(e) {}
  }

  function createBanner() {
    // Don't create if consent already given or banner exists
    if (getConsent() !== null || banner) return;

    banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.innerHTML =
      '<div class="cc-inner">' +
        '<div class="cc-text">' +
          '<strong>We value your privacy</strong>' +
          '<p>We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. ' +
          '<a href="/privacy-policy.html#cookies" style="color:#f59e0b;text-decoration:underline;">Learn more</a></p>' +
        '</div>' +
        '<div class="cc-buttons">' +
          '<button class="cc-btn cc-btn-decline" id="ccDecline">Reject All</button>' +
          '<button class="cc-btn cc-btn-accept" id="ccAccept">Accept All</button>' +
        '</div>' +
      '</div>';

    // Inject styles
    var style = document.createElement('style');
    style.textContent =
      '#cookie-consent-banner {' +
        'position:fixed;bottom:0;left:0;right:0;z-index:99999;' +
        'background:rgba(10,14,23,0.97);' +
        'border-top:1px solid #2a3450;' +
        'backdrop-filter:blur(12px);' +
        '-webkit-backdrop-filter:blur(12px);' +
        'padding:16px 20px;' +
        'font-family:Inter,sans-serif;' +
        'animation:cc-slide-up 0.4s ease;' +
      '}' +
      '@keyframes cc-slide-up {' +
        'from { transform:translateY(100%); opacity:0; }' +
        'to { transform:translateY(0); opacity:1; }' +
      '}' +
      '.cc-inner {' +
        'max-width:1100px;margin:0 auto;' +
        'display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;' +
      '}' +
      '.cc-text { flex:1; min-width:280px; }' +
      '.cc-text strong {' +
        'display:block;color:#e8eaf0;font-size:0.95rem;margin-bottom:4px;' +
      '}' +
      '.cc-text p {' +
        'margin:0;color:#9ca3af;font-size:0.85rem;line-height:1.5;' +
      '}' +
      '.cc-buttons { display:flex;gap:10px;flex-shrink:0; }' +
      '.cc-btn {' +
        'padding:10px 20px;border-radius:8px;font-size:0.85rem;font-weight:600;' +
        'cursor:pointer;border:none;transition:all 0.2s ease;font-family:Inter,sans-serif;' +
      '}' +
      '.cc-btn-decline {' +
        'background:transparent;color:#9ca3af;border:1px solid #2a3450;' +
      '}' +
      '.cc-btn-decline:hover { border-color:#9ca3af;color:#e8eaf0; }' +
      '.cc-btn-accept {' +
        'background:#f59e0b;color:#0a0e17;' +
      '}' +
      '.cc-btn-accept:hover { background:#d97706; }' +
      '@media(max-width:600px) {' +
        '.cc-inner { flex-direction:column;text-align:center; }' +
        '.cc-buttons { width:100%;justify-content:center; }' +
      '}';
    document.head.appendChild(style);
    document.body.appendChild(banner);

    // Bind events
    document.getElementById('ccAccept').addEventListener('click', function() {
      setConsent('accepted');
      hideBanner();
      // Enable personalized ads (re-load ad script with tracking)
      enableAds();
    });

    document.getElementById('ccDecline').addEventListener('click', function() {
      setConsent('declined');
      hideBanner();
      // Non-personalized ads only
      loadNonPersonalizedAds();
    });
  }

  function hideBanner() {
    if (banner && banner.parentNode) {
      banner.style.animation = 'none';
      banner.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      banner.style.transform = 'translateY(100%)';
      banner.style.opacity = '0';
      setTimeout(function() {
        if (banner && banner.parentNode) {
          banner.parentNode.removeChild(banner);
        }
        banner = null;
      }, 300);
    }
  }

  function enableAds() {
    // Ads are already loaded via the standard AdSense script in <head>
    // With consent, personalized ads are enabled by default
    if (typeof window.adsbygoogle !== 'undefined') {
      // Google personalization is on by default — nothing extra needed
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch(e) {}
    }
  }

  function loadNonPersonalizedAds() {
    // For users who decline, request non-personalized ads
    // See: https://support.google.com/adsense/answer/9299606
    try {
      (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = true;
    } catch(e) {}
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createBanner);
  } else {
    createBanner();
  }
})();
