#!/usr/bin/env python3
"""
[INPUT]: Hugo 可执行文件、介绍文章示例站与主题资源。
[OUTPUT]: 构建、站内链接、语言隔离与可选功能的验证结果。
[POS]: 独立验证入口；不依赖 Python 第三方库。
[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
"""

import argparse
import hashlib
import json
import shutil
import subprocess
import tempfile
import tomllib
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit


ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://example.org"


class Document(HTMLParser):
    """提取 DOM 属性与文字，供页面契约验证使用。"""

    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.elements = []
        self.text = []
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))

    def handle_data(self, text):
        self.text.append(text)

    def with_class(self, name):
        return [attrs for _, attrs in self.elements if name in attrs.get("class", "").split()]


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def build(hugo, source, destination, base_path="", config=None):
    command = [
        hugo, "--source", str(source), "--destination", str(destination),
        "--themesDir", str(ROOT.parent), "--theme", ROOT.name,
        "--baseURL", ORIGIN + base_path + "/", "--panicOnWarning",
        "--printI18nWarnings", "--printPathWarnings", "--cleanDestinationDir",
    ]
    if config:
        command.extend(["--config", config])
    result = subprocess.run(command, cwd=ROOT, text=True, capture_output=True)
    require(result.returncode == 0, result.stdout + result.stderr)


def check_links(destination, base_path):
    count = 0
    for path in destination.rglob("*.html"):
        relative = path.relative_to(destination).as_posix()
        page_url = ORIGIN + base_path + "/" + relative
        doc = Document(path)
        for tag, attrs in doc.elements:
            for key in ("href", "src", "data-index"):
                value = attrs.get(key)
                if not value or value.startswith(("#", "mailto:", "tel:", "data:")):
                    continue
                url = urlsplit(urljoin(page_url, value))
                if url.netloc != "example.org":
                    continue
                if base_path:
                    require(url.path.startswith(base_path + "/"), f"Lost baseURL: {path}: {value}")
                local = unquote(url.path[len(base_path):]).lstrip("/")
                target = destination / local
                if target.is_dir():
                    target /= "index.html"
                require(target.is_file(), f"Broken {tag} {key}: {path}: {value}")
                count += 1
    require(not list(destination.rglob("AGENTS.md")), "Documentation leaked into published files")
    return count


def check_example(destination, base_path):
    expected = {
        "": (4, "Ares：让文字成为主角", "未发布的草稿"),
        "en/": (2, "Ares: A place for your words", "Ares：让文字成为主角"),
        "ja/": (1, "Ares：言葉を主役にするテーマ", "Ares: A place for your words"),
    }
    for lang, (count, title, excluded) in expected.items():
        index = json.loads((destination / lang / "search.json").read_text())
        require(len(index) == count, f"Wrong search count: {lang}")
        require(title in [entry["title"] for entry in index], f"Missing localized title: {lang}")
        require(excluded not in [entry["title"] for entry in index], f"Language/draft leak: {lang}")
        require(all(entry["url"].startswith(base_path + "/" + lang) for entry in index), f"Wrong search URLs: {lang}")
        feed = ET.parse(destination / lang / "atom.xml")
        require(len(feed.findall("channel/item")) == count, f"Wrong RSS count: {lang}")
        for item in feed.findall("channel/item"):
            require(item.findtext("link").startswith(ORIGIN + base_path + "/" + lang), "Wrong RSS URL")
        for page in ["index.html", "about/index.html", "archives/index.html", "friends/index.html", "tags/index.html", "categories/index.html", "404.html"]:
            require((destination / lang / page).exists(), f"Missing {lang}{page}")
    home = Document(destination / "index.html")
    require(len(home.with_class("post-list-item")) == 2, "Homepage pagination failed")
    require((destination / "page/2/index.html").exists(), "Missing homepage page 2")
    require((destination / "archives/page/2/index.html").exists(), "Missing archive page 2")
    archive2 = Document(destination / "archives/page/2/index.html")
    require("2025" in archive2.text, "Archive year group missing")
    writing = Document(destination / "posts/design/index.html")
    require(len(writing.with_class("highlight")) == 2, "Code hook failed")
    require(len(writing.with_class("gutter")) == 2, "Code line numbers missing")
    require(len(writing.with_class("marked")) == 2, "Highlighted code lines missing")
    article = Document(destination / "posts/welcome/index.html")
    translated = article.with_class("language-option")
    require({entry["href"] for entry in translated} == {base_path + "/en/posts/welcome/", base_path + "/ja/posts/welcome/"}, "Translation links failed")
    missing = Document(destination / "posts/archive/index.html")
    require({entry["href"] for entry in missing.with_class("language-option")} == {base_path + "/en/", base_path + "/ja/"}, "Missing-translation fallback failed")
    require(not (destination / "posts/draft/index.html").exists(), "Draft published")
    require(not (destination / "posts/agents/index.html").exists(), "GEB map published as article")
    require(hashlib.sha256((destination / "css/ares.css").read_bytes()).digest() == hashlib.sha256((ROOT / "static/css/ares.css").read_bytes()).digest(), "Stylesheet changed during build")
    return check_links(destination, base_path)


