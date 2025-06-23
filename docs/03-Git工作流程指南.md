# 🌿 Git 工作流程指南

## 🎯 个人敏捷开发Git策略

### 分支管理模型
```
main (生产分支)
├── 永远保持可部署状态  
├── 每周五合并develop分支
├── 使用tag标记版本发布
└── 自动部署到生产环境

develop (开发主分支)
├── 日常开发的主要分支
├── 每天合并feature分支  
├── 自动部署到测试环境
└── 每周向main合并

feature/* (功能分支)
├── 每个功能或每日任务一个分支
├── 命名格式: feature/模块-功能描述
├── 完成后合并到develop并删除
└── 保持分支生命周期短(1-3天)

hotfix/* (紧急修复分支)
├── 生产环境紧急bug修复
├── 直接从main创建
├── 修复后同时合并到main和develop
└── 立即部署
```

---

## 📋 提交规范

### Conventional Commits格式
```
<类型>(范围): <描述>

[可选的正文]

[可选的脚注]
```

### 提交类型
```bash
feat(frontend):    # 新功能 (前端)
feat(backend):     # 新功能 (后端)  
feat(fullstack):   # 全栈功能
fix(frontend):     # Bug修复 (前端)
fix(backend):      # Bug修复 (后端)
refactor(shared):  # 代码重构 (共享模块)
style(ui):         # 样式调整
docs:              # 文档更新
chore:             # 构建/工具配置
test:              # 测试相关
perf:              # 性能优化
```

### 提交示例
```bash
# ✅ 好的提交
git commit -m "feat(frontend): 实现用户测试界面

- 添加题目展示组件
- 实现答题选择逻辑
- 添加进度条显示
- 优化移动端适配

完成度: 80%"

# ✅ 简单提交
git commit -m "fix(backend): 修复API响应格式错误"

# ❌ 避免的提交
git commit -m "更新"
git commit -m "修复bug"
git commit -m "wip"
```

---

## 🔄 每日工作流程

### 🌅 每天开始工作
```bash
# 1. 切换到develop并拉取最新代码
git checkout develop
git pull origin develop

# 2. 创建今日功能分支
git checkout -b feature/day3-analysis-algorithm

# 3. 查看当前状态
git status
git log --oneline -5
```

### 💻 开发过程中
```bash
# 小步快跑 - 频繁提交
git add src/components/TestQuestion.vue
git commit -m "feat(frontend): 添加测试题目组件骨架"

# 功能完成一部分就提交
git add .
git commit -m "feat(frontend): 实现题目图片展示和选择交互"

# 修复问题立即提交
git add .
git commit -m "fix(frontend): 修复移动端图片显示问题"

# 中午休息前保存进度
git add .
git commit -m "wip(frontend): 测试逻辑开发中，已完成60%"
git push origin feature/day3-analysis-algorithm
```

### 🌙 每天结束工作
```bash
# 1. 确保代码可运行
npm run dev  # 检查前后端都能正常启动

# 2. 提交今日最终版本
git add .
git commit -m "feat(fullstack): 完成基础审美分析功能

前端:
- ✅ 实现测试题目展示
- ✅ 添加用户答题逻辑  
- ✅ 完成结果页面框架

后端:
- ✅ 创建分析算法基础结构
- ✅ 实现简单评分计算
- ✅ 添加结果存储接口

明日计划: 完善分析算法，添加雷达图展示"

# 3. 推送到远程
git push origin feature/day3-analysis-algorithm

# 4. 合并到develop（如果功能完整）
git checkout develop
git merge feature/day3-analysis-algorithm --no-ff
git push origin develop

# 5. 删除已完成的功能分支
git branch -d feature/day3-analysis-algorithm
git push origin --delete feature/day3-analysis-algorithm
```

---

## 📅 每周发布流程

### 周五发布准备
```bash
# 1. 确保develop分支稳定
git checkout develop
git pull origin develop

# 2. 运行完整测试
npm run test        # 运行所有测试
npm run build       # 确认构建成功
npm run dev         # 手动测试主要功能

# 3. 创建版本标签
git tag -a v0.1.0 -m "Sprint 1完成版本

功能:
- ✅ 基础审美测试
- ✅ 简单结果分析
- ✅ 前后端通信

下周计划:
- 房间对比功能
- 分享机制优化"

git push origin v0.1.0

# 4. 合并到main进行发布
git checkout main
git pull origin main
git merge develop --no-ff -m "release: 发布v0.1.0版本"
git push origin main
```

