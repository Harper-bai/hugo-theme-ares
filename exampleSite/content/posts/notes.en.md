---
title: Build your Ares blog
date: 2026-11-18T10:30:00+08:00
description: Preview Ares, create an independent Hugo site, and build the files for publishing.
tags: [Ares, Hugo, Getting started]
categories: [Guides]
---
<!--
[INPUT]: Hugo 命令、示例配置与主题安装路径。
[OUTPUT]: 英文预览、安装、内容与发布指南。
[POS]: notes 中文入门文章的英文译文。
[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
-->

Start with a page you can open, then make it your own. This guide walks through previewing Ares, creating an independent Hugo site, and generating the static files you can publish.

<!--more-->

## Check your Hugo version

Install [Hugo](https://gohugo.io/installation/) 0.158.0 or later and run `hugo version` to confirm. The standard edition is enough. Site builds do not require Node.js.

To try the theme first, clone the repository and start the example site:

```sh {title="Preview the example"}
git clone https://github.com/Harper-bai/hugo-theme-ares.git
cd hugo-theme-ares
hugo server --source exampleSite
```

Open the address printed by Hugo, usually `http://localhost:1313/`. Edit an article in `exampleSite/content/` and save it to see the preview update.

## Create your own site

Run these commands from the directory where you keep your projects. They create a new blog, install Ares in `themes/ares/`, and copy its complete example configuration:

```sh {title="Create an independent site"}
hugo new site my-blog
cd my-blog
git init
git submodule add https://github.com/Harper-bai/hugo-theme-ares.git themes/ares
cp themes/ares/exampleSite/hugo.toml hugo.toml
```

Edit these four settings in the new site's `hugo.toml`:

```toml {title="hugo.toml"}
baseURL = "https://example.com/"
title = "My blog"
theme = "ares"
themesDir = "themes"
```

Update `params.author` and `params.description` as well. Keep the search output, RSS, and Markdown rendering settings from the example. Selecting a theme alone does not enable every site output.

Copy the sample content to get posts, archives, about pages, and blogrolls:

```sh {title="Copy the content and preview"}
cp -R themes/ares/exampleSite/content/. content/
hugo server
```

The example uses two posts per page so pagination is easy to try. Change `pagerSize` under `[pagination]` to suit your blog.

## Write the first post

Posts live in `content/posts/`. The example uses `.zh.md`, `.en.md`, and `.ja.md` language suffixes. Save an English article as `first-note.en.md` and give its translations the same base name. If you only need one language, keep that language in the configuration and remove the other sample content.

Set the title and date in the front matter. Put `<!--more-->` between the homepage introduction and the rest of the article. Short posts can omit the separator to appear in full on the homepage.

Replace the about text and the `params.friend_links` cards with your own information. Remove the demonstration posts once your own content is ready. For unfinished posts, set `draft: true` and preview with `hugo server -D`; normal builds exclude them.

## Build the files for publishing

Check titles, dates, navigation, and the mobile layout before publishing. Run this command from your own site's root:

```sh {title="Build the site"}
hugo --minify
```

The output goes to `public/`. To build the demonstration site from the theme repository instead, run `hugo --source exampleSite --minify`; its output goes to `exampleSite/public/`.

Publish the generated directory with your static hosting service. If the site lives under a path such as `https://example.com/blog/`, set the full address in `baseURL` before rebuilding. Check navigation, images, and search once the publishing address is set.
