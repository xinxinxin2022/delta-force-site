/* ============================================
   Delta Force Guide — Main JavaScript
   Navigation, Scroll Effects, Search, TOC
   ============================================ */

(function() {
  'use strict';

  // --- Header scroll effect ---
  const header = document.querySelector('.site-header');
  const scrollTop = document.querySelector('.scroll-top');

  function onScroll() {
    const scrollY = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', scrollY > 50);
    }
    if (scrollTop) {
      scrollTop.classList.toggle('visible', scrollY > 400);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Scroll to top ---
  if (scrollTop) {
    scrollTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Mobile menu toggle ---
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      navMenu.classList.toggle('open');
      mobileMenuBtn.innerHTML = navMenu.classList.contains('open') ? '✕' : '☰';
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('open');
        mobileMenuBtn.innerHTML = '☰';
      });
    });
  }

  // --- Article filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const articleCards = document.querySelectorAll('.article-card');

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      // Update active state
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');

      // Filter cards
      articleCards.forEach(function(card) {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(function() {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- Simple search ---
  const searchInput = document.querySelector('.search-bar input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      articleCards.forEach(function(card) {
        const title = card.querySelector('.card-title');
        const excerpt = card.querySelector('.card-excerpt');
        const text = (title ? title.textContent : '') + ' ' + (excerpt ? excerpt.textContent : '');
        card.style.display = text.toLowerCase().includes(query) ? '' : 'none';
      });
    });
  }

  // --- Navigation filter links (Game Modes, Operators, Weapons, Maps) ---
  document.querySelectorAll('.nav-filter').forEach(function(navLink) {
    navLink.addEventListener('click', function(e) {
      e.preventDefault();
      var targetFilter = this.getAttribute('data-target');
      if (!targetFilter) return;

      // Scroll to articles section
      var articlesSection = document.getElementById('articles');
      if (articlesSection) {
        articlesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Trigger the corresponding filter button
      setTimeout(function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        var matchingBtn = document.querySelector('.filter-btn[data-filter="' + targetFilter + '"]');
        if (matchingBtn) {
          matchingBtn.classList.add('active');
          matchingBtn.click();
        }
      }, 400);
    });
  });

  // --- Footer category links also trigger filters ---
  document.querySelectorAll('.footer-links a[data-filter]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var targetFilter = this.getAttribute('data-filter');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(function() {
        var articlesSection = document.getElementById('articles');
        if (articlesSection) articlesSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(function() {
          filterBtns.forEach(function(b) { b.classList.remove('active'); });
          var matchingBtn = document.querySelector('.filter-btn[data-filter="' + targetFilter + '"]');
          if (matchingBtn) { matchingBtn.classList.add('active'); matchingBtn.click(); }
        }, 400);
      }, 300);
    });
  });

// Simplified article translation - just show/hide Chinese summary
function applyArticleTranslation() {
  if (!window.articleTranslation || currentLang !== 'zh') return;
  
  var at = window.articleTranslation;
  
  // Translate title
  var title = document.querySelector('.article-title');
  if (title && at.title) {
    if (!title.getAttribute('data-en')) title.setAttribute('data-en', title.textContent);
    title.textContent = at.title;
  }
  
  // Add Chinese intro box if not exists
  if (!document.querySelector('.zh-intro-box') && at.paragraphs) {
    var content = document.querySelector('.article-content');
    if (content) {
      var firstParaText = Object.values(at.paragraphs)[0] || '';
      var box = document.createElement('div');
      box.className = 'zh-intro-box callout callout-info';
      box.style.cssText = 'border-left-color:#ef4444;background:rgba(239,68,68,0.05);margin-bottom:24px;';
      box.innerHTML = '<div class="callout-title" style="color:#ef4444;">📖 中文摘要</div><p>' + at.subtitle + '</p><p>' + firstParaText + '</p>';
      content.insertBefore(box, content.firstChild);
    }
  }
  
  // Translate section headings
  if (at.sections) {
    document.querySelectorAll('.article-content h2, .article-content h3').forEach(function(h) {
      var enText = h.textContent.trim();
      if (!h.getAttribute('data-en')) h.setAttribute('data-en', enText);
      for (var en in at.sections) {
        if (enText.toLowerCase().indexOf(en.toLowerCase()) !== -1) {
          h.textContent = at.sections[en];
          break;
        }
      }
    });
  }
}