def write_page(source, name, content):
    path = source / "content" / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)


def check_optional(hugo, workspace):
    source = workspace / "single-site"
    source.mkdir()
    config = (ROOT / "exampleSite/hugo.toml").read_text()
    config = config.replace('themesDir = "../.."', f'themesDir = "{ROOT.parent.as_posix()}"')
    config = config.replace('theme = "hugo-theme-ares"', f'theme = "{ROOT.name}"')
    # 单语言、标题搜索和关闭数学公式是独立配置边界。
    config = config.replace('enable = true\n    field = "post"\n    content = true', 'enable = false\n    field = "post"\n    content = false')
    config += '\n[params.webmention]\n  enable = true\n  domain = "example.org"\n'
    config += '\n[params.nav.secondary]\n  links = []\n'
    # 示例的 languages 表是 TOML 顶层表；移除三种定义后使用 Hugo 默认语言。
    start = config.index("[languages.zh]")
    end = config.index("[params]", start)
    config = config[:start] + config[end:]
    (source / "hugo.toml").write_text(config)
    write_page(source, "posts/plain.md", '---\ntitle: Plain\ndate: 2026-01-01\n---\n\nA safe title-only search entry.\n\n<!-- more -->\n\nBODY_AFTER_LEGACY_SUMMARY\n\n```unknown-language\n<script>alert("example")</script>\n```\n')
    output = workspace / "single-output"
    build(hugo, source, output, "/blog")
    doc = Document(output / "posts/plain/index.html")
    require(not doc.with_class("language-menu"), "Single-language site has a switcher")
    require(not doc.with_class("search-dialog"), "Disabled search has a dialog")
    require(doc.with_class("webmention-section"), "Webmention container missing")
    require(not any(attrs.get("id") == "MathJax-script" for _, attrs in doc.elements), "Disabled math script loaded")
    home = Document(output / "index.html")
    require("BODY_AFTER_LEGACY_SUMMARY" not in "".join(home.text), "Legacy Hexo summary separator failed")
    require(home.with_class("read-more"), "Legacy summary has no read-more link")
    index = json.loads((output / "search.json").read_text())
    require(len(index) == 1 and index[0]["content"] == "", "Title-only index failed")
    check_links(output, "/blog")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--hugo", default="hugo", help="Hugo executable")
    args = parser.parse_args()
    require(shutil.which(args.hugo), "Install Hugo 0.158.0 or newer first")
    for path in [ROOT / "hugo.toml", ROOT / "theme.toml", ROOT / "exampleSite/hugo.toml"]:
        tomllib.loads(path.read_text())
    with tempfile.TemporaryDirectory(prefix="ares-verify-") as folder:
        workspace = Path(folder)
        checks = 0
        for base_path, name in [("", "root"), ("/blog", "subdirectory")]:
            destination = workspace / name
            build(args.hugo, ROOT / "exampleSite", destination, base_path)
            links = check_example(destination, base_path)
            checks += links
            print(f"PASS {name}: localized pages, pagination, search, RSS, drafts, {links} links")
        check_optional(args.hugo, workspace)
        print("PASS single-language site: search disabled, title-only index, Webmention, unknown code language, legacy summary")
        print(f"All checks passed ({checks} localized links plus optional configurations).")


if __name__ == "__main__":
    main()
