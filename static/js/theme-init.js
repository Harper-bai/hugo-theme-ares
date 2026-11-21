/**
 * [INPUT]: 浏览器主题偏好与 localStorage 中的 theme。
 * [OUTPUT]: 在首次绘制前设置根元素主题。
 * [POS]: head 中同步运行；ares.js 负责后续交互。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
(() => {
  let saved;
  try { saved = localStorage.getItem('theme'); } catch { /* 存储受限时使用系统偏好。 */ }
  const theme = ['light', 'dark'].includes(saved)
    ? saved
    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
