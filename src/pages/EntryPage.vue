<script setup lang="ts">
const highlights = [
  {
    title: "页面开发",
    description: "基于 Vue 3 与 Ionic 构建移动端页面，兼顾交互体验与开发效率。",
  },
  {
    title: "组件复用",
    description: "梳理公共模块，降低重复开发成本，让页面结构更清晰易维护。",
  },
  {
    title: "兼容适配",
    description: "兼顾小屏设备、底部安全区和常见 WebView，保证显示稳定。",
  },
];

const actions = [
  { label: "查看个人主页", path: "/mine" },
  { label: "开始浏览项目", path: "#features" },
];
</script>

<template>
  <div class="page">
    <section class="hero">
      <p class="eyebrow">WELCOME</p>
      <h1 class="title">移动端页面示例项目</h1>
      <p class="subtitle">
        这是一个更常规的首页版本，聚焦页面展示、功能入口和项目亮点，不再保留抽奖交互。
      </p>

      <div class="action-group">
        <router-link
          v-for="item in actions"
          :key="item.label"
          :to="item.path"
          class="action-btn"
          :class="{ secondary: item.path === '#features' }"
        >
          {{ item.label }}
        </router-link>
      </div>
    </section>

    <section id="features" class="section">
      <div class="section-head">
        <p class="section-kicker">PROJECT FEATURES</p>
        <h2 class="section-title">首页重点内容</h2>
      </div>

      <div class="card-list">
        <article v-for="item in highlights" :key="item.title" class="card">
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-desc">{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section class="summary">
      <div class="summary-card">
        <p class="summary-label">当前项目</p>
        <p class="summary-value">Vue 3 + TypeScript + Ionic</p>
      </div>
      <div class="summary-card">
        <p class="summary-label">页面风格</p>
        <p class="summary-value">简洁、适合移动端展示</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24px 16px calc(108px + env(safe-area-inset-bottom, 0px));
  padding: 24px 16px calc(108px + constant(safe-area-inset-bottom));
  box-sizing: border-box;
  background:
    radial-gradient(circle at top left, rgba(97, 114, 255, 0.18), transparent 35%),
    linear-gradient(180deg, #f6f8ff 0%, #eef3ff 100%);
}

.hero,
.card,
.summary-card {
  box-sizing: border-box;
}

.hero {
  padding: 28px 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 18px 42px rgba(49, 73, 166, 0.12);
}

.eyebrow,
.subtitle,
.section-kicker,
.card-desc,
.summary-label,
.summary-value {
  margin: 0;
}

.eyebrow,
.section-kicker {
  font-size: 12px;
  letter-spacing: 1.8px;
  color: #6e78a8;
}

.title {
  margin: 10px 0 12px;
  font-size: 30px;
  line-height: 1.25;
  color: #1d2850;
}

.subtitle {
  max-width: 560px;
  font-size: 15px;
  line-height: 1.8;
  color: #4d5a75;
}

.action-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 132px;
  padding: 12px 18px;
  border-radius: 999px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #6a5cff, #3b82f6);
  box-shadow: 0 10px 18px rgba(72, 94, 255, 0.22);
}

.action-btn.secondary {
  color: #2f4ea2;
  background: #eaf0ff;
  box-shadow: none;
}

.section {
  margin-top: 18px;
}

.section-head {
  margin-bottom: 12px;
}

.section-title {
  margin: 6px 0 0;
  font-size: 22px;
  color: #1d2850;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.card,
.summary-card {
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 28px rgba(49, 73, 166, 0.08);
}

.card-title {
  margin: 0 0 8px;
  font-size: 18px;
  color: #22315d;
}

.card-desc {
  font-size: 14px;
  line-height: 1.7;
  color: #5d6983;
}

.summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.summary-label {
  font-size: 13px;
  color: #6b7694;
}

.summary-value {
  margin-top: 8px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  color: #25325d;
}

@supports (backdrop-filter: blur(8px)) {
  .hero,
  .card,
  .summary-card {
    backdrop-filter: blur(10px);
  }
}

@media (max-width: 768px) {
  .card-list,
  .summary {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page {
    padding-top: 18px;
    padding-left: 12px;
    padding-right: 12px;
  }

  .hero,
  .card,
  .summary-card {
    border-radius: 18px;
  }

  .title {
    font-size: 26px;
  }

  .subtitle,
  .card-desc,
  .summary-value {
    font-size: 14px;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
