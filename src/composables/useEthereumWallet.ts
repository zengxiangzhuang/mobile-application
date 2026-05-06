import { ref, computed } from "vue";
import { createWalletClient, custom, formatEther } from "viem";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export type RpcCallLog = {
  method: string;
  ok: boolean;
  detail: string;
};

const address = ref<`0x${string}` | null>(null);
const chainId = ref<number | null>(null);
const balanceWei = ref<bigint | null>(null);
const error = ref<string | null>(null);
const loading = ref(false);
const apiLogs = ref<RpcCallLog[]>([]);
const probingApis = ref(false);

const stringifyResult = (value: unknown, maxLen = 800): string => {
  if (value === undefined) {
    return "undefined";
  }
  if (typeof value === "bigint") {
    return value.toString();
  }
  try {
    const s = JSON.stringify(value, (_k, v) => (typeof v === "bigint" ? v.toString() : v));
    if (s.length > maxLen) {
      return `${s.slice(0, maxLen)}…(共 ${s.length} 字符)`;
    }
    return s;
  } catch {
    return String(value);
  }
};

const getProvider = () => window.ethereum;

const callRpc = async (method: string, params?: unknown[]): Promise<RpcCallLog> => {
  const eth = getProvider();
  if (!eth?.request) {
    return { method, ok: false, detail: "无 window.ethereum.request" };
  }
  try {
    const raw = await eth.request({ method, params });
    return { method, ok: true, detail: stringifyResult(raw) };
  } catch (e) {
    const msg =
      e && typeof e === "object" && "message" in e ? String((e as { message?: string }).message) : String(e);
    return { method, ok: false, detail: msg };
  }
};

const readBalance = async (acc: `0x${string}`) => {
  const eth = getProvider();
  if (!eth?.request) {
    return;
  }
  const hex = (await eth.request({
    method: "eth_getBalance",
    params: [acc, "latest"],
  })) as string;
  balanceWei.value = BigInt(hex);
};

const refreshChain = async () => {
  const eth = getProvider();
  if (!eth?.request) {
    return;
  }
  const hex = (await eth.request({ method: "eth_chainId" })) as string;
  chainId.value = Number.parseInt(hex, 16);
};

/** 尽可能多地调用常见 JSON-RPC / 钱包扩展方法；失败也会记录，不抛错中断整批。 */
const probeApis = async (acc: `0x${string}` | null, includeUserConsentMethods: boolean) => {
  probingApis.value = true;
  const logs: RpcCallLog[] = [];

  const push = (row: RpcCallLog) => {
    logs.push(row);
  };

  const run = async (method: string, params?: unknown[]) => {
    push(await callRpc(method, params));
  };

  try {
    await run("eth_accounts");
    await run("eth_chainId");
    await run("net_version");
    await run("eth_networkId");
    await run("eth_blockNumber");
    await run("eth_gasPrice");
    await run("eth_maxPriorityFeePerGas");
    await run("eth_syncing");
    await run("eth_protocolVersion");
    await run("web3_clientVersion");
    await run("wallet_getPermissions");

    if (acc) {
      await run("eth_getBalance", [acc, "latest"]);
      await run("eth_getTransactionCount", [acc, "latest"]);
      await run("eth_getCode", [acc, "latest"]);
      await run("eth_getProof", [acc, [], "latest"]);
      await run("eth_estimateGas", [{ from: acc, to: acc, value: "0x0" }]);
      await run("eth_call", [{ to: acc, data: "0x" }, "latest"]);
    }

    await run("eth_getBlockByNumber", ["latest", false]);
    await run("eth_feeHistory", ["0x5", "latest", [25, 50, 75]]);

    if (includeUserConsentMethods && acc) {
      await run("personal_sign", ["Mobile Web3 API 探测（可拒绝）", acc]);
      await run("eth_signTypedData_v4", [
        acc,
        JSON.stringify({
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
            ],
            Probe: [{ name: "note", type: "string" }],
          },
          primaryType: "Probe",
          domain: { name: "MobileAppProbe", version: "1", chainId: chainId.value ?? 1 },
          message: { note: "typed data probe" },
        }),
      ]);
    }
  } finally {
    apiLogs.value = logs;
    probingApis.value = false;
  }
};

export function useEthereumWallet() {
  const hasProvider = computed(() => typeof window !== "undefined" && Boolean(getProvider()?.request));

  const balanceFormatted = computed(() => {
    if (balanceWei.value === null) {
      return "—";
    }
    return `${formatEther(balanceWei.value)} ETH`;
  });

  const shortAddress = computed(() => {
    if (!address.value) {
      return "";
    }
    const a = address.value;
    return `${a.slice(0, 6)}…${a.slice(-4)}`;
  });

  const getWalletClient = () => {
    const eth = getProvider();
    if (!eth?.request) {
      throw new Error("未检测到浏览器钱包（如 MetaMask）。请在支持注入钱包的环境打开。");
    }
    return createWalletClient({ transport: custom(eth) });
  };

  const connect = async () => {
    error.value = null;
    loading.value = true;
    try {
      const client = getWalletClient();
      const accounts = await client.requestAddresses();
      const first = accounts[0];
      if (!first) {
        throw new Error("未获取到账户地址");
      }
      address.value = first;
      await refreshChain();
      await readBalance(first);
      void probeApis(first, false);
    } catch (e) {
      address.value = null;
      chainId.value = null;
      balanceWei.value = null;
      apiLogs.value = [];
      error.value = e instanceof Error ? e.message : "连接失败";
    } finally {
      loading.value = false;
    }
  };

  const disconnect = () => {
    address.value = null;
    chainId.value = null;
    balanceWei.value = null;
    error.value = null;
    apiLogs.value = [];
  };

  const refresh = async () => {
    if (!address.value) {
      return;
    }
    error.value = null;
    loading.value = true;
    try {
      await refreshChain();
      await readBalance(address.value);
      void probeApis(address.value, false);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "刷新失败";
    } finally {
      loading.value = false;
    }
  };

  const runProbeReadOnly = () => probeApis(address.value, false);
  const runProbePublicOnly = () => probeApis(null, false);
  const runProbeWithSigner = () => {
    if (!address.value) {
      return;
    }
    void probeApis(address.value, true);
  };

  return {
    address,
    chainId,
    balanceWei,
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
  };
}
