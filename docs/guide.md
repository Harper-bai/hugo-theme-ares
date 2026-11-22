<!--
[INPUT]: 当前 Hugo 主题实现与示例配置。
[OUTPUT]: 内容、主题配色、阅读排版、首屏字体与代码说明。
[POS]: 项目文档；参数与命令必须随实现更新。
[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
-->

# 使用说明

主题支持 Hugo 0.158.0 及更新版本。示例站位于 `exampleSite/`，完整站点配置必须从该目录复制或按配置说明建立。

## 文章与摘要

文章放在 `content/posts/`。中文、英文、日文的文件后缀分别为 `.zh.md`、`.en.md`、`.ja.md`。同名文件自动构成翻译集合。

```yaml
---
title: 一篇文章
date: 2026-11-20T09:00:00+08:00
description: 搜索引擎使用的描述。
tags: [Hugo, 生活]
categories: [技术]
---
```

正文中的 `<!--more-->` 之前是首页摘要，也支持带空格的 `<!-- more -->` 写法。有分隔符时显示阅读全文链接；没有分隔符时，首页显示完整正文。`draft: true` 的文章不会进入正常构建。

文章标题优先使用 front matter 的 `title`。描述优先使用 `description`，其次使用正文摘要。首页与列表使用站点的 `params.description`。

翻译文件可设置相同的 `translationKey`，以关联不同文件名的文章。语言切换优先进入当前页面的译文；缺少译文时进入目标语言首页。

## 配色与正文排版

浅色配色参考 [x7aNote](https://github.com/Xeonzilla/x7aNote)。暖纸色背景搭配炭灰正文和深青绿链接。暗色使用炭黑背景、暖灰正文和浅青绿链接。导航、表格、分页与代码高亮共用主题颜色。主题默认跟随系统，也可手动切换并保存选择。

正文使用 18–20px 字号和 1.75 倍行距。标题使用衬线字体，二级、三级和四级标题逐级缩小。段落、列表、引用与表格使用统一间距。手机正文两侧保留留白，长标题可使用完整行宽。标题锚点在悬停或键盘聚焦时显示。

表格内容默认水平、垂直居中。Markdown 分隔行中的 `:---`、`:---:`、`---:` 分别指定左对齐、居中和右对齐。

Source Serif 4 随主题本地提供。它用于西文标题，以及日期、年份、列表和正文中的阿拉伯数字；中文标题使用系统宋体或思源宋体。中文正文优先使用本机无衬线字体。代码块、行号和行内代码使用本机等宽字体。无需在文章中为数字添加标签或脚本。

首屏预加载 Open Sans 正常字重与 Source Serif 4。下载字体使用 `font-display: optional`。若字体未赶上首屏，本页继续使用本机字体，避免阅读中途替换字形。数字回退到本机衬线字体。Noto Sans SC 仅补充本机缺失的汉字。原有 JetBrains Mono 资源与授权继续保留，供自定义字体栈使用。

## 归档

创建 `content/archives/_index.zh.md`：

```yaml
---
title: 归档
layout: archives
---
```

归档是分区首页，支持 Hugo 分页。主题按年份倒序排列文章。同样建立 `_index.en.md` 与 `_index.ja.md`，即可提供其他语言的归档。

分类和标签页由 Hugo 自动生成，无需手工创建索引文件。目录显示首字母分组与文章计数，详情按年份列出文章。需要自定义标题时可创建对应 taxonomy 的 `_index.zh.md`。

## 关于与友链

关于页使用 `content/about.zh.md`，写普通 Markdown 即可。

友链页使用 `content/friends.zh.md`：

```yaml
---
title: 友情链接
layout: friends
---
```

front matter 之后的内容显示在卡片之前。卡片来自站点配置的 `params.friend_links`，只显示 `lang` 与当前语言一致的条目。

## 代码

使用标准围栏代码块。代码由 Hugo 内建的 Chroma 高亮，主题提供行号、文件名和复制按钮。

````markdown
```go {title="hello.go" hl_lines=[2]}
package main
import "fmt"
```
````

可使用 `title` 指定文件名。`hl_lines` 使用 Hugo 标准行号列表。默认显示行号；设置 `linenos=false` 可隐藏行号。使用 `source` 和 `source_text` 可提供代码来源链接。

代码工具栏提供复制、展开和折叠按钮。复制只包含代码，不包含行号。较长的代码显示折叠按钮。

## Markdown 和 HTML

支持表格、引用、列表、图片和原生 HTML。显示 HTML 区块需要在站点配置中设置 `markup.goldmark.renderer.unsafe = true`。

```html
<details>
<summary>点击展开</summary>

<p>这里是补充内容。</p>

</details>

<div class="danger"><p>这是一段提醒。</p></div>
```

折叠区块适合放置补充说明。区块内使用 Markdown 段落时，在 HTML 标签与段落之间留出空行。

图片可使用 Hugo 页面 bundle 的相对地址，也可引用 `static/` 中的资源。主题会为站点根路径图片补上 `baseURL` 的子目录。

## 数学公式

设置 `params.math = true` 后加载 MathJax。使用 `\( ... \)`、`\[ ... \]` 或 `$$ ... $$`。单篇文章可通过 `math: false` 关闭。

MathJax 从 jsDelivr 加载。示例站默认关闭数学公式，基础页面完全使用本地资源。主题不内置 Mermaid；需要流程图时，可自行添加 Hugo shortcode 或使用图片。

## 其他文章参数

- `from`：显示翻译原文链接。
- `entry: true`：为文章增加 h-entry 微格式。
- `in_reply_to`：显示回复目标地址。
- `comments: false`：关闭当前文章评论。
- `search: false`：不将当前页面放入搜索索引。

明暗主题会跟随系统设置。手动选择保存在浏览器本地。返回顶部按钮在向下滚动后显示。移动菜单与正文折叠区块使用原生 HTML 控件。
