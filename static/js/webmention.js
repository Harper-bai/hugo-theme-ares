/**
 * [INPUT]: 评论容器中的永久链接与 Webmention.io 公开 JSON。
 * [OUTPUT]: 原版类名下的评论作者、正文、日期与来源。
 * [POS]: 可选客户端评论入口；不把远程 HTML 注入页面。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
(() => {
  const safeURL = value => {
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  };
  const plainText = value => {
    const doc = new DOMParser().parseFromString(String(value || ''), 'text/html');
    return doc.body.textContent || '';
  };
  const link = (className, label, href) => {
    const node = document.createElement(safeURL(href) ? 'a' : 'span');
    node.className = className;
    node.textContent = label;
    if (node.tagName === 'A') { node.href = safeURL(href); node.target = '_blank'; node.rel = 'noopener noreferrer ugc'; }
    return node;
  };
  document.querySelectorAll('.webmention-section[data-full-url]').forEach(async container => {
    const list = container.querySelector('.webmention-list');
    const status = container.querySelector('.webmention-status');
    try {
      const response = await fetch('https://webmention.io/api/mentions.jf2?target=' + encodeURIComponent(container.dataset.fullUrl));
      if (!response.ok) throw new Error(String(response.status));
      const data = await response.json();
      const mentions = (data.children || []).sort((a, b) => new Date(a['wm-received']) - new Date(b['wm-received']));
      for (const mention of mentions) {
        const item = document.createElement('div');
        item.className = 'webmention-item webmention-dynamic';
        const author = document.createElement('div');
        author.className = 'webmention-author';
        if (safeURL(mention.author?.photo)) {
          const image = document.createElement('img');
          image.className = 'webmention-author-photo';
          image.src = safeURL(mention.author.photo);
          image.alt = mention.author.name || container.dataset.anonymous;
          image.loading = 'lazy';
          author.append(image);
        }
        author.append(link('webmention-author-name', mention.author?.name || container.dataset.anonymous, mention.author?.url));
        const date = document.createElement('span');
        date.className = 'webmention-date';
        const published = new Date(mention.published || mention['wm-received']);
        date.textContent = Number.isNaN(published.getTime()) ? '' : published.toLocaleDateString(document.documentElement.lang);
        author.append(date);
        const content = document.createElement('div');
        content.className = 'webmention-content';
        const source = Array.isArray(mention.content) ? mention.content[0] : mention.content;
        const text = source?.text || plainText(source?.html);
        content.textContent = text.length > 200 ? text.slice(0, 200) + '…' : text;
        const meta = document.createElement('div');
        meta.className = 'webmention-meta';
        meta.append(link('webmention-source', container.dataset.source, mention['wm-source']));
        item.append(author, content, meta);
        list.append(item);
      }
      container.querySelector('.webmention-count').textContent = String(mentions.length);
      status.textContent = mentions.length ? '' : container.dataset.empty;
    } catch { status.textContent = container.dataset.error; }
  });
})();
