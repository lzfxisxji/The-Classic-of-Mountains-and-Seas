# 山海铜盘地图与档案页面 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将首页普通星图升级为山海铜盘，并新增卷册库和图鉴详情页。

**Architecture:** `js/data.js` 是唯一资料源。首页保留 `data-beast` 与 `setSpecimen()`；新页面通过 URL 参数读取相同资料源，不引入框架或地图 SDK。

**Tech Stack:** 原生 HTML、CSS、ES modules、内嵌 SVG、Web Audio API。

## Global Constraints

- 保持暗色古卷、鎏金线条、档案馆和观测系统语言。
- 不移除异兽切换、地图点击、档案卡片、弹窗或音效。
- 不引入第三方框架、地图 SDK、视频或大体积纹理。
- 图形为原创 SVG/CSS，图片仅使用 `assets/` 内原创素材。
- 支持键盘、窄屏和 `prefers-reduced-motion`。

## File Structure

- Modify: `E:\Mountain and Sea\index.html` — 修复受损文本、更新地图、增加入口。
- Modify: `E:\Mountain and Sea\js\data.js` — 修复 UTF-8，补充 `volume` 和 `mapLabel`。
- Modify: `E:\Mountain and Sea\js\app.js` — 修复语法，扩展地图同步。
- Modify: `E:\Mountain and Sea\css\sections.css`、`css\responsive.css` — 铜盘和移动端。
- Create: `volumes.html`、`css\library.css`、`js\library.js` — 卷册库。
- Create: `specimen.html`、`css\specimen.css`、`js\specimen.js` — 图鉴详情。

### Task 1: 恢复首页基线

**Files:** `index.html`、`js/data.js`、`js/app.js`。

**Interfaces:** `beasts[id]` 提供名称、编号、出处、地域、等级、要素、封印、地点、描述、图片、色彩、`volume`、`mapLabel`；`setSpecimen(id, shouldScroll = false)` 继续供卡片和地图调用。

- [ ] 执行 `node --check E:\Mountain and Sea\js\app.js`，确认当前未闭合文本导致失败。
- [ ] 以 UTF-8 恢复所有用户可见中文，修复 `image.alt = \`${beast.name}原创异兽档案图\`;` 和环境音开/关文案。
- [ ] 为应龙、白泽写入 `volume: 'mountains'`，精卫、夔牛写入 `volume: 'seas'`；`mapLabel` 依次为“南山·赤水、北山·灵泽、东海·发鸠、西山·流波”。
- [ ] 再执行 `node --check`，预期 PASS；本地服务中依次点击四张卡，确认主图、字段、地图活动点同步。
- [ ] 无 `.git` 时记录并跳过提交；若有仓库，提交 `fix: restore archive text and specimen switching`。

### Task 2: 构建山海铜盘和观测案台

**Files:** `index.html`、`css/sections.css`、`css/responsive.css`、`js/app.js`。

**Interfaces:** 消费 `.map-region[data-beast]` 与 `beasts[id].mapLabel`；新增 `syncMapState(id)`，把 `data-active-beast`、`.active`、`aria-pressed` 和案台地点保持一致。

- [ ] 先在浏览器执行 `document.querySelector('.map-region[data-beast="jingwei"]').click()`；验收条件为精卫是唯一 `.active` / `aria-pressed="true"` 节点，地点显示“东海·发鸠”。
- [ ] 保留 `section#map`、四个按钮和 `data-beast`，将圆形地图局部替换为 `.map-board`、`.map-astrolabe`、`.map-terrain`、`.map-legend` 四层。
- [ ] 直接内嵌原创 SVG 的山线、海线、云气和四条观测路径；CSS 绘制铜环、纸纹、角标、轨迹和红色封印扩散。
- [ ] 案台按状态、地点、名称、等级、要素、索引入口分层展示；“查看档案索引”仍平滑滚动到 `.record-rail`。
- [ ] `syncMapState(id)` 设置地图容器 `dataset.activeBeast`，更新每个按钮的 `.active`、`aria-pressed`，并写入 `beasts[id].mapLabel`。
- [ ] 地图点击调用 `setSpecimen(id, false)`，不把用户强制带离地图；保留卡片、弹窗逻辑。
- [ ] 在 390px 宽和减少动态效果下验证：地图在案台上方，四点可点击，旋转/轨迹/扩散停用；Tab + Enter 可切换节点。
- [ ] 有仓库时提交 `feat: add shanhai astrolabe map`。

### Task 3: 创建卷册库

**Files:** `volumes.html`、`css/library.css`、`js/library.js`。

**Interfaces:** 消费 `beasts` 和 `URLSearchParams.get('volume')`；产出 `renderLibrary(volume)` 及 `specimen.html?id=<id>` 链接。

- [ ] 先请求 `http://127.0.0.1:4173/volumes.html`，预期 404。
- [ ] 新页面复用 tokens/base/components，提供 `all`、`mountains`、`seas`、`wilderness` 四个卷签。
- [ ] 将无效分类回退至 `all`；以 `Object.entries(beasts).filter(([, beast]) => volume === 'all' || beast.volume === volume)` 筛选。
- [ ] 卡片是链接，展示图片、编号、名称、出处、地点；空卷签显示“该卷册尚未开放观测”。
- [ ] 打开 `volumes.html?volume=seas`，预期仅精卫、夔牛；打开无参数页面，预期四项。
- [ ] 有仓库时提交 `feat: add archive volume library`。

### Task 4: 创建图鉴详情与深链入口

**Files:** `specimen.html`、`css/specimen.css`、`js/specimen.js`、`index.html`、`js/app.js`。

**Interfaces:** 消费 `URLSearchParams.get('id')` 和 `beasts[id]`；有效 id 渲染图鉴，无效 id 渲染 `.missing-specimen` 回退状态。

- [ ] 先请求 `http://127.0.0.1:4173/specimen.html?id=yinglong`，预期 404。
- [ ] 详情页显示原画、编号、封印、出处、地域、等级、要素、描述，提供返回卷册库和首页地图的链接。
- [ ] 使用 `const id = new URLSearchParams(location.search).get('id'); const beast = beasts[id];` 查找资料；没有条目时只显示“档案未检索到”和返回卷册库按钮，且没有 JavaScript 异常。
- [ ] 有效渲染使用 `createElement`/`textContent` 写入资料，避免将查询参数插入 HTML。
- [ ] 首页卡片与地图案台增加到 `specimen.html?id=<id>` 的详情入口，原先点击切换和弹窗不变。
- [ ] 依次打开四个有效 id 与 `unknown`；再对 `js` 目录所有文件运行 `node --check`，预期全部 PASS。
- [ ] 有仓库时提交 `feat: add specimen detail pages`。

## Plan Self-Review

- Task 1 先解决当前字符和语法损坏，保证已有交互。
- Task 2 覆盖铜盘、原创地形、探索交互、性能、无障碍与移动端。
- Task 3、4 覆盖已确认的新页面并复用唯一数据源。
- 未包含框架、后端、地图服务或第二份异兽数据。
