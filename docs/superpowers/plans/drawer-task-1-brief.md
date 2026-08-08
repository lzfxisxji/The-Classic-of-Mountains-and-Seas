### Task 1: 扩充异兽研究数据

**Files:** Modify `E:\Mountain and Sea\js\data.js`.

**Interfaces:** 每个 `beasts[id]` 必须产生 `research: string`, `quote: string`, `stats: { strength:number, speed:number, wisdom:number, ability:number, danger:number }`。

- 为四只异兽添加各自的 150–200 字 `research`，覆盖外貌、神话、能力、文化寓意。
- 添加古籍摘录 `quote`；不能伪装为未经核验的逐字原典，使用“档案释义 / 古籍摘录”表述。
- `stats` 五项都为 0–100 数字。
- 不修改既有字段、地图、Hero、卡片或应用逻辑。
- 运行 `node --check E:\Mountain and Sea\js\data.js`，并用 Node ES module 导入断言四项均有三个新增字段与五项数字。
- 当前不是 Git 仓库，不得初始化 Git。
