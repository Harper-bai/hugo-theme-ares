---
title: 搭建你的 Ares 博客
date: 2026-11-18T10:30:00+08:00
description: 从本地预览到独立站点，完成 Ares 安装、配置、写作与静态构建。
tags: [Ares, Hugo, 入门]
categories: [使用指南]
---
<!--
[INPUT]: Hugo 命令、完整示例配置与主题安装路径。
[OUTPUT]: 从本地预览到独立站点的操作指南。
[POS]: 入门文章；与 notes.en.md 构成翻译集合。
[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
-->

从一个能打开的页面开始，再逐步换成自己的标题、内容和域名。这篇指南带你预览 Ares，建立独立的 Hugo 站点，并生成可以部署的静态文件。

<!--more-->

## 先确认 Hugo 版本

安装 [Hugo](https://gohugo.io/installation/) 0.158.0 或更新版本后，在终端执行 `hugo version`。普通版即可，主题运行不需要 Node.js。

如果只是想看看主题效果，先把主题仓库下载到本地：

```sh {title="预览示例站"}
git clone https://github.com/Harper-bai/hugo-theme-ares.git
cd hugo-theme-ares
hugo server --source exampleSite
```

打开终端显示的地址，通常是 `http://localhost:1313/`。修改 `exampleSite/content/` 中的文章并保存，浏览器就能看到变化。这个目录是演示站，适合先熟悉主题。

## 建立自己的站点

准备正式使用时，在你存放项目的目录中建立新站点。下面的命令将主题放到 `themes/ares/`，并复制一份完整配置：

```sh {title="创建独立站点"}
hugo new site my-blog
cd my-blog
git init
git submodule add https://github.com/Harper-bai/hugo-theme-ares.git themes/ares
cp themes/ares/exampleSite/hugo.toml hugo.toml
```

编辑新站点的 `hugo.toml`，先改这四项：

```toml {title="hugo.toml"}
baseURL = "https://example.com/"
title = "我的博客"
theme = "ares"
themesDir = "themes"
```

再把 `params.author` 和 `params.description` 换成自己的信息。示例配置已经声明搜索索引、RSS 和 Markdown 渲染选项，请保留这些配置。只设置 `theme` 不会自动启用全部站点输出。

复制示例内容，可以一次获得文章、归档、关于和友链页面：

```sh {title="复制页面并启动"}
cp -R themes/ares/exampleSite/content/. content/
hugo server
```

示例每页显示两篇文章，方便体验分页。自己的站点可以调整 `[pagination]` 中的 `pagerSize`。

## 换成第一篇自己的文章

文章放在 `content/posts/`。默认中文文件使用 `.zh.md` 后缀，例如 `first-note.zh.md`。在文件顶部填写标题和日期，在正文中用 `<!--more-->` 分开首页摘要与全文。完整示例见[写作指南]({{< relref "design.zh.md" >}})。

需要英文译文时，新建同名的 `first-note.en.md`；日文使用 `.ja.md`。不需要多语言时，可以在配置中只保留所用语言，再删除其他语言的示例内容。

先完成并检查自己的内容，再删除不需要的演示文章。关于页和友链卡片也要替换为自己的信息；友链卡片在 `params.friend_links` 中配置。

## 预览通过，再生成静态文件

发布前检查文章标题、日期、导航和手机阅读效果。草稿可设置 `draft: true`，在本地使用 `hugo server -D` 预览，正常构建不会发布它们。

在自己的博客目录执行：

```sh {title="生成发布文件"}
hugo --minify
```

生成结果位于 `public/`。如果是在主题仓库中构建演示站，则使用 `hugo --source exampleSite --minify`，结果位于 `exampleSite/public/`。

将生成目录交给静态托管服务即可。使用 `https://example.com/blog/` 这样的子目录地址时，先把完整路径写入 `baseURL`，再重新构建。修改配置后检查一次导航、图片和搜索，确保发布地址与预览一致。
