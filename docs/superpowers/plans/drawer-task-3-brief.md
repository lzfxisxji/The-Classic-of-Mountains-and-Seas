### Task 3: 接通数据渲染与入口

**Files:** Modify `E:\Mountain and Sea\js\app.js`.

**Interfaces:** 新增 `renderRecordPanel(beast)` 与 `openRecord(id = current)`；`setSpecimen(id, shouldScroll)` 在面板打开时同步渲染。

- 使用 `textContent` 更新 `data-record-field` 的编号、名称、拉丁名、图片、来源、区域、等级、异能、研究摘要和古籍摘录。
- 更新五项属性条的 width 与 aria-valuenow，相关档案按钮只显示其他三只异兽。
- `openRecord` 使用现有 `dialog.showModal()` 打开当前异兽；Hero `#open-record` 与地图 `.map-index-link` 都调用它，不再滚动到档案卡片。
- 相关档案按钮调用 `setSpecimen(id)` 后保持抽屉打开并刷新内容。
- 保留 Escape、关闭按钮、点击遮罩、异兽卡片、地图点击、环境音逻辑；不改地图 CSS/HTML。
- 尊重 `prefers-reduced-motion`，不增加强制平滑滚动。
- 运行 `node --check`，用 DOM/源代码契约检查入口和字段；不初始化 Git。
