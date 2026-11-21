/**
 * [INPUT]: 搜索弹窗配置与 Hugo 生成的当前语言 JSON 索引。
 * [OUTPUT]: 按关键字评分的搜索结果与弹窗交互。
 * [POS]: 搜索独立入口；用文本节点构造结果，避免注入 HTML。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
(() => {
  const dialog = document.getElementById('search-dialog');
  const toggle = document.querySelector('.search-toggle');
  if (!dialog || !toggle) return;
  const input = dialog.querySelector('#search-input');
  const list = dialog.querySelector('.search-results__list');
  const loading = dialog.querySelector('.search-results__loading');
  const empty = dialog.querySelector('.search-results__empty');
  const limit = Math.max(1, Number(dialog.dataset.limit) || 50);
  let indexPromise;
  let revision = 0;
  let timer;

  const loadIndex = () => {
    if (!indexPromise) {
      indexPromise = fetch(dialog.dataset.index)
        .then(response => {
          if (!response.ok) throw new Error(String(response.status));
          return response.json();
        })
        .catch(error => { indexPromise = undefined; throw error; });
    }
    return indexPromise;
  };
  const reset = () => {
    revision++;
    clearTimeout(timer);
    list.replaceChildren();
    loading.hidden = true;
    empty.hidden = true;
  };
  const highlight = (node, text, keywords) => {
    const pattern = keywords.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const matcher = new RegExp(pattern, 'gi');
    let cursor = 0;
    for (const match of text.matchAll(matcher)) {
      node.append(document.createTextNode(text.slice(cursor, match.index)));
      const mark = document.createElement('mark');
      mark.className = 'search-keyword';
      mark.textContent = match[0];
      node.append(mark);
      cursor = match.index + match[0].length;
    }
    node.append(document.createTextNode(text.slice(cursor)));
  };
  const renderResult = (result, keywords) => {
    let url;
    try { url = new URL(result.url, window.location.href); } catch { return; }
    if (url.origin !== window.location.origin || !['http:', 'https:'].includes(url.protocol)) return;
    const article = document.createElement('article');
    article.className = 'search-result-item';
    const heading = document.createElement('h3');
    heading.className = 'search-result-item__title';
    const link = document.createElement('a');
    link.href = url.href;
    link.title = result.title;
    highlight(link, result.title, keywords);
    heading.append(link);
    const excerpt = document.createElement('p');
    excerpt.className = 'search-result-item__excerpt';
    const text = result.content || '';
    const positions = keywords.map(word => text.toLowerCase().indexOf(word)).filter(position => position >= 0);
    const start = Math.max(0, (positions.length ? Math.min(...positions) : 0) - 50);
    const snippet = (start ? '...' : '') + text.slice(start, start + 200) + (start + 200 < text.length ? '...' : '');
    highlight(excerpt, snippet, keywords);
    const meta = document.createElement('div');
    meta.className = 'search-result-item__meta';
    meta.textContent = result.url;
    article.append(heading, excerpt, meta);
    list.append(article);
  };
  const search = async () => {
    reset();
    const keywords = [...new Set(input.value.trim().toLowerCase().split(/\s+/).filter(Boolean))];
    if (!keywords.length) return;
    const request = revision;
    loading.hidden = false;
    try {
      const index = await loadIndex();
      if (request !== revision || !dialog.open) return;
      const results = index.map(item => {
        const title = item.title.toLowerCase();
        const content = (item.content || '').toLowerCase();
        const matches = keywords.every(word => title.includes(word) || content.includes(word));
        const score = keywords.reduce((sum, word) => sum + (title.startsWith(word) ? 10 : title.includes(word) ? 5 : 0) + (content.includes(word) ? 1 : 0), 0);
        return { ...item, score: matches ? score : 0 };
      }).filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
      results.forEach(result => renderResult(result, keywords));
      empty.hidden = list.childElementCount > 0;
    } catch {
      if (request !== revision || !dialog.open) return;
      const error = document.createElement('p');
      error.className = 'search-error';
      error.setAttribute('role', 'alert');
      error.textContent = dialog.dataset.error;
      list.append(error);
    } finally {
      if (request === revision) loading.hidden = true;
    }
  };

  toggle.addEventListener('click', () => { dialog.showModal(); input.focus(); });
  dialog.querySelector('.search-dialog__close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); dialog.close(); }
  });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => { reset(); input.value = ''; toggle.focus(); });
  input.addEventListener('input', () => { reset(); timer = setTimeout(search, 150); });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') { event.preventDefault(); clearTimeout(timer); search(); }
  });
})();
