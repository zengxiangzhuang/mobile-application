<script setup lang="ts">
import { computed, ref } from 'vue'

type QuickLink = {
  label: string
  value: string
  description: string
}

const profile = {
  name: 'Jasper Zeng',
  role: '前端开发工程师',
  city: '武汉',
  slogan: '专注于移动端体验、组件化与工程化落地',
  bio: '喜欢把复杂需求整理成清晰、稳定、好维护的页面和交互，平时也会关注性能优化与跨端兼容。',
  email: 'zengxiangzhuang@yeah.net',
  github: 'https://github.com/',
}

const stats = [
  { label: '项目经验', value: '12+' },
  { label: '上线页面', value: '30+' },
  { label: '技术方向', value: 'Vue / Ionic' },
]

const quickLinks: QuickLink[] = [
  {
    label: '邮箱',
    value: profile.email,
    description: '工作联系优先使用邮件，便于跟进记录',
  },
  {
    label: 'GitHub',
    value: profile.github,
    description: '沉淀一些前端练习与页面 demo',
  },
]

const skills = ['Vue 3', 'Vue 2', 'TypeScript', 'React', 'Pinia', 'Vite', 'ECharts']

const copiedText = ref('')
const copyMessage = ref('点击卡片可复制联系信息')

const initials = computed(() => profile.name.slice(0, 1))

const copyText = async (text: string) => {
  copiedText.value = text

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    copyMessage.value = `已复制：${text}`
    return
  }

  // 兼容旧环境：回退到 document.execCommand("copy")
  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'fixed'
    textarea.style.top = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()

    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    copyMessage.value = success ? `已复制：${text}` : `当前环境不支持自动复制`
    return
  }

  copyMessage.value = '当前环境不支持自动复制'
}
</script>

<template>
  <div class="page">
    <section class="hero">
      <div class="avatar">{{ initials }}</div>
      <div class="hero-main">
        <p class="eyebrow">PERSONAL PROFILE</p>
        <h1 class="name">{{ profile.name }}</h1>
        <p class="role">{{ profile.role }} · {{ profile.city }}</p>
        <p class="slogan">{{ profile.slogan }}</p>
      </div>
    </section>

    <section class="card intro-card">
      <h2 class="section-title">关于我</h2>
      <p class="intro-text">{{ profile.bio }}</p>
    </section>

    <section class="stats-grid">
      <article v-for="item in stats" :key="item.label" class="card stat-card">
        <p class="stat-value">{{ item.value }}</p>
        <p class="stat-label">{{ item.label }}</p>
      </article>
    </section>

    <section class="card">
      <div class="section-head">
        <h2 class="section-title">常用技能</h2>
        <span class="section-tip">适配移动端与 Web 视图</span>
      </div>
      <div class="tags">
        <span v-for="item in skills" :key="item" class="tag">{{ item }}</span>
      </div>
    </section>

    <section class="card">
      <div class="section-head">
        <h2 class="section-title">联系我</h2>
        <span class="copy-tip">{{ copyMessage }}</span>
      </div>
      <button
        v-for="item in quickLinks"
        :key="item.label"
        class="contact-item"
        type="button"
        @click="copyText(item.value)"
      >
        <span class="contact-label">{{ item.label }}</span>
        <strong class="contact-value">{{ item.value }}</strong>
        <span class="contact-desc">{{ item.description }}</span>
      </button>
    </section>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24px 16px calc(108px + env(safe-area-inset-bottom, 0px));
  padding: 24px 16px calc(108px + constant(safe-area-inset-bottom));
  background:
    radial-gradient(circle at top left, rgba(106, 92, 255, 0.18), transparent 35%),
    linear-gradient(180deg, #f7f8ff 0%, #eff3ff 100%);
  color: #18213a;
  box-sizing: border-box;
}

.hero,
.card,
.stat-card {
  box-sizing: border-box;
}

.hero {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 14px 36px rgba(62, 80, 170, 0.12);
}

.avatar {
  flex: 0 0 72px;
  width: 72px;
  height: 72px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #6a5cff, #33b6ff);
}

.hero-main {
  min-width: 0;
}

.eyebrow,
.role,
.slogan,
.intro-text,
.stat-label,
.section-tip,
.copy-tip,
.contact-desc {
  margin: 0;
}

.eyebrow {
  font-size: 12px;
  letter-spacing: 1.8px;
  color: #6f79a8;
}

.name {
  margin: 8px 0 6px;
  font-size: 28px;
  line-height: 1.2;
}

.role {
  font-size: 14px;
  color: #52607a;
}

.slogan {
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: #36425b;
}

.card {
  margin-top: 16px;
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 28px rgba(62, 80, 170, 0.08);
}

.section-head {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-title {
  margin: 0;
  font-size: 18px;
}

.section-tip,
.copy-tip,
.contact-desc,
.intro-text,
.stat-label {
  font-size: 13px;
  color: #68758e;
}

.intro-text {
  line-height: 1.8;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.stat-card {
  padding: 18px 12px;
  text-align: center;
}

.stat-value {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 700;
  color: #3448c5;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
  color: #31405e;
  background: #eef3ff;
}

.contact-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 12px;
  padding: 14px;
  border: 1px solid #e5ebff;
  border-radius: 16px;
  background: #f9fbff;
  text-align: left;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
}

.contact-item:first-of-type {
  margin-top: 0;
}

.contact-label {
  font-size: 12px;
  color: #6f79a8;
}

.contact-value {
  font-size: 16px;
  color: #1d2850;
  word-break: break-all;
}

.contact-item:active {
  transform: scale(0.99);
}

@supports (backdrop-filter: blur(8px)) {
  .hero,
  .card {
    backdrop-filter: blur(10px);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page {
    padding-top: 18px;
    padding-left: 12px;
    padding-right: 12px;
  }

  .hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    font-size: 26px;
  }

  .name {
    font-size: 24px;
  }

  .section-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
