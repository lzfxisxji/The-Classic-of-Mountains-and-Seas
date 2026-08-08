# 山海档案局 — 项目记忆

## 项目概况
- 路径：E:\Mountain and Sea
- 技术栈：纯 HTML/CSS/JS（ES Modules），无框架
- 主题：《山海经》异兽数字博物馆
- 原名：山海档案局 — 异兽档案站

## 技术细节
- 字体：Noto Serif SC（中文衬线）+ DM Mono（等宽标注）
- 色彩系统：墨底 #0d0809 / 宣纸 #f5e8cf / 鎏金 #edbd79 / 朱砂 #b92620
- 音频：Web Audio API 合成环境音 + 翻页音效（js/audio.js）
- 数据：js/data.js 导出 beasts 对象，含 4 只异兽
- CSS：已重构为模块化 6 文件（tokens/base/components/sections/animations/responsive.css），原 archive.css 保留作对照
- 响应式：断点体系 430/780/1024/1440 + 触摸适配(hover:none&pointer:coarse) + 减动效，见 tokens.css 顶部注释
- 预览：`python -m http.server 8211 --directory E:/Mountain and Sea`

## 优化方案（2026-08-05）
- 详见 `优化方案.md`
- 核心方向：3 板块 → 7 板块，建立设计系统，CSS 拆分重构
- 4 阶段实施：基础重构 → 内容扩展 → 交互增强 → 视觉打磨
