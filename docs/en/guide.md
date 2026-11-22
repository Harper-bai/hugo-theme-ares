<!--
[INPUT]: 当前 Hugo 主题实现与示例配置。
[OUTPUT]: 英文内容、主题配色、阅读排版、首屏字体与代码说明。
[POS]: 项目文档；参数与命令必须随实现更新。
[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
-->

# Content guide

Store posts in `content/posts/`. Use `.zh.md`, `.en.md`, and `.ja.md` suffixes for the languages enabled in the example configuration. Matching filenames form translation groups. Different filenames can share a `translationKey`.

```yaml
---
title: Hello, Ares
date: 2026-11-20T09:00:00+08:00
description: A place for new ideas.
tags: [Hugo]
categories: [Technology]
---
```

Place `<!--more-->` between the homepage summary and the rest of the article. The spaced form, `<!-- more -->`, is also supported. Without a separator, the homepage displays the full article. Drafts are excluded from normal builds, search, and RSS.

## Colors and article typography

The light palette takes inspiration from [x7aNote](https://github.com/Xeonzilla/x7aNote): warm paper, charcoal text, and deep teal links. Dark mode uses a charcoal background, warm gray text, and pale teal links. Navigation, tables, pagination, and syntax highlighting share theme colors. The theme follows the system preference and remembers a manual choice.

Articles use 18–20px body text with a line height of 1.75. Serif headings decrease in size by level. Paragraphs, lists, quotations, and tables share a spacing rhythm. Mobile articles have side gutters, and long headings can use the full text width. Heading anchors appear on hover or keyboard focus.

Table cells default to horizontal and vertical centering. Use `:---`, `:---:`, or `---:` in the Markdown separator row to set left, center, or right alignment.

Source Serif 4 is bundled locally for Latin headings and Arabic numerals in dates, years, lists, and prose. CJK headings use system serif fonts. Chinese body text uses only system sans-serif fonts, such as PingFang, Microsoft YaHei, or a locally installed Noto Sans CJK. The theme does not download Chinese fonts, so Chinese glyphs vary by operating system. Code blocks, line numbers, and inline code use system monospace fonts. Numbers need no special markup or script.

Open Sans regular and Source Serif 4 are preloaded. Downloaded fonts use `font-display: optional`. If a font misses the first render, the page keeps its system fallback to prevent a visible font swap during reading. Numerals fall back to a system serif font. The original JetBrains Mono assets and licenses remain available for custom font stacks.

## Pages and code

Create `content/archives/_index.en.md` with `layout: archives`. The archive must be a section page to support Hugo pagination. Tags and categories are generated automatically. Create `content/friends.en.md` with `layout: friends` for the blogroll. Define cards in `params.friend_links` with `lang = "en"`.

Fenced code blocks support Hugo attributes:

````markdown
```go {title="hello.go" hl_lines=[2]}
package main
import "fmt"
```
````

The code toolbar offers copying and folding. Copying excludes line numbers. Optional attributes include `source`, `source_text`, and `linenos=false`.

Use native HTML `details` for expandable sections and `div.danger` for notices. Keep blank lines between HTML tags and Markdown paragraphs inside expandable sections. Keep `markup.goldmark.renderer.unsafe = true` if using these blocks. Page-bundle images and root-relative static images are supported, including subdirectory deployments.

Set `params.math = true` for MathJax, using `\( ... \)`, `\[ ... \]`, or `$$ ... $$`. A page can override this with `math: false`.

Optional post fields include `from` for an original-source badge, `entry: true` for h-entry microformats, `in_reply_to`, `comments: false`, and `search: false`.

Mermaid is not bundled with the theme. Add your own Hugo shortcode or use an image for diagrams. To keep a specific article address, set its `url` explicitly or configure Hugo permalinks and aliases.
