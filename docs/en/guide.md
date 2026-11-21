<!--
[INPUT]: 当前 Hugo 主题实现与示例配置。
[OUTPUT]: 英文文章、页面、代码与原生折叠使用说明。
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

## Article typography

Articles use 18–20px body text with a line height of 1.75. Serif headings decrease in size by level. Paragraphs, lists, quotations, and tables share a spacing rhythm. Mobile articles have side gutters, and long headings can use the full text width. Heading anchors appear on hover or keyboard focus.

Source Serif 4 is bundled locally for Latin headings and Arabic numerals in dates, years, lists, and prose. CJK headings use system serif fonts. Body letters and CJK text retain their sans-serif fonts. Code, line numbers, and inline code use JetBrains Mono. Numbers need no special markup or script.

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
