# 🚀 GitHub项目管理设置指南

## 📋 为什么需要项目管理？

作为个人开发者，你可能会遇到这些问题：

- 🤔 **今天做什么？** - 没有明确的任务列表
- 😵 **任务太多？** - 不知道优先级怎么排
- 🔄 **忘记进度？** - 不记得哪些完成了哪些没完成
- 📈 **没有成就感？** - 看不到整体进展

**GitHub项目管理**帮你解决这些问题！

---

## 🎯 第一步：创建GitHub Issues

### 📝 什么是Issues？

Issues就是**具体的任务卡片**，每个Issue代表一个要完成的功能或修复。

### 🛠️ 创建Issues步骤

#### 1. 在GitHub仓库页面点击 `Issues` 标签

#### 2. 点击 `New Issue` 创建新任务

#### 3. 使用以下模板创建Issue：

```markdown
**🎯 任务名称：** 实现用户注册功能

**📋 功能描述：**
用户可以通过手机号快速注册账号，完成基础信息填写

**✅ 验收标准：**

- [ ] 创建注册页面UI
- [ ] 实现手机号验证
- [ ] 连接后端注册API
- [ ] 添加表单验证
- [ ] 注册成功跳转到首页

**🔧 技术要求：**

- Vue 3 + Composition API
- 表单验证使用VueUse
- 路由使用Vue Router
- 样式使用TailwindCSS

**⏱️ 预估时间：** 4-6小时

**📚 相关文档：**

- [05-前端开发指南](../docs/05-前端开发指南.md)
- [用户故事1.1](../docs/07-用户故事与产品待办清单.md#story-11)

**🏷️ 标签：**
`enhancement` `priority-high` `frontend`
```

### 📊 Issue标签系统

#### 🎯 功能类型

- `enhancement` - 新功能
- `bug` - 错误修复
- `documentation` - 文档更新
- `refactor` - 代码重构

#### ⚡ 优先级

- `priority-high` - 本周必须完成
- `priority-medium` - 2周内完成
- `priority-low` - 有时间就做

#### 🔧 技术领域

- `frontend` - 前端相关（Vue, TailwindCSS, 路由等）
- `backend` - 后端相关（Express, API, 中间件等）
- `database` - 数据库相关（Supabase, 数据模型等）
- `fullstack` - 全栈相关（前后端联调等）
- `deployment` - 部署相关
- `documentation` - 文档相关

---

## 📊 第二步：设置GitHub Projects看板

### 🎯 什么是Projects？

Projects就是**任务看板**，让你可视化管理所有Issues的状态。

### 🛠️ 创建Projects步骤

#### 方案一：单看板 + 标签分离（推荐新手）

1. 在GitHub仓库页面点击 `Projects` 标签
2. 点击 `New Project` 创建项目：`AesthetiMatch 开发看板`
3. 选择 `Board` 模板
4. 设置看板列：

```
📝 Backlog        🎯 Ready         🔨 In Progress    👀 Review        ✅ Done
(产品待办清单)     (准备开发)        (开发中)          (代码审查)        (已完成)
```

5. 使用**颜色标签**区分前后端：
   - 🟦 `frontend` - 前端任务
   - 🟩 `backend` - 后端任务
   - 🟪 `fullstack` - 全栈任务

#### 方案二：双看板分离（推荐熟练后）

**创建两个独立的Projects：**

**🎨 前端开发看板**

```
📱 UI设计        🎯 组件开发      🔨 页面实现      💅 样式优化      ✅ 前端完成
(界面设计)       (Vue组件)        (路由页面)       (响应式调整)      (前端任务)
```

**⚡ 后端开发看板**

```
📋 API设计       🎯 路由开发      🔨 接口实现      🧪 接口测试      ✅ 后端完成
(接口规划)       (Express路由)    (业务逻辑)       (Postman测试)    (后端任务)
```

### 📈 看板使用策略

#### 🗓️ 每周日晚上 - 规划下周

**单看板模式：**

- 从 `Backlog` 选择 3-5个 Issue 移动到 `Ready`
- **前后端均衡**：选择2个前端 + 2个后端任务
- 按优先级和依赖关系排序

**双看板模式：**

- 分别为前端和后端看板规划任务
- 前端重点：UI组件 → 页面实现 → 样式优化
- 后端重点：API设计 → 路由开发 → 接口测试

#### 🌅 每天上午 - 选择今日任务

**专注策略（推荐）：**

- 选择**同一技术栈**的任务（避免频繁切换）
- 前端日：专注Vue组件和界面开发
- 后端日：专注API和数据库开发
- 全栈日：前后端联调和集成测试

**灵活策略：**

- 上午做复杂任务（前端UI设计 或 后端逻辑）
- 下午做简单任务（样式调整 或 接口测试）

#### 🌆 每天晚上 - 更新进度

- 完成的任务移动到对应的完成列
- 记录今日完成的前端/后端工作量
- 平衡明天的前后端任务分配

---

## 🎯 第三步：建立每日工作流

### 🌅 每天开始工作 (5分钟)

#### 1. 📱 打开GitHub Projects看板

- 网址：`https://github.com/你的用户名/AesthetiMatch/projects`
- 查看 `Ready` 列有哪些任务

#### 2. 🎯 选择今日任务

- 选择1-2个适合的Issue
- 评估任务复杂度（2-8小时）
- 拖拽到 `In Progress` 列