### 发布后清理
```bash
# 1. 更新CHANGELOG（可选）
echo "## v0.1.0 (2024-07-XX)
- feat: 实现基础审美测试功能
- feat: 添加简单结果分析
- feat: 完成前后端基础架构" >> CHANGELOG.md

git add CHANGELOG.md
git commit -m "docs: 更新v0.1.0版本日志"
git push origin main

# 2. 切回develop继续开发
git checkout develop
```

---

## 🚨 紧急修复流程

```bash
# 1. 从main创建hotfix分支
git checkout main
git pull origin main
git checkout -b hotfix/fix-login-crash

# 2. 快速修复bug
# ... 修复代码 ...
git add .
git commit -m "fix: 修复用户登录时的崩溃问题

问题: 用户在某些情况下登录会导致应用崩溃
原因: 空值检查缺失
解决: 添加防护性检查和错误处理

影响: 修复后登录成功率提升到99.9%"

# 3. 同时合并到main和develop
git checkout main
git merge hotfix/fix-login-crash --no-ff
git push origin main

git checkout develop
git merge hotfix/fix-login-crash --no-ff  
git push origin develop

# 4. 清理hotfix分支
git branch -d hotfix/fix-login-crash

# 5. 立即部署修复（如果有自动部署）
git tag -a v0.1.1 -m "紧急修复: 登录崩溃问题"
git push origin v0.1.1
```

---

## 🔍 Git最佳实践

### 提交前检查清单
```bash
# ✅ 代码检查
npm run lint          # 代码规范检查
npm run test          # 运行测试
npm run build         # 构建检查

# ✅ 功能检查  
npm run dev           # 启动服务检查
# 手动测试修改的功能
# 检查是否破坏现有功能

# ✅ 提交信息检查
# 提交信息是否清晰描述了变更
# 是否遵循了提交规范
# 是否包含了必要的上下文信息
```

### 常用Git命令速查
```bash
# 查看状态和历史
git status                          # 查看当前状态
git log --oneline -10               # 查看最近10次提交
git log --graph --oneline           # 图形化显示分支历史
git diff                            # 查看未暂存的变更
git diff --staged                   # 查看已暂存的变更

# 分支操作
git branch                          # 查看本地分支
git branch -r                       # 查看远程分支
git branch -d <branch-name>         # 删除本地分支
git push origin --delete <branch>   # 删除远程分支

# 撤销操作
git reset HEAD <file>               # 取消暂存文件
git checkout -- <file>              # 撤销工作区修改
git reset --soft HEAD~1             # 撤销最后一次提交(保留修改)
git reset --hard HEAD~1             # 撤销最后一次提交(删除修改)

# 远程操作
git remote -v                       # 查看远程仓库
git fetch origin                    # 拉取远程变更(不合并)
git pull origin develop             # 拉取并合并远程develop分支
git push -u origin <branch>         # 推送并设置上游分支
```

### 解决常见问题
```bash
# 合并冲突解决
git status                          # 查看冲突文件
# 手动编辑冲突文件
git add <resolved-files>            # 标记冲突已解决
git commit                          # 完成合并

# 误提交到错误分支
git log --oneline -5                # 找到错误提交的hash
git reset --hard HEAD~1             # 撤销提交
git checkout correct-branch         # 切换到正确分支
git cherry-pick <commit-hash>       # 应用提交到正确分支

# 推送被拒绝（远程有新提交）
git pull origin develop             # 拉取远程变更
# 解决可能的冲突
git push origin develop             # 重新推送
```

---

## 📊 进度追踪

### 使用GitHub Issues管理任务
```bash
# 创建功能Issue时的标签系统
sprint-1, sprint-2...              # Sprint标签
feature, bug, enhancement          # 类型标签
priority/high, priority/medium     # 优先级标签
frontend, backend, fullstack       # 模块标签
help-wanted, good-first-issue      # 状态标签
```

### 提交信息中引用Issue
```bash
git commit -m "feat(frontend): 实现用户注册界面

- ✅ 完成注册表单设计
- ✅ 添加输入验证逻辑
- 🚧 正在开发手机号验证
- 📋 待完成: 错误提示优化

closes #12"  # 自动关闭Issue #12
```

### 每周代码统计
```bash
# 查看本周提交统计
git log --since="1 week ago" --oneline | wc -l

# 查看本周代码变化量
git diff --stat HEAD~7 HEAD

# 按作者统计提交（团队项目）
git shortlog -sn --since="1 week ago"

# 查看文件修改频率
git log --name-only --since="1 week ago" | grep -v "^$" | sort | uniq -c | sort -nr
```

这套Git工作流程专为个人敏捷开发设计，能帮你保持高效的开发节奏和清晰的代码历史。 