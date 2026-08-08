### Task 3: 创建卷册库

**Files:** `E:\Mountain and Sea\volumes.html`、`E:\Mountain and Sea\css\library.css`、`E:\Mountain and Sea\js\library.js`。

**Interfaces:** 消费 `beasts` 和 `URLSearchParams.get('volume')`；产出可筛选卷册和 `specimen.html?id=<id>` 链接。

- 使用项目现有 `tokens.css`、`base.css`、`components.css`，延续暗色古卷、鎏金线条、档案馆风格。
- 提供 `all`、`mountains`、`seas`、`wilderness` 四个卷签；无效分类回退至 all。
- 使用 `Object.entries(beasts).filter(([, beast]) => volume === 'all' || beast.volume === volume)` 筛选。
- 每张卡是到 `specimen.html?id=<id>` 的链接，显示图片、编号、名称、出处、地点；空卷签显示“该卷册尚未开放观测”。
- 验证 `volumes.html?volume=seas` 仅显示精卫、夔牛；无参数显示四项。
- 不改 Hero、既有异兽卡片或地图；不初始化 Git。
