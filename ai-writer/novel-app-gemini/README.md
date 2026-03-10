# AI创作工坊 - Gemini版（完全免费）

## 部署步骤（5分钟上线）

### 第一步：上传到 GitHub
1. 注册 https://github.com
2. 点击右上角「+」→「New repository」，仓库名填 ai-writer
3. 上传这个文件夹里的所有文件
   ⚠️ 注意：不要上传 .env.local 文件！

### 第二步：部署到 Vercel
1. 注册 https://vercel.com（用 Google 账号登录）
2. 点击「Add New Project」→ 选择 ai-writer 仓库
3. 直接点「Deploy」，等待约1分钟

### 第三步：填入 Gemini API Key
1. 部署完成后点「Settings」→「Environment Variables」
2. Name: GEMINI_API_KEY
3. Value: 你的 AIza... 密钥
4. 保存后点「Redeploy」

### 完成！
你会得到 https://ai-writer-xxx.vercel.app 的网址，发给任何人直接用！

## 费用：完全免费
- Vercel 托管：永久免费
- Gemini API：每天 1500 次免费请求
