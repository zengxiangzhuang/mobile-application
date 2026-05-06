<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useEthereumWallet } from "@/composables/useEthereumWallet";

const {
  address,
  chainId,
  balanceFormatted,
  shortAddress,
  error,
  loading,
  hasProvider,
  apiLogs,
  probingApis,
  connect,
  disconnect,
  refresh,
  runProbeReadOnly,
  runProbePublicOnly,
  runProbeWithSigner,
} = useEthereumWallet();

const onAccountsChanged = (accounts: unknown) => {
  const list = accounts as string[];
  if (!list?.length) {
    disconnect();
    return;
  }
  const first = list[0] as `0x${string}` | undefined;
  if (first) {
    address.value = first;
    void refresh();
  }
};

const onChainChanged = () => {
  void refresh();
};

onMounted(() => {
  const eth = window.ethereum;
  if (!eth?.on) {
    return;
  }
  eth.on("accountsChanged", onAccountsChanged);
  eth.on("chainChanged", onChainChanged);
});

onUnmounted(() => {
  const eth = window.ethereum;
  if (!eth?.removeListener) {
    return;
  }
  eth.removeListener("accountsChanged", onAccountsChanged);
  eth.removeListener("chainChanged", onChainChanged);
});
</script>

<template>
  <div class="page">
    <header class="hero">
      <p class="eyebrow">WEB3</p>
      <h1 class="title">链上钱包</h1>
      <p class="desc">
        通过浏览器注入的以太坊 Provider（如 MetaMask）连接账户，查看链 ID 与主币余额。下方会<strong>尽可能多地</strong>调用常见
        <code>ethereum.request</code> 方法；不支持或拒绝的接口会显示为失败，不影响其它调用。
      </p>
    </header>

    <section v-if="!hasProvider" class="card warn">
      <p class="card-title">未检测到钱包</p>
      <p class="card-text">请安装 MetaMask 或在已注入 <code>window.ethereum</code> 的 WebView 中打开本页。</p>
    </section>

    <section v-else class="card">
      <div class="row">
        <p class="card-title">连接状态</p>
        <span v-if="loading" class="badge">处理中</span>
        <span v-else-if="address" class="badge ok">已连接</span>
        <span v-else class="badge muted">未连接</span>
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="actions">
        <button
          type="button"
          class="btn ghost"
          :disabled="loading || probingApis"
          @click="runProbePublicOnly"
        >
          探测公开接口（可不连接）
        </button>
        <button v-if="!address" type="button" class="btn primary" :disabled="loading" @click="connect">
          连接钱包
        </button>
        <template v-else>
          <button type="button" class="btn ghost" :disabled="loading || probingApis" @click="refresh">
            刷新
          </button>
          <button type="button" class="btn ghost" :disabled="loading || probingApis" @click="runProbeReadOnly">
            再跑一轮只读探测
          </button>
          <button type="button" class="btn primary" :disabled="loading || probingApis" @click="runProbeWithSigner">
            含签名探测（会弹窗，可拒绝）
          </button>
          <button type="button" class="btn danger" :disabled="loading" @click="disconnect">断开</button>
        </template>
      </div>

      <dl v-if="address" class="kv">
        <div class="kv-row">
          <dt>地址</dt>
          <dd class="mono">{{ address }}</dd>
        </div>
        <div class="kv-row">
          <dt>缩写</dt>
          <dd>{{ shortAddress }}</dd>
        </div>
        <div class="kv-row">
          <dt>链 ID</dt>
          <dd>{{ chainId ?? "—" }}</dd>
        </div>
        <div class="kv-row">
          <dt>主币余额</dt>
          <dd>{{ balanceFormatted }}</dd>
        </div>
      </dl>
    </section>

    <section v-if="hasProvider && apiLogs.length" class="card log-card">
      <div class="row">
        <p class="card-title">接口调用结果</p>
        <span v-if="probingApis" class="badge">探测中…</span>
      </div>
      <p class="log-hint">绿色为成功返回，红色为失败（钱包不支持、RPC 未实现或用户拒绝均属正常）。</p>
      <ul class="log-list">
        <li v-for="(row, idx) in apiLogs" :key="`${row.method}-${idx}`" class="log-item" :class="{ ok: row.ok }">
          <span class="log-method">{{ row.method }}</span>
          <span class="log-detail">{{ row.detail }}</span>
        </li>
      </ul>
    </section>

    <section class="card muted-card">
      <p class="card-title">说明</p>
      <ul class="tips">
        <li>「只读探测」会连续请求多组 JSON-RPC，失败也会记录在列表里。</li>
        <li>「含签名探测」会尝试 <code>personal_sign</code> 与 <code>eth_signTypedData_v4</code>，钱包会弹窗，你可直接拒绝以观察失败信息。</li>
        <li>切换网络或账户后，钱包会触发事件，本页会自动同步。</li>
      </ul>
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
    radial-gradient(circle at 90% 10%, rgba(99, 102, 241, 0.2), transparent 40%),
    linear-gradient(180deg, #0f172a 0%, #111827 45%, #1e293b 100%);
  color: #e2e8f0;
}

