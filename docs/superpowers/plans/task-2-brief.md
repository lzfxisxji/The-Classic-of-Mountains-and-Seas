### Task 2: 构建山海铜盘和观测案台

**Files:** `index.html`、`css/sections.css`、`css/responsive.css`、`js/app.js`。

**Interfaces:** 消费 `.map-region[data-beast]` 与 `beasts[id].mapLabel`；新增 `syncMapState(id)`，把 `data-active-beast`、`.active`、`aria-pressed` 和案台地点保持一致。

- [ ] 保留 `section#map`、四个按钮和 `data-beast`，将圆形地图局部替换为 `.map-board`、`.map-astrolabe`、`.map-terrain`、`.map-legend` 四层。
- [ ] 直接内嵌原创 SVG 的山线、海线、云气和四条观测路径；CSS 绘制铜环、纸纹、角标、轨迹和红色封印扩散。
- [ ] 案台按状态、地点、名称、等级、要素、索引入口分层展示；“查看档案索引”仍平滑滚动到 `.record-rail`。
- [ ] `syncMapState(id)` 设置地图容器 `dataset.activeBeast`，更新每个按钮的 `.active`、`aria-pressed`，并写入 `beasts[id].mapLabel`。
- [ ] 地图点击调用 `setSpecimen(id, false)`，不把用户强制带离地图；保留卡片、弹窗逻辑。
- [ ] 在 390px 宽和减少动态效果下验证：地图在案台上方，四点可点击，旋转/轨迹/扩散停用；Tab + Enter 可切换节点。
- [ ] 不要初始化 Git；报告中记录测试证据和未能执行的验证。
