/**
 * [INPUT]: 原版页面类名、脚本 data 翻译与浏览器原生能力。
 * [OUTPUT]: 主题切换、代码复制和折叠、返回顶部交互。
 * [POS]: 全站基础交互入口；搜索与评论各自加载。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
(() => {
  const labels = document.currentScript.dataset;
  const root = document.documentElement;
  const wrapper = document.getElementById('page-wrapper');
  const toggle = document.querySelector('.theme-toggle');

  // ---- 主题 ----
  const setTheme = (theme, persist = false) => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (wrapper) wrapper.dataset.theme = theme;
    if (toggle) toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    if (persist) {
      try { localStorage.setItem('theme', theme); } catch { /* 当前页面仍然可以切换主题。 */ }
    }
  };
  setTheme(root.dataset.theme || 'light');
  toggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    let saved;
    try { saved = localStorage.getItem('theme'); } catch { /* 无持久偏好时跟随系统。 */ }
    if (!['light', 'dark'].includes(saved)) setTheme(event.matches ? 'dark' : 'light');
  });

  // ---- 代码工具 ----
  document.querySelectorAll('figure.highlight').forEach(block => {
    const code = block.querySelector('.code pre');
    if (!code) return;
    const caption = block.querySelector('figcaption') || block.insertBefore(document.createElement('figcaption'), block.firstChild);
    const info = document.createElement('div');
    info.className = 'info';
    const filename = caption.querySelector('span');
    if (filename) { filename.className = 'filename'; info.append(filename); }
    const language = document.createElement('span');
    language.className = 'lang-name';
    language.textContent = block.dataset.language || block.classList[1] || 'text';
    info.append(language);
    const source = caption.querySelector('a');
    if (source) { source.className = 'source-link'; info.append(source); }
    const actions = document.createElement('div');
    actions.className = 'actions';
    if (block.scrollHeight > 300) {
      const fold = document.createElement('button');
      fold.type = 'button';
      const updateFold = folded => {
        block.classList.toggle('folded', folded);
        block.style.maxHeight = folded ? '600px' : '';
        block.style.overflowY = folded ? 'hidden' : '';
        fold.textContent = folded ? labels.expand : labels.fold;
        fold.setAttribute('aria-expanded', String(!folded));
      };
      updateFold(true);
      fold.addEventListener('click', () => updateFold(!block.classList.contains('folded')));
      actions.append(fold);
    }
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.textContent = labels.copy;
    let reset;
    copy.addEventListener('click', async () => {
      clearTimeout(reset);
      try {
        await navigator.clipboard.writeText(code.textContent.replace(/\n$/, ''));
        copy.textContent = labels.copied;
        copy.classList.add('copied');
      } catch {
        copy.textContent = labels.copyFailed;
      }
      reset = setTimeout(() => {
        copy.textContent = labels.copy;
        copy.classList.remove('copied');
      }, 3000);
    });
    actions.append(copy);
    caption.replaceChildren(info, actions);
  });

  // ---- 返回顶部 ----
  const back = document.querySelector('.back-to-top');
  if (back) {
    let pending = false;
    const update = () => { back.classList.toggle('is-visible', window.scrollY > 200); pending = false; };
    window.addEventListener('scroll', () => {
      if (!pending) { pending = true; requestAnimationFrame(update); }
    }, { passive: true });
    back.addEventListener('click', event => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
    update();
  }
})();
