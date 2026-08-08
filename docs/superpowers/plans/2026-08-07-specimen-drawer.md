# 异兽研究档案抽屉 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用沉浸式右侧研究档案抽屉替代简单弹窗，并让所有异兽资料由 `data.js` 驱动。

**Architecture:** 保留原生 `<dialog>`，将其作为有焦点管理的抽屉宿主。`beasts` 追加研究资料，`app.js` 以 `renderRecordPanel(beast)` 同步抽屉、首页选择、地图与相关档案切换。

**Tech Stack:** 原生 HTML、CSS、ES modules。

## Global Constraints

- 不修改经纬铜盘地图、Hero 或异兽卡片逻辑。
- 保持异兽切换、地图点击、卡片选择、环境音功能。
- 不引入框架或第三方依赖。
- 桌面右侧 480px、移动端全屏、减少动态效果时取消滑入。

### Task 1: 扩充异兽研究数据

**Files:** Modify `E:\Mountain and Sea\js\data.js`.

**Interfaces:** 每个 `beasts[id]` 产生 `research: string`, `quote: string`, `stats: { strength:number, speed:number, wisdom:number, ability:number, danger:number }`。

- [ ] 为四个条目添加 150–200 字 `research`、古籍摘录 `quote` 和 0–100 的五项 `stats`；研究摘要须包含外貌、神话、能力、文化寓意。
- [ ] 执行 `node --check E:\Mountain and Sea\js\data.js`，预期 PASS。
- [ ] 在 Node module 导入中断言四只异兽都含上述字段与五项数值。

### Task 2: 构建右侧研究档案抽屉

**Files:** Modify `E:\Mountain and Sea\index.html`, `E:\Mountain and Sea\css\components.css`, `E:\Mountain and Sea\css\responsive.css`.

**Interfaces:** `#record-dialog` 包含标头、原画、基础资料、研究摘要、古籍摘录、五项属性条、`.related-records` 和关闭按钮；字段可由 `data-record-field` 定位。

- [ ] 将简单 dialog 内容替换为语义化抽屉区域；使用现有 `dialog`，不创建第二个遮罩层。
- [ ] CSS 实现 380ms 从右侧进入、半透明 backdrop、金线原画展柜和古卷引用块；移动端宽高 100vw/100dvh。
- [ ] 为 `prefers-reduced-motion` 取消 dialog 和 backdrop 的动画/过渡。
- [ ] 检查 HTML 中关闭按钮、面板标题与原画 alt 的语义存在。

### Task 3: 接通数据渲染与入口

**Files:** Modify `E:\Mountain and Sea\js\app.js`.

**Interfaces:** 新增 `renderRecordPanel(beast)`, `openRecord(id = current)`；`setSpecimen(id, shouldScroll)` 调用面板渲染（若处于打开状态）。

- [ ] `renderRecordPanel` 以 `textContent` 更新资料、研究文字、古籍摘录、属性条宽度和当前图片。
- [ ] `openRecord` 用 `dialog.showModal()` 打开当前资料；Hero 按钮和地图 `.map-index-link` 调用它。
- [ ] 相关档案按钮调用 `setSpecimen(id)` 和 `renderRecordPanel(beasts[id])`，不关闭抽屉。
- [ ] Escape、关闭按钮、点击遮罩关闭仍由 dialog 处理。
- [ ] 执行 `node --check E:\Mountain and Sea\js\app.js`；逐一点击 Hero、地图和相关档案，确认卡片/地图/抽屉一致，环境音仍可开关。

## Plan Self-Review

- 数据、结构、样式、渲染和验收均有对应任务。
- 没有修改地图、Hero 或卡片逻辑的任务。
- 所有面板资料读取唯一 `beasts` 数据源，不重复写入 HTML。
