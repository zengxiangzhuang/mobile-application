<script setup lang="ts">
import { useRoute } from 'vue-router'
import { homeOutline, personOutline } from 'ionicons/icons'

const route = useRoute()

// TabBar 列表（包含标签、图标、跳转路径）
const list = [
  { label: 'home', icon: homeOutline, path: '/' },
  { label: 'mine', icon: personOutline, path: '/mine' },
]

// 手动跳转方法（可选，也可以用 router-link）
// const handleTabClick = (path: string) => {
//   router.push(path)
// }

// 判断当前 Tab 是否选中
const isActive = (path: string) => {
  return route.path === path
}
</script>

<template>
  <router-view></router-view>
  <ul class="tabbar">
    <!-- 方式1：推荐用 router-link（自带导航激活类，更简洁） -->
    <li class="tabbar-item" v-for="item in list" :key="item.label">
      <router-link :to="item.path" class="tab-link" :class="{ active: isActive(item.path) }">
        <ion-icon :icon="item.icon" size="24"></ion-icon>
        <span>{{ item.label }}</span>
      </router-link>
    </li>

    <!-- 方式2：手动绑定点击事件（适合需要自定义逻辑的场景） -->
    <!-- <li 
      class="tabbar-item" 
      v-for="item in list" 
      :key="item.label"
      :class="{ active: isActive(item.path) }"
      @click="handleTabClick(item.path)"
    >
      <ion-icon :icon="item.icon" size="24"></ion-icon>
      <span>{{ item.label }}</span>
    </li> -->
  </ul>
</template>

<style scoped>
.tabbar {
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
  list-style: none;
  margin: 0;
  padding: 10px 0;
  background: #fff;
  border-top: 1px solid #eee;
}

.tabbar-item {
  width: 50%;
  text-align: center;
}

/* 路由链接样式重置 */
.tab-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  font-size: 12px;
}

/* 选中态样式 */
.tab-link.active {
  color: #2d8cf0; /* 选中文字/图标颜色 */
}

.tab-link ion-icon {
  margin-bottom: 4px;
}
</style>
