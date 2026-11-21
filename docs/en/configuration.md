<!--
[INPUT]: 当前 Hugo 主题实现与示例配置。
[OUTPUT]: 英文站点输出、导航、语言、搜索与可选服务说明。
[POS]: 项目文档；参数与命令必须随实现更新。
[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
-->

# Configuration

Start with `exampleSite/hugo.toml`, then replace the site identity, theme path, language settings, and blogroll cards. Theme parameters use snake_case names.

The site must declare these outputs:

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
```

The feed is published at `atom.xml` in RSS 2.0 format. Each language gets a separate feed and search index.

Common parameters are `params.author`, `description`, `logo`, `favicon`, `startyear`, `mainSections`, and `math`. The default article section is `posts`. Configure pagination through `pagination.pagerSize`, which defaults to six posts per page on the homepage and lists. `params.date_format` defaults to `01/02/2006` for month/day/year display; it accepts Hugo date layouts.

Navigation uses `params.nav.primary.links`, `primary.buttons`, and `secondary.links`. Link entries have `type`, `key`, and `path`; `name` supplies a custom label. Internal links automatically include the active language and `baseURL` subdirectory. Remove links for pages that you have not created.

Use Hugo's `defaultContentLanguage` and `languages` tables. From Hugo 0.158.0, language configuration uses `locale` and `label`. The example uses `zh`, `en`, and `ja`, with matching `.zh.md`, `.en.md`, and `.ja.md` content suffixes. Missing translations link to the target language homepage. With only one configured language, the language menu is hidden.

Enable local search with:

```toml
[params.search]
  enable = true
  field = "post"
  content = true
  limit = 50
```

`field` accepts `post`, `page`, or `all`. Set `content = false` for title-only search. Search uses Hugo's JSON output and requires no plugin or external service.

Blogroll entries use `[[params.friend_links]]` with `name`, `url`, `description`, `lang`, and an optional `avatar`.

Set `params.disqus` to a Disqus shortname, or `params.ga` to a Google Analytics ID, to enable those optional services. Enable dynamic Webmention through `[params.webmention]` with `enable = true` and your registered `domain`. Webmention replies are fetched for the article's canonical URL and rendered as text. The theme does not read local comment caches.

The example disables MathJax and external services. Basic theme assets, navigation, code tools, and search are local.
