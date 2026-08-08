### Task 2: 构建右侧研究档案抽屉

**Files:** Modify `E:\Mountain and Sea\index.html`, `E:\Mountain and Sea\css\components.css`, `E:\Mountain and Sea\css\responsive.css`.

**Interfaces:** `#record-dialog` 包含标头、原画、基础资料、研究摘要、古籍摘录、五项属性条、`.related-records` 和关闭按钮；可由 `data-record-field` 定位填充。

- 将简单 dialog 内容替换为语义化研究档案抽屉；继续使用同一个原生 `<dialog>`，不创建第二套遮罩。
- 桌面端 480px 固定右侧，380ms 从右侧滑入；backdrop 半透明渐变；使用金线原画展柜与古卷引用块。
- 移动端为 100vw / 100dvh 全屏，抽屉内部可滚动。
- 包含档案头部、当前原画、来源/区域/风险/异能、研究摘要、古籍摘录、五项数据条及相关档案按钮容器。
- `prefers-reduced-motion` 时取消 dialog/backdrop 动画和过渡。
- 不修改地图区域、Hero、卡片或 JavaScript；不初始化 Git。
- 静态验证 HTML 元素与 CSS 响应式规则存在。
