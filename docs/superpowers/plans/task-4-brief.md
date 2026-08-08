### Task 4: 创建图鉴详情与深链入口

**Files:** `specimen.html`、`css/specimen.css`、`js/specimen.js`；可仅为必要入口修改 `index.html`、`js/app.js`。

**Interfaces:** 消费 `URLSearchParams.get('id')` 与 `beasts[id]`；有效 id 展示档案，无效 id 展示未检索回退状态。

- 详情显示原画、编号、封印、出处、地域、等级、要素、描述，提供返回卷册库和首页地图的链接。
- 使用 `const id = new URLSearchParams(location.search).get('id'); const beast = beasts[id];` 查找资料；无效 id 显示“档案未检索到”和返回卷册库按钮，不抛异常。
- 有效资料使用 createElement/textContent 写入，不将查询参数插入 innerHTML。
- 让首页地图案台提供进入当前档案详情的链接；原点击切换、卡片和弹窗逻辑不变。
- 保持暗色古卷、鎏金、档案系统风格；不引入框架，不初始化 Git。
- 用四个有效 id 与 unknown 验证，所有 js 通过 node --check。
