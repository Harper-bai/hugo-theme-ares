<!--
[INPUT]: 当前 Hugo 主题实现与示例配置。
[OUTPUT]: 站点输出、导航、语言、搜索与可选服务的配置说明。
[POS]: 项目文档；参数与命令必须随实现更新。
[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
-->

# 配置说明

站点入口是博客根目录的 `hugo.toml`。主题自身的 `hugo.toml` 提供默认参数和模块挂载规则。请从 `exampleSite/hugo.toml` 复制完整站点配置。

## 必要输出和渲染配置

以下配置属于站点，不能仅依赖主题配置继承：

```toml
[outputs]
  home = ["HTML", "RSS", "SearchIndex"]
  section = ["HTML", "RSS"]
  taxonomy = ["HTML", "RSS"]
  term = ["HTML", "RSS"]

[outputFormats.RSS]
  baseName = "atom"

[outputFormats.SearchIndex]
  mediaType = "application/json"
  baseName = "search"
  isPlainText = true
  notAlternative = true

[markup.goldmark.renderer]
  unsafe = true

[markup.highlight]
  noClasses = false
```

订阅地址为 `atom.xml`，格式为 RSS 2.0。站点每种语言都独立生成订阅和 `search.json`。数学公式的 passthrough 配置见完整示例。

## 常用参数

| 位置 | 默认值 | 用途 |
| --- | --- | --- |
| `baseURL` | 站点提供 | 域名，可含 `/blog/` 子目录 |
| `title` | 站点提供 | 博客名称 |
| `defaultContentLanguage` | `zh`（示例） | 默认语言 |
| `pagination.pagerSize` | `6` | 首页与列表每页最多展示的篇数 |
| `params.mainSections` | `["posts"]` | 首页、归档、搜索和订阅的文章分区 |
| `params.author` | `Ares` | 作者署名 |
| `params.date_format` | `01/02/2006` | 默认月/日/年；使用 Hugo 日期格式 |
| `params.description` | `A blog powered by Hugo` | 默认页面描述 |
| `params.logo` | `favicon.png` | 页头 Logo |
| `params.favicon` | `favicon.png` | 浏览器图标 |
| `params.startyear` | `2025` | 页脚起始年份 |
| `params.enable_image_credit` | `false` | Logo 来源署名 |
| `params.math` | `true` | 加载 MathJax，示例设为 `false` |
| `params.disqus` | 未设置 | Disqus 站点 shortname |
| `params.ga` | 未设置 | Google Analytics 标识 |

自定义图片应放在博客自身的 `static/` 中，无需修改主题文件。主题默认图片路径使用相对形式，如 `logo.png`。

## 导航

```toml
[params.nav.primary]
  links = [{type = "internal", key = "home", path = "/"}]
  buttons = [{type = "component", key = "language", component = "language-switcher"}]

[params.nav.secondary]
  links = [
    {type = "internal", key = "archive", path = "/archives/"},
    {type = "internal", key = "categories", path = "/categories/"},
    {type = "internal", key = "tags", path = "/tags/"},
    {type = "internal", key = "about", path = "/about/"},
    {type = "internal", key = "friends", path = "/friends/"},
    {type = "internal", key = "rss", path = "/atom.xml"},
    {type = "external", key = "github", path = "https://github.com/你的用户名"}
  ]
```

`key` 从语言文件读取文案，也可用 `name` 指定自定义文字。内部地址会映射到当前语言和站点子目录。外部地址在新窗口打开。没有建立的页面应从导航配置删除。

语言按钮由 `primary.buttons` 控制。主题按钮始终显示。搜索按钮跟随 `params.search.enable`。

## 多语言

```toml
defaultContentLanguage = "zh"
defaultContentLanguageInSubdir = false

[languages.zh]
  locale = "zh-CN"
  label = "中文"
  weight = 1
[languages.en]
  locale = "en-US"
  label = "English"
  weight = 2
[languages.ja]
  locale = "ja-JP"
  label = "日本語"
  weight = 3
```

内容后缀应使用对应键名，如 `.zh.md`、`.en.md`、`.ja.md`。只保留一种语言配置即可使用单语言站点；语言切换菜单会自动隐藏。

Hugo 0.158.0 起使用 `locale` 和 `label`。本主题采用这两个新配置名，避免使用已弃用的 `languageCode` 和 `languageName`。

## 搜索

```toml
[params.search]
  enable = true
  field = "post"
  content = true
  limit = 50
```

`field` 支持 `post`、`page`、`all`。`post` 使用 `params.mainSections`；`page` 排除这些文章分区。`content = false` 只索引标题。索引地址由当前语言首页的 `SearchIndex` 输出决定。

搜索在输入后加载当前语言索引，不需要插件或第三方搜索服务。关闭搜索时不显示按钮、弹窗，也不加载搜索脚本。

## 友链

```toml
[[params.friend_links]]
  name = "Hugo"
  url = "https://gohugo.io/"
  description = "静态网站生成器。"
  lang = "zh"
  avatar = "friends/hugo.png"
```

`avatar` 可省略。友链页面需设置 `layout: friends`。

## 评论与分析

设置 `params.disqus` 即可为文章启用 Disqus。设置 `params.ga` 即可加载 Google Analytics。两项默认关闭。

```toml
[params.webmention]
  enable = true
  domain = "你的域名"
```

Webmention 使用当前文章永久链接，从 Webmention.io 动态读取公开回复。需要先在该服务注册域名。`domain` 同时生成接收端点声明。回复正文按纯文本呈现，主题不读取本地评论缓存。