function restoreArticleEnglish() {
  var title = document.querySelector('.article-title');
  if (title) {
    var en = title.getAttribute('data-en');
    if (en) title.textContent = en;
  }
  var box = document.querySelector('.zh-intro-box');
  if (box) box.remove();
  document.querySelectorAll('.article-content h2[data-en], .article-content h3[data-en]').forEach(function(h) {
    h.textContent = h.getAttribute('data-en');
    h.removeAttribute('data-en');
  });
  if (title) title.removeAttribute('data-en');
}

  // --- Language Toggle ---
  var langToggle = document.getElementById('langToggle');
  // Persist language choice across pages
  var currentLang = localStorage.getItem('df-guide-lang') || 'en';

  // Translation map for key UI elements
  var translations = {
    en: {
      'hero-badge': 'Season 7/8 Updated',
      'hero-title': 'Delta Force: Hawk Ops Complete Guide',
      'hero-subtitle': 'Your definitive resource for mastering every operator, weapon, map, and game mode. Up-to-date strategies for Havoc extraction and All-Out Warfare in 2026.',
      'btn-browse': 'Browse Guides',
      'btn-start': 'Getting Started',
      'search-placeholder': 'Search guides — operators, weapons, maps...',
      'filter-all': 'All',
      'filter-mode': 'Game Modes',
      'filter-operator': 'Operators',
      'filter-weapon': 'Weapons',
      'filter-map': 'Maps',
      'filter-economy': 'Economy',
      'filter-beginner': 'Beginner'
    },
    zh: {
      'hero-badge': 'S7/S8 赛季更新',
      'hero-title': '三角洲行动：全面攻略指南',
      'hero-subtitle': '最全面的三角洲行动攻略资源。涵盖所有干员、武器、地图和游戏模式的详细策略，2026年最新版本。',
      'btn-browse': '浏览攻略',
      'btn-start': '新手入门',
      'search-placeholder': '搜索攻略 — 干员、武器、地图...',
      'filter-all': '全部',
      'filter-mode': '游戏模式',
      'filter-operator': '干员',
      'filter-weapon': '武器',
      'filter-map': '地图',
      'filter-economy': '经济系统',
      'filter-beginner': '新手指南'
    }
  };

  // Article card translations
  var cardTranslations = {
    zh: {
      'card-1-title': '三角洲行动：完全攻略指南',
      'card-1-excerpt': '从游戏模式、干员技能、武器改装到地图攻略和经济系统，一站式掌握三角洲行动的所有核心内容。',
      'card-2-title': '烽火地带 — 搜打撤模式攻略',
      'card-2-excerpt': '全面解析搜打撤模式。学习物资路线、撤离点位置、PvE策略，以及如何最大化哈夫币收益。',
      'card-3-title': '全面战场 — 32v32 大规模对战攻略',
      'card-3-excerpt': '掌握32v32大规模战场。坦克、直升机战术，据点攻防策略，团队协作技巧。',
      'card-4-title': '红狼 — 滑铲之王干员攻略',
      'card-4-excerpt': '学习红狼的滑铲技巧和烟雾弹战术。掌握近距离战斗技巧，在狭窄空间中压制敌人。',
      'card-5-title': '威龙 — 空中突击干员攻略',
      'card-5-excerpt': '掌握威龙的喷射背包技能。学习最佳跳跃路线、空中侦察战术，以及垂直迂回技巧。',
      'card-6-title': '银翼 — 侦察无人机干员攻略',
      'card-6-excerpt': '用侦察无人机掌控战场。银翼的侦察能力为团队提供无与伦比的情报支持。',
      'card-7-title': '蜂医 — 终极辅助干员攻略',
      'card-7-excerpt': '成为最强治疗师。学习如何在激烈交火中保持队友存活，最佳烟雾弹放置技巧。',
      'card-8-title': '武器排行 — 当前版本META排名',
      'card-8-excerpt': '搜打撤和全面战场的武器排行。了解各距离最强武器、后坐力模式和最佳配件。',
      'card-9-title': '平民武器改装 — 改枪码分享',
      'card-9-excerpt': '最佳性价比武器改装方案，可直接复制改枪码。控制后坐力、提升伤害，不花冤枉钱。',
      'card-10-title': '零号大坝 — 完整地图攻略',
      'card-10-excerpt': '零号大坝物资点和跑刀路线。找到最高价值刷新点，学习撤离路线和最快赚钱策略。',
      'card-11-title': '长弓溪谷 — 完整地图攻略',
      'card-11-excerpt': '钻石女王酒店、雷达站和最佳物资路线。掌握地形变化、狙击位和载具刷新点。',
      'card-12-title': '巴克什航天基地 — 完整攻略',
      'card-12-excerpt': '巴别塔、博物馆和航天基地金色物资点。学习室内布局、卡点和最佳装备配置。',
      'card-13-title': '经济系统 — 赚钱攻略',
      'card-13-excerpt': '学习快速赚取哈夫币的方法。跑刀、物资倒卖和智能撤离策略，成为百万富翁。',
      'card-14-title': '15个新手技巧与常见错误',
      'card-14-excerpt': '每个新玩家都应该知道的15个技巧和常见错误。从基础移动机制到高级站位技巧。'
    }
  };

  if (langToggle) {
    langToggle.addEventListener('click', function() {
      currentLang = currentLang === 'en' ? 'zh' : 'en';
      // Save language preference
      localStorage.setItem('df-guide-lang', currentLang);
      langToggle.textContent = currentLang === 'en' ? 'EN / 中' : '中 / EN';
      langToggle.style.background = currentLang === 'zh' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)';
      langToggle.style.borderColor = currentLang === 'zh' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)';
      langToggle.style.color = currentLang === 'zh' ? '#ef4444' : '#f59e0b';

      var t = translations[currentLang];

      // Update hero section
      var heroBadge = document.querySelector('.hero-badge');
      if (heroBadge && !window.pageTranslation && !window.articleTranslation) heroBadge.textContent = t['hero-badge'];
      var heroTitle = document.querySelector('.hero-title');
      if (heroTitle && !window.pageTranslation && !window.articleTranslation) heroTitle.textContent = t['hero-title'];
      var heroSub = document.querySelector('.hero-subtitle');
      if (heroSub && !window.pageTranslation && !window.articleTranslation) heroSub.textContent = t['hero-subtitle'];

      // Update buttons
      var btns = document.querySelectorAll('.hero-cta .btn');
      if (btns[0]) btns[0].textContent = t['btn-browse'];
      if (btns[1]) btns[1].textContent = t['btn-start'];

      // Update search
      var search = document.querySelector('.search-bar input');
      if (search) search.placeholder = t['search-placeholder'];

      // Update filter buttons
      var filterAll = document.querySelector('.filter-btn[data-filter="all"]');
      if (filterAll) filterAll.textContent = t['filter-all'];
      var filterMode = document.querySelector('.filter-btn[data-filter="cat-mode"]');
      if (filterMode) filterMode.textContent = t['filter-mode'];
      var filterOp = document.querySelector('.filter-btn[data-filter="cat-operator"]');
      if (filterOp) filterOp.textContent = t['filter-operator'];
      var filterWep = document.querySelector('.filter-btn[data-filter="cat-weapon"]');
      if (filterWep) filterWep.textContent = t['filter-weapon'];
      var filterMap = document.querySelector('.filter-btn[data-filter="cat-map"]');
      if (filterMap) filterMap.textContent = t['filter-map'];
      var filterEco = document.querySelector('.filter-btn[data-filter="cat-economy"]');
      if (filterEco) filterEco.textContent = t['filter-economy'];
      var filterBeg = document.querySelector('.filter-btn[data-filter="cat-beginner"]');
      if (filterBeg) filterBeg.textContent = t['filter-beginner'];

      // Update nav links
      document.querySelectorAll('.nav-menu a[data-' + currentLang + ']').forEach(function(el) {
        el.textContent = el.getAttribute('data-' + currentLang);
      });

      // Update article card titles and excerpts (Chinese only)
      if (currentLang === 'zh') {
        var cards = document.querySelectorAll('.article-card');
        cards.forEach(function(card, i) {
          var num = i + 1;
          var ct = cardTranslations.zh;
          var titleEl = card.querySelector('.card-title a');
          var excerptEl = card.querySelector('.card-excerpt');
          if (titleEl && ct['card-' + num + '-title']) {
            card.setAttribute('data-en-title', titleEl.textContent);
            titleEl.textContent = ct['card-' + num + '-title'];
          }
          if (excerptEl && ct['card-' + num + '-excerpt']) {
            card.setAttribute('data-en-excerpt', excerptEl.textContent);
            excerptEl.textContent = ct['card-' + num + '-excerpt'];
          }
        });
      } else {
        // Restore English
        var cards = document.querySelectorAll('.article-card');
        cards.forEach(function(card) {
          var titleEl = card.querySelector('.card-title a');
          var excerptEl = card.querySelector('.card-excerpt');
          var enTitle = card.getAttribute('data-en-title');
          var enExcerpt = card.getAttribute('data-en-excerpt');
          if (titleEl && enTitle) titleEl.textContent = enTitle;
          if (excerptEl && enExcerpt) excerptEl.textContent = enExcerpt;
        });
      }

      // --- Article page translation ---
      if (currentLang === 'zh') {
        applyArticleTranslation();
      } else {
        restoreArticleEnglish();
      }

      // --- Category page translation (modes, operators, weapons, maps) ---
      if (window.pageTranslation) {
        var pt = window.pageTranslation;

        if (currentLang === 'zh') {
          // Translate hero title
          var heroH1 = document.querySelector('h1');
          if (heroH1 && pt['hero-title']) {
            heroH1.setAttribute('data-en-title', heroH1.textContent);
            heroH1.textContent = pt['hero-title'];
          }
          // Translate hero subtitle (the <p> after h1 in the hero section)
          var heroPs = document.querySelectorAll('main p');
          heroPs.forEach(function(p) {
            if (p.closest('.container') || p.style) {
              var text = p.textContent.trim();
              if (text.length > 30 && text.length < 300) {
                p.setAttribute('data-en-text', text);
              }
            }
          });
          // Set subtitle
          if (heroPs.length > 0 && pt['hero-subtitle']) {
            heroPs[0].setAttribute('data-en-text', heroPs[0].textContent);
            heroPs[0].textContent = pt['hero-subtitle'];
          }
          // Translate section headings
          if (pt.sections) {
            document.querySelectorAll('h2, h3').forEach(function(h) {
              var enText = h.textContent.trim();
              h.setAttribute('data-en-text', enText);
              for (var en in pt.sections) {
                if (enText.toLowerCase().indexOf(en.toLowerCase()) !== -1) {
                  h.textContent = pt.sections[en];
                  break;
                }
              }
            });
          }
          // Translate paragraph content
          if (pt.paragraphs) {
            document.querySelectorAll('p').forEach(function(p) {
              var enText = p.textContent.trim();
              if (enText.length < 15) return;
              p.setAttribute('data-en-text', enText);
              for (var enKey in pt.paragraphs) {
                if (enText.indexOf(enKey) !== -1) {
                  p.textContent = pt.paragraphs[enKey];
                  break;
                }
              }
            });
          }
          // Translate table headers
          document.querySelectorAll('th').forEach(function(th) {
            var enText = th.textContent.trim();
            th.setAttribute('data-en-text', enText);
            var zhMap = {
              'Weapon': '武器', 'Type': '类型', 'Budget': '预算',
              'Core Strength': '核心优势', 'Tier': '等级', 'Map': '地图',
              'Difficulty': '难度', 'Key Feature': '关键特征', 'Best For': '最适合',
              'Operator': '干员', 'Role': '角色', 'Best Maps': '最佳地图'
            };
            if (zhMap[enText]) th.textContent = zhMap[enText];
          });
          // Translate card titles and excerpts
          document.querySelectorAll('.card-title').forEach(function(t) {
            t.setAttribute('data-en-text', t.textContent);
          });
          document.querySelectorAll('.card-excerpt').forEach(function(e) {
            e.setAttribute('data-en-text', e.textContent);
          });
          // Translate category badges
          var badgeMap = {
            'Game Mode': '模式', 'Tier List': '排行', 'Builds': '改装',
            'Map': '地图', 'Operator': '干员', 'Overview': '概览',
            'Economy': '经济', 'Beginner': '新手', 'Weapons': '武器'
          };
          document.querySelectorAll('.card-category').forEach(function(b) {
            var enText = b.textContent.trim();
            b.setAttribute('data-en-text', enText);
            if (badgeMap[enText]) b.textContent = badgeMap[enText];
          });
        } else {
          // Restore English
          var heroH1 = document.querySelector('h1');
          if (heroH1) {
            var en = heroH1.getAttribute('data-en-title');
            if (en) heroH1.textContent = en;
          }
          document.querySelectorAll('[data-en-text]').forEach(function(el) {
            el.textContent = el.getAttribute('data-en-text');
            el.removeAttribute('data-en-text');
          });
        }
      }
    });
  }


