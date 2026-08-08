### Task 1: 恢复首页基线

**Files:** `E:\Mountain and Sea\index.html`、`E:\Mountain and Sea\js\data.js`、`E:\Mountain and Sea\js\app.js`。

**Interfaces:** `beasts[id]` 提供名称、编号、出处、地域、等级、要素、封印、地点、描述、图片、色彩、`volume`、`mapLabel`；`setSpecimen(id, shouldScroll = false)` 继续供卡片和地图调用。

- [ ] 执行 `node --check E:\Mountain and Sea\js\app.js`，确认当前未闭合文本导致失败。
- [ ] 以 UTF-8 恢复所有用户可见中文，修复 `image.alt = \`${beast.name}原创异兽档案图\`;` 和环境音开/关文案。
- [ ] 为应龙、白泽写入 `volume: 'mountains'`，精卫、夔牛写入 `volume: 'seas'`；`mapLabel` 依次为“南山·赤水、北山·灵泽、东海·发鸠、西山·流波”。
- [ ] 再执行 `node --check`，预期 PASS；本地服务中依次点击四张卡，确认主图、字段、地图活动点同步。
- [ ] 当前目录无 `.git`，因此不得初始化或创建仓库；在报告中记录跳过提交。
