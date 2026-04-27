<template>
  <div class="page">
    <div class="panel">
      <h1 class="title">幸运大转盘</h1>
      <p class="subtitle">轻点按钮，试试今天的运气</p>

      <div class="wheel-wrap">
        <div class="pointer"></div>

        <div class="wheel-ring">
          <div class="wheel" :style="wheelStyle">
            <!--
              这段代码通过 v-for 指令，遍历 prizes 数组中的每一项（item 表示奖项，index 表示索引）。
              每一个奖项都会渲染成一个 <div>，它的显示文本为奖项的名字（{{ item.name }}）。
              :key 指定为 prize 的名字，用于高效地更新 DOM。
              class="label" 应用于每个奖项的标签样式。
              :style="getLabelStyle(index)" 则根据当前奖项的索引调用 getLabelStyle 方法，设置每个标签的样式（比如旋转角度等，用于让文字在大转盘上正确分布）。
            -->
            <div
              v-for="(item, index) in prizes"
              :key="item.name"
              class="label"
              :style="getLabelStyle(index)"
            >
              {{ item.name }}
            </div>

            <div class="center-dot">GO</div>
          </div>
        </div>
      </div>

      <button class="spin-btn" :disabled="isSpinning" @click="spin">
        {{ isSpinning ? "抽奖中..." : "开始抽奖" }}
      </button>

      <p class="result">{{ resultText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

type Prize = {
  name: string;
  color: string;
};

const prizes: Prize[] = [
  { name: "谢谢参与", color: "#ff7675" },
  { name: "5元红包", color: "#74b9ff" },
  { name: "再来一次", color: "#55efc4" },
  { name: "10积分", color: "#ffeaa7" },
  { name: "20元券", color: "#a29bfe" },
  { name: "1元红包", color: "#fab1a0" },
  { name: "神秘礼包", color: "#81ecec" },
  { name: "100积分", color: "#fdcb6e" },
];

const isSpinning = ref(false);
const currentRotation = ref(0);
const resultText = ref("点击开始抽奖，看看今天手气如何！");

const segmentAngle = computed(() => 360 / prizes.length);

const wheelBackground = computed(() => {
  const segments = prizes.map((item, index) => {
    const start = index * segmentAngle.value;
    const end = (index + 1) * segmentAngle.value;
    return `${item.color} ${start}deg ${end}deg`;
  });
  return `conic-gradient(${segments.join(", ")})`;
});

const wheelStyle = computed(() => ({
  background: wheelBackground.value,
  transform: `rotate(${currentRotation.value}deg)`,
  transition: isSpinning.value ? "transform 4.5s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
}));

const getLabelStyle = (index: number) => {
  const angle = index * segmentAngle.value + segmentAngle.value / 2;
  return {
    transform: `rotate(${angle}deg) translateY(-115px) rotate(${-angle}deg)`,
  };
};

const spin = () => {
  if (isSpinning.value) {
    return;
  }

  isSpinning.value = true;
  resultText.value = "转盘飞速旋转中...";

  const winnerIndex = Math.floor(Math.random() * prizes.length);
  const winnerCenterAngle = winnerIndex * segmentAngle.value + segmentAngle.value / 2;
  const currentNormalized = ((currentRotation.value % 360) + 360) % 360;
  const alignToPointer = (360 - winnerCenterAngle - currentNormalized + 360) % 360;
  const extraSpins = 4 + Math.floor(Math.random() * 3);
  const totalRotate = extraSpins * 360 + alignToPointer;

  currentRotation.value += totalRotate;

  window.setTimeout(() => {
    isSpinning.value = false;
    resultText.value = `恭喜你抽中：${prizes[winnerIndex].name}`;
  }, 4600);
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(circle at 18% 20%, #f9e8ff 0%, transparent 38%),
    radial-gradient(circle at 80% 85%, #d9fbff 0%, transparent 36%),
    linear-gradient(145deg, #f5f7ff, #ebeeff);
}

.panel {
  width: min(94vw, 420px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 30px 20px 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.65);
  box-shadow:
    0 22px 55px rgba(68, 58, 145, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(7px);
}

.title {
  margin: 0;
  font-size: 30px;
  letter-spacing: 1px;
  color: #2b2667;
}

.subtitle {
  margin: 0 0 8px;
  font-size: 14px;
  color: #6d6b8a;
}

.wheel-wrap {
  position: relative;
  width: 300px;
  height: 300px;
}

.wheel-ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  padding: 10px;
  background: linear-gradient(145deg, #ffffff, #f0f4ff);
  box-shadow:
    0 14px 30px rgba(68, 58, 145, 0.26),
    0 0 0 5px rgba(255, 255, 255, 0.65);
}

.pointer {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  border-top: 28px solid #2b2667;
  filter: drop-shadow(0 4px 6px rgba(43, 38, 103, 0.28));
  z-index: 4;
}

.wheel {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 8px solid rgba(255, 255, 255, 0.95);
  box-shadow:
    inset 0 0 0 2px rgba(255, 255, 255, 0.65),
    0 10px 26px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  width: 96px;
  margin-left: -48px;
  text-align: center;
  font-size: 13px;
  font-weight: 800;
  color: #1e1b4d;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
}

.center-dot {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 66px;
  height: 66px;
  border-radius: 50%;
  background: linear-gradient(145deg, #ffffff, #fff5d7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #e17055;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.spin-btn {
  border: none;
  border-radius: 999px;
  padding: 13px 30px;
  margin-top: 4px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #ffffff;
  background: linear-gradient(135deg, #6e4dff, #4c7dff 55%, #2fb3ff);
  box-shadow:
    0 10px 20px rgba(80, 90, 255, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    filter 0.18s ease;
}

.spin-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 14px 26px rgba(80, 90, 255, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.spin-btn:active:not(:disabled) {
  transform: translateY(0);
  filter: brightness(0.98);
}

.spin-btn:disabled {
  opacity: 0.72;
  cursor: not-allowed;
}

.result {
  margin: 0;
  min-height: 44px;
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  text-align: center;
  font-size: 16px;
  color: #2d235f;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: inset 0 0 0 1px rgba(125, 124, 191, 0.2);
}

@media (max-width: 420px) {
  .panel {
    padding: 24px 14px 18px;
    border-radius: 20px;
  }

  .title {
    font-size: 24px;
  }

  .wheel-wrap {
    width: 268px;
    height: 268px;
  }

  .label {
    width: 86px;
    margin-left: -43px;
    font-size: 12px;
  }
}
</style>