#### 3. 💻 开始开发

```bash
# 切换到develop分支
git checkout develop
git pull origin develop

# 创建功能分支（Issue号码-简短描述）
git checkout -b feature/issue-12-user-registration

# 启动开发环境
npm run dev
```

### 🎯 开发过程中

#### 📝 频繁提交

```bash
# 每完成一个小功能就提交
git add .
git commit -m "feat: 添加注册页面UI布局 #12"

# 每30分钟推送一次
git push origin feature/issue-12-user-registration
```

#### 📊 更新Issue进度

- 在Issue评论中更新进度
- 完成验收标准项目就打勾 ✅
- 遇到问题记录在Issue中

### 🌆 每天结束工作

#### 1. 🔄 更新看板

- 完成的Issue移动到 `Review`
- 部分完成的保持在 `In Progress`
- 添加今日进度评论

#### 2. 📤 推送代码

```bash
# 确保所有代码已推送
git push origin feature/issue-12-user-registration

# 如果功能完成，创建Pull Request
```

#### 3. 📝 准备明天

- 查看 `Ready` 列选择明天的任务
- 预估明天的工作量

---

## 🎯 实际操作示例

### 📋 示例：创建前后端Issue

#### 🎨 前端Issue示例

**标题：** 实现用户测试页面UI

```markdown
## 功能描述

创建审美测试的主页面，包括图片对比选择和进度显示

## 验收标准

- [ ] 设计图片对比选择界面
- [ ] 实现测试进度条组件
- [ ] 添加选择动画效果
- [ ] 响应式布局适配
- [ ] 连接Vue Router路由

## 技术要求

- Vue 3 Composition API
- TailwindCSS 4.x动画
- 组件状态管理

## 预估时间

4-6小时

## 标签

`enhancement` `priority-high` `frontend`
```

#### ⚡ 后端Issue示例

**标题：** 实现用户注册API接口

```markdown
## 功能描述

创建用户注册的后端API，包括数据验证和数据库存储

## 验收标准

- [ ] 设计用户数据模型
- [ ] 实现POST /api/auth/register接口
- [ ] 添加输入数据验证
- [ ] 密码加密存储
- [ ] 返回JWT token

## 技术要求

- Express.js路由
- Supabase数据库
- bcrypt密码加密
- JWT token生成

## 预估时间

3-5小时

## 标签

`enhancement` `priority-high` `backend`
```

#### 🟪 全栈Issue示例

**标题：** 前后端联调 - 用户登录功能

```markdown
## 功能描述

将前端登录界面与后端登录API进行集成联调

## 验收标准

- [ ] 前端表单数据正确发送到后端
- [ ] 后端返回数据前端正确处理
- [ ] 登录成功后跳转到主页
- [ ] 错误信息正确显示
- [ ] Token存储和自动登录

## 技术要求

- 前端：Vue3 + Axios
- 后端：Express + JWT
- 跨域CORS配置

## 预估时间

2-3小时

## 标签

`integration` `priority-medium` `fullstack`
```

### 📊 示例：使用Projects看板

**步骤1：创建Projects**

- 项目名称：`AesthetiMatch 开发看板`
- 模板：`Board`

**步骤2：设置看板列**

- Backlog：放置所有待开发的Issue
- Ready：本周准备开发的Issue
- In Progress：今天正在开发的Issue
- Review：等待代码审查的Issue
- Done：已完成的Issue

**步骤3：管理Issues**

- 将刚创建的Issue拖拽到 `Ready` 列
- 开始开发时移动到 `In Progress`
- 完成后移动到 `Done`

---

## 🎯 高效使用技巧

### ⚡ 快速创建Issues

1. **使用模板**：复制粘贴Issue模板
2. **批量创建**：一次性创建一周的任务
3. **参考用户故事**：从产品待办清单转换成具体Issue

### 📊 看板管理技巧

1. **限制进行中任务**：同时最多2个Issue在 `In Progress`
2. **定期清理**：每周清理 `Done` 列的旧任务
3. **优先级排序**：高优先级Issue放在列表上方

### 🔄 工作流优化

1. **小任务优先**：选择2-4小时能完成的Issue
2. **相关任务连续**：前端相关的Issue一起做
3. **预留缓冲**：每天预留1小时处理意外情况

---

## 📈 进度跟踪

### 📊 每日检查

- ✅ 今天完成了几个Issue？
- 📈 代码提交了几次？
- 🎯 明天计划做什么？

### 📅 每周总结

- 📊 本周完成Issue数量
- ⏱️ 预估时间vs实际时间
- 🎯 下周重点任务规划

### 🎯 成就感培养

- 🏆 每完成一个Issue就庆祝
- 📈 定期查看已完成的Issue数量
- 🎪 向朋友展示开发进度

---

## 🚀 立即开始

### 📋 今天就开始

1. **创建5个Issue**：从用户故事转换而来
2. **设置Projects看板**：5列式管理
3. **选择第一个任务**：从简单的UI界面开始

### 🎯 明天开始使用

- 🌅 **上午9点**：查看看板，选择今日任务
- 🌆 **下午6点**：更新进度，推送代码
- 🌙 **晚上8点**：规划明天任务

---

**记住：工具是为了提高效率，不是增加负担。如果感觉复杂，就简化流程！** 🎯
