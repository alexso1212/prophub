# meoo 部署指南

## 快速开始

```bash
# 安装依赖
pnpm install

# 构建产物（输出到 dist/）
pnpm build
```

构建产物：`dist/` 目录，约 587 KiB bundle。

---

## 阿里云部署三种姿势

### 方式 A：OSS 静态托管（推荐，最简单）

1. 创建 OSS Bucket，开启「静态网站托管」
   - 默认首页：`index.html`
   - 错误页：**留空**（HashRouter 不需要 fallback）

2. 安装 ossutil 并配置：

```bash
# macOS
brew install ossutil

# 配置（替换为你的 AccessKey）
ossutil config -e oss-cn-hangzhou.aliyuncs.com \
               -i <AccessKeyId> \
               -k <AccessKeySecret>
```

3. 上传 dist 到 Bucket：

```bash
ossutil cp -r /path/to/meoo/dist/ oss://your-bucket-name/ --meta "Cache-Control:max-age=31536000,immutable"

# index.html 单独设置短缓存
ossutil set-meta oss://your-bucket-name/index.html "Cache-Control:no-cache,max-age=300" --update
```

4. 绑定自定义域名（可选）：OSS 控制台 → 域名管理 → 绑定域名 → 配置 CDN 加速。

---

### 方式 B：ECS + nginx

1. 将代码同步到服务器（排除 node_modules）：

```bash
rsync -avz --exclude 'node_modules' --exclude 'dist' \
      /path/to/meoo/ root@<ECS_IP>:/var/www/meoo/
```

2. 在服务器上构建：

```bash
ssh root@<ECS_IP>
cd /var/www/meoo
pnpm install
pnpm build
```

3. nginx 配置（`/etc/nginx/sites-available/meoo.conf`）：

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/meoo/dist;
    index index.html;

    # index.html — 短缓存（5 分钟）
    location = /index.html {
        add_header Cache-Control "no-cache, max-age=300";
    }

    # 静态资源 — 长缓存 1 年（带 hash 的文件名）
    location ~* \.(js|css|png|jpg|svg|woff2?)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        expires 1y;
    }

    # HashRouter：所有路由都落到 index.html（实际上 # 路由不需要，保险起见保留）
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
nginx -t && systemctl reload nginx
```

---

### 方式 C：容器化

项目同目录有 `Dockerfile`（由另一 agent 同步创建），构建并推送到阿里云 ACR：

```bash
# 构建镜像
docker build -t meoo:latest /path/to/meoo/

# 登录阿里云 ACR
docker login registry.cn-hangzhou.aliyuncs.com \
       -u <阿里云账号> \
       -p <ACR密码>

# 打标签并推送
docker tag meoo:latest registry.cn-hangzhou.aliyuncs.com/<namespace>/meoo:latest
docker push registry.cn-hangzhou.aliyuncs.com/<namespace>/meoo:latest
```

后续可在 ACK（Kubernetes）或 SAE（Serverless 应用引擎）中直接拉取该镜像部署。

---

## 注意事项

| 项目 | 说明 |
|------|------|
| 镜像源 | `.npmrc` 已配置 npmmirror，国内 `pnpm install` 无需翻墙 |
| HashRouter | URL 带 `#`，OSS/nginx 均**不需要**配置 SPA fallback |
| bundle 体积 | 587 KiB，未做 code splitting；首屏加速建议接 CDN |
| 缓存策略 | `index.html` 5 分钟；其他静态资源 1 年 immutable |
| 域名备案 | 阿里云国内节点必须备案，备案前只能用外网 IP 访问 |

---

## 环境变量

目前 meoo **没有运行时环境变量**，数据全部 hardcode 在 `src/data/`。  
如后续接入 API，在项目根目录创建 `.env` 并在 webpack 配置中注入即可。

---

## 故障排查

**pnpm install 报 anpm.alibaba-inc.com 超时**

```bash
# 删除 lock 文件，用 .npmrc 里的 npmmirror 重装
rm pnpm-lock.yaml
pnpm install
```

**HashRouter URL 刷新报 404**

- OSS：检查「静态网站托管」→ 默认首页是否设为 `index.html`
- nginx：检查 `try_files $uri $uri/ /index.html;` 是否生效

**framer-motion 警告找不到 @emotion/is-prop-valid**

```bash
# 可选 peer dep，不影响运行；要消除警告：
pnpm add @emotion/is-prop-valid
```
