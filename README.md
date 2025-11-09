# 拨号式首页 + 目录详情（单选标签）
- 首页 `index.html`：顶部标签栏=各目录；下方**大拨号卡片**（居中图标 + 下方标题、URL 省略号），与截图风格一致。
- 详情 `page.html` → 内部 `page-inner.html`：保留你原来的联动能力（搜索、单选标签、批量打开）。

## 启动
```bash
python3 -m http.server 8000
# 打开 http://127.0.0.1:8000/
```

## 数据
- 放 `data.json` 于同目录；或修改 `tabs-home.js/page.js` 顶部 `DATA_URL`。
