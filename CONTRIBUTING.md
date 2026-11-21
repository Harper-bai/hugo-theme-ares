<!--
[INPUT]: 主题目录、示例配置与 scripts/verify.py。
[OUTPUT]: 开发入口、职责边界与提交前检查步骤。
[POS]: 贡献者入口；使用教程位于 docs/。
[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
-->

# 贡献说明

欢迎提交问题报告和拉取请求。报告问题时，请提供 Hugo 版本、最小复现配置与重现步骤。页面问题请附上截图和浏览器信息。

## 开发

需要 Hugo 0.158.0 及更新版本。自动检查需要 Python 3.11 及更新版本，只使用 Python 标准库。

```sh
hugo server --source exampleSite
```

仅当修改 Sass 源码时安装可选依赖，并重新生成样式：

```sh
npm ci
npm run css
```

样式产物位于 `static/css/ares.css`。修改 Sass 时，同时提交源码与样式产物。

## 目录职责

- `layouts/`：页面模板、局部模板与 Markdown 渲染钩子。
- `static/`：浏览器脚本、发布样式、字体与图标。
- `assets/scss/`：可选的 Sass 样式源码。
- `i18n/`：中文、英文与日文界面文案。
- `exampleSite/`：可独立构建的完整示例站。
- `scripts/`：构建与站点完整性检查。

修改时复用现有模板、类名和脚本边界。新增语言时，保持界面翻译键一致。修改参数或内容用法时，同步更新示例配置与中英文文档。

## 提交前检查

在仓库根目录运行：

```sh
python3 scripts/verify.py
hugo --source exampleSite --minify --panicOnWarning
git diff --check
```

自动检查覆盖根目录与 `/blog/` 子目录部署、多语言、分页、搜索、RSS、草稿和站内链接。持续集成在最低支持版本和较新版本的 Hugo 上运行相同检查。

修改页面、样式或浏览器脚本时，再检查桌面和手机宽度、明暗主题、手机菜单、语言切换、搜索、代码复制与折叠。修改第三方集成时，请使用自己的测试配置。

拉取请求应说明问题、最终行为与验证方式。保留原作者署名、MIT 许可和字体授权。构建产物、缓存和本地依赖不提交。