// Footer translation
if (currentLang === 'zh') {
  document.querySelectorAll('.footer-bottom span').forEach(function(s) {
    var enText = s.textContent.trim();
    s.setAttribute('data-en-text', enText);
    if (enText.indexOf('Fan site') !== -1) {
      s.textContent = '© 2026 三角洲行动攻略站。粉丝站点——与Team Jade或Garena无关。';
    }
    if (enText.indexOf('Built for') !== -1) {
      s.textContent = '为玩家社区而生。';
    }
    if (enText.indexOf('Last updated') !== -1) {
      s.textContent = '最后更新：2026年7月24日';
    }
  });
  // Translate footer headings
  document.querySelectorAll('.footer-heading').forEach(function(h) {
    h.setAttribute('data-en-text', h.textContent);
    var zhMap = {'Guide Links':'攻略链接','Categories':'分类','Legal':'法律信息'};
    if (zhMap[h.textContent.trim()]) h.textContent = zhMap[h.textContent.trim()];
  });
  // Translate footer links
  document.querySelectorAll('.footer-links a').forEach(function(a) {
    a.setAttribute('data-en-text', a.textContent);
    var zhMap = {
      'Complete Guide':'完全攻略','Havoc Extraction':'烽火地带','All-Out Warfare':'全面战场',
      'Red Wolf Guide':'红狼攻略','Weilong Guide':'威龙攻略','Weapon Tier List':'武器排行',
      'Budget Builds':'平民改装','Economy Guide':'经济攻略',
      'Game Modes':'游戏模式','Operators':'干员','Weapons':'武器','Maps':'地图','Economy':'经济','Beginner':'新手',
      'About':'关于','Privacy Policy':'隐私政策','Contact':'联系'
    };
    if (zhMap[a.textContent.trim()]) a.textContent = zhMap[a.textContent.trim()];
  });
} else {
  // Restore English
  document.querySelectorAll('.footer-bottom span[data-en-text], .footer-heading[data-en-text], .footer-links a[data-en-text]').forEach(function(el) {
    el.textContent = el.getAttribute('data-en-text');
    el.removeAttribute('data-en-text');
  });
}

  // --- Auto-apply saved language on page load ---
  if (langToggle && currentLang === 'zh') {
    // Update toggle button appearance
    langToggle.textContent = '中 / EN';
    langToggle.style.background = 'rgba(239, 68, 68, 0.15)';
    langToggle.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    langToggle.style.color = '#ef4444';

    // Apply translations (same logic as click handler)
    var t = translations.zh;

    // Nav links
    document.querySelectorAll('.nav-menu a[data-zh]').forEach(function(el) {
      el.textContent = el.getAttribute('data-zh');
    });

    // Homepage elements
    var heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) heroBadge.textContent = t['hero-badge'];
    // Only apply homepage hero title if NOT on a category/article page
    var heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !window.pageTranslation && !window.articleTranslation) {
      heroTitle.textContent = t['hero-title'];
    }
    var heroSub = document.querySelector('.hero-subtitle');
    if (heroSub && !window.pageTranslation && !window.articleTranslation) {
      heroSub.textContent = t['hero-subtitle'];
    }
    var btns = document.querySelectorAll('.hero-cta .btn');
    if (btns[0]) btns[0].textContent = t['btn-browse'];
    if (btns[1]) btns[1].textContent = t['btn-start'];
    var search = document.querySelector('.search-bar input');
    if (search) search.placeholder = t['search-placeholder'];

    // Filter buttons
    var filterMap = {all:'filter-all','cat-mode':'filter-mode','cat-operator':'filter-operator','cat-weapon':'filter-weapon','cat-map':'filter-map','cat-economy':'filter-economy','cat-beginner':'filter-beginner'};
    for (var filter in filterMap) {
      var btn = document.querySelector('.filter-btn[data-filter="' + filter + '"]');
      if (btn && t[filterMap[filter]]) btn.textContent = t[filterMap[filter]];
    }

    // Homepage card translations
    if (cardTranslations.zh) {
      var cards = document.querySelectorAll('.article-card');
      cards.forEach(function(card, i) {
        var num = i + 1;
        var ct = cardTranslations.zh;
        var titleEl = card.querySelector('.card-title a');
        var excerptEl = card.querySelector('.card-excerpt');
        if (titleEl && ct['card-' + num + '-title']) {
          card.setAttribute('data-en-title', titleEl.textContent);
          titleEl.textContent = ct['card-' + num + '-title'];
        }
        if (excerptEl && ct['card-' + num + '-excerpt']) {
          card.setAttribute('data-en-excerpt', excerptEl.textContent);
          excerptEl.textContent = ct['card-' + num + '-excerpt'];
        }
      });
    }

    // Article page translation
    applyArticleTranslation();

    // Category page translation
    if (window.pageTranslation) {
      var pt = window.pageTranslation;
      var heroH1 = document.querySelector('h1');
      if (heroH1 && pt['hero-title']) {
        heroH1.setAttribute('data-en-title', heroH1.textContent);
        heroH1.textContent = pt['hero-title'];
      }
      var heroPs = document.querySelectorAll('main p');
      if (heroPs.length > 0 && pt['hero-subtitle']) {
        heroPs[0].setAttribute('data-en-text', heroPs[0].textContent);
        heroPs[0].textContent = pt['hero-subtitle'];
      }
      if (pt.sections) {
        document.querySelectorAll('h2, h3').forEach(function(h) {
          var enText = h.textContent.trim();
          h.setAttribute('data-en-text', enText);
          for (var en in pt.sections) {
            if (enText.toLowerCase().indexOf(en.toLowerCase()) !== -1) {
              h.textContent = pt.sections[en];
              break;
            }
          }
        });
      }
      // Translate paragraph content
      if (pt.paragraphs) {
        document.querySelectorAll('p').forEach(function(p) {
          var enText = p.textContent.trim();
          if (enText.length < 15) return;
          p.setAttribute('data-en-text', enText);
          for (var enKey in pt.paragraphs) {
            if (enText.indexOf(enKey) !== -1) {
              p.textContent = pt.paragraphs[enKey];
              break;
            }
          }
        });
      }
      // Translate table headers
      var zhTableMap = {'Weapon':'武器','Type':'类型','Budget':'预算','Core Strength':'核心优势','Tier':'等级','Map':'地图','Difficulty':'难度','Key Feature':'关键特征','Best For':'最适合','Operator':'干员','Role':'角色','Best Maps':'最佳地图'};
      document.querySelectorAll('th').forEach(function(th) {
        var enText = th.textContent.trim();
        th.setAttribute('data-en-text', enText);
        if (zhTableMap[enText]) th.textContent = zhTableMap[enText];
      });
      // Translate category badges
      var badgeMap = {'Game Mode':'模式','Tier List':'排行','Builds':'改装','Map':'地图','Operator':'干员','Overview':'概览','Economy':'经济','Beginner':'新手','Weapons':'武器'};
      document.querySelectorAll('.card-category').forEach(function(b) {
        var enText = b.textContent.trim();
        b.setAttribute('data-en-text', enText);
        if (badgeMap[enText]) b.textContent = badgeMap[enText];
      });
    }
  }
  const tocLinks = document.querySelectorAll('.toc-link');
  if (tocLinks.length > 0) {
    const sections = [];
    tocLinks.forEach(function(link) {
      const id = link.getAttribute('href').replace('#', '');
      const section = document.getElementById(id);
      if (section) sections.push({ el: section, link: link });
    });

    function updateTOC() {
      const scrollPos = window.scrollY + 150;
      let activeIdx = 0;
      sections.forEach(function(s, i) {
        if (s.el.offsetTop <= scrollPos) activeIdx = i;
      });
      tocLinks.forEach(function(l) { l.classList.remove('active'); });
      if (sections[activeIdx]) sections[activeIdx].link.classList.add('active');
    }

    window.addEventListener('scroll', updateTOC, { passive: true });
    updateTOC();
  }

  // --- Copy share codes ---
  document.querySelectorAll('.share-code').forEach(function(el) {
    el.addEventListener('click', function() {
      const code = this.textContent.trim();
      navigator.clipboard.writeText(code).then(function() {
        el.style.borderColor = '#10b981';
        el.title = 'Copied!';
        setTimeout(function() {
          el.style.borderColor = '';
          el.title = 'Click to copy';
        }, 2000);
      });
    });
    el.title = 'Click to copy';
    el.style.cursor = 'pointer';
  });

  // --- Intersection Observer for animations ---
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.article-card, .operator-card, .callout').forEach(function(el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      observer.observe(el);
    });
  }

  // --- Breadcrumb structured data injection ---
  function injectBreadcrumbSchema() {
    const breadcrumbs = document.querySelectorAll('.breadcrumb a, .breadcrumb span');
    if (breadcrumbs.length < 2) return;

    var items = [];
    breadcrumbs.forEach(function(crumb, i) {
      items.push({
        "@type": "ListItem",
        "position": i + 1,
        "name": crumb.textContent.trim(),
        "item": crumb.href || window.location.href
      });
    });

    var schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items
    };

    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  injectBreadcrumbSchema();

  // --- Lazy load images ---
  if ('IntersectionObserver' in window) {
    var imgObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(function(img) {
      imgObserver.observe(img);
    });
  }

})();