.hero,
.card {
  box-sizing: border-box;
}

.eyebrow,
.desc,
.card-text,
.tips {
  margin: 0;
}

.eyebrow {
  font-size: 12px;
  letter-spacing: 2px;
  color: #94a3b8;
}

.title {
  margin: 10px 0 12px;
  font-size: 28px;
  line-height: 1.2;
  color: #f8fafc;
}

.desc {
  font-size: 14px;
  line-height: 1.75;
  color: #cbd5e1;
}

.card {
  margin-top: 16px;
  padding: 18px;
  border-radius: 18px;
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
}

.card.warn {
  border-color: rgba(251, 191, 36, 0.45);
  background: rgba(30, 27, 19, 0.9);
}

.muted-card {
  opacity: 0.95;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #f1f5f9;
}

.card-text {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.7;
  color: #cbd5e1;
}

.card-text code {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.8);
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.badge {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.25);
  color: #e2e8f0;
}

.badge.ok {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
}

.badge.muted {
  background: rgba(71, 85, 105, 0.35);
  color: #cbd5e1;
}

.error {
  margin: 12px 0 0;
  font-size: 13px;
  color: #fca5a5;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.btn {
  border: none;
  border-radius: 12px;
  padding: 11px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn.primary {
  color: #0f172a;
  background: linear-gradient(135deg, #a5b4fc, #38bdf8);
}

.btn.ghost {
  color: #e2e8f0;
  background: rgba(148, 163, 184, 0.2);
}

.btn.danger {
  color: #fecaca;
  background: rgba(239, 68, 68, 0.25);
}

.kv {
  margin: 18px 0 0;
  padding: 0;
}

.kv-row {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 10px;
  padding: 10px 0;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

.kv-row:first-of-type {
  border-top: none;
  padding-top: 0;
}

.kv dt {
  margin: 0;
  font-size: 13px;
  color: #94a3b8;
}

.kv dd {
  margin: 0;
  font-size: 13px;
  color: #f1f5f9;
  word-break: break-all;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
}

.tips {
  margin-top: 12px;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.7;
  color: #94a3b8;
}

.tips li + li {
  margin-top: 6px;
}

.log-card {
  padding-bottom: 14px;
}

.log-hint {
  margin: 0 0 12px;
  font-size: 12px;
  line-height: 1.6;
  color: #94a3b8;
}

.log-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 320px;
  overflow: auto;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.log-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  font-size: 12px;
}

.log-item:last-child {
  border-bottom: none;
}

.log-item.ok .log-method {
  color: #86efac;
}

.log-item:not(.ok) .log-method {
  color: #fca5a5;
}

.log-method {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-weight: 600;
}

.log-detail {
  color: #cbd5e1;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
