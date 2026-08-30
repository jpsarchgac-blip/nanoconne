<template>
  <IslandWindow>
    <div v-if="!ready" class="desk desk--login">
      <p class="lead">確認しています。</p>
    </div>

    <div v-else-if="!isAdmin" class="play">
      <header>
        <p class="kicker">管理</p>
        <h1>管理者で、入る。</h1>
        <p class="lead">本の公開、インターン情報、初日の開始は、この窓の中で行います。</p>
      </header>
      <form class="join" @submit.prevent="onLogin">
        <label>
          管理者名
          <input v-model="user" autocomplete="username" />
        </label>
        <label>
          パスワード
          <input v-model="password" type="password" autocomplete="current-password" />
        </label>
        <button type="submit">入る</button>
        <p v-if="loginError" class="err">{{ loginError }}</p>
      </form>
    </div>

    <div v-else class="desk">
      <header class="top">
        <div>
          <p class="kicker">管理</p>
          <h1>この窓で、全部。</h1>
        </div>
        <button type="button" class="logout" @click="onLogout">出る</button>
      </header>

      <section class="block">
        <h2>アイスブレイク</h2>
        <p class="status">
          {{ phaseLabel }}
          <template v-if="session.started"> · {{ session.count }}人</template>
          <template v-if="session.round"> · {{ session.round }}/{{ session.totalRounds }}周</template>
        </p>
        <p v-if="session.topic" class="status-topic">お題：{{ session.topic.line }}</p>
        <div class="actions">
          <button type="button" class="dock-btn dock-btn--start" @click="start">
            {{ session.started ? "場をやり直す" : "開始" }}
          </button>
          <button
            v-if="session.started && session.phase === 'lobby'"
            type="button"
            class="dock-btn dock-btn--advance"
            @click="advanceLobby"
          >
            1人でもお題へ
          </button>
          <NuxtLink to="/screen" class="dock-btn dock-btn--screen">投影</NuxtLink>
        </div>
        <p v-if="startedNote" class="done">{{ startedNote }}</p>
      </section>

      <section class="block">
        <h2>お題</h2>
        <p class="status">次の開始から反映されます。周数とお題の並びを編集できます。</p>
        <form v-if="iceForm" class="ice-form" @submit.prevent="saveIceTopics">
          <label class="rounds">
            周数
            <input v-model.number="iceForm.rounds" type="number" min="1" max="8" />
          </label>
          <div class="topics">
            <div v-for="(topic, index) in iceForm.topics" :key="index" class="topic-row">
              <span class="topic-num">{{ index + 1 }}</span>
              <input v-model="topic.line" placeholder="お題の文" />
              <button type="button" class="topic-del" @click="removeTopic(index)">外す</button>
            </div>
            <button type="button" class="topic-add" @click="addTopic">お題を足す</button>
          </div>
          <button type="submit" class="save">お題を保存</button>
          <p v-if="iceSaved" class="saved">保存しました</p>
        </form>
      </section>

      <section class="block">
        <h2>本の公開</h2>
        <ul>
          <li v-for="book in books" :key="book.id">
            <span>{{ book.title }}</span>
            <button
              type="button"
              class="toggle"
              :class="book.visible ? 'toggle--show' : 'toggle--hide'"
              @click="toggle(book)"
            >
              {{ book.visible ? "表示" : "隠す" }}
            </button>
          </li>
        </ul>
      </section>

      <section class="block">
        <h2>インターン情報</h2>
        <form v-if="portalForm" class="portal-form" @submit.prevent="savePortal">
          <label>
            開催期間
            <input v-model="portalForm.period" />
          </label>
          <label>
            必須日
            <input v-model="portalForm.requiredDays" />
          </label>
          <label>
            任意日
            <input v-model="portalForm.optionalDays" />
          </label>
          <label>
            会場
            <input v-model="portalForm.venue" />
          </label>
          <label>
            Zoom
            <input v-model="portalForm.zoom" />
          </label>
          <label>
            コース
            <input v-model="portalForm.courses" />
          </label>
          <label>
            賞品（一行）
            <input v-model="portalForm.prizeNote" />
          </label>
          <label>
            課題の大枠
            <input v-model="portalForm.taskOutline" />
          </label>

          <div class="links">
            <p class="links-head">リンク</p>
            <div v-for="(link, index) in portalForm.links" :key="index" class="link-row">
              <input v-model="link.label" placeholder="名前" />
              <input v-model="link.href" placeholder="https://" />
              <button type="button" class="link-del" @click="removeLink(index)">外す</button>
            </div>
            <button type="button" class="link-add" @click="addLink">リンクを足す</button>
          </div>

          <button type="submit" class="save">ポータルを保存</button>
          <p v-if="portalSaved" class="saved">保存しました</p>
        </form>
      </section>
    </div>
  </IslandWindow>
</template>

<script setup lang="ts">
import { ICE_ADMIN_POLL_MS, icePhaseLabel } from "~/utils/icebreak"

type Book = { id: string; title: string; visible: boolean }
type PortalForm = {
  period: string
  requiredDays: string
  optionalDays: string
  venue: string
  zoom: string
  courses: string
  prizeNote: string
  taskOutline: string
  links: { label: string; href: string }[]
}

type IceForm = {
  rounds: number
  topics: { id?: string; line: string }[]
}

const { isAdmin, ready, login, logout } = useAdmin()
const { session, refresh, startIcebreak, skipLobby, adminPost } = useRoom()

const user = ref("admin")
const password = ref("")
const loginError = ref("")
const books = ref<Book[]>([])
const portalForm = ref<PortalForm | null>(null)
const portalSaved = ref(false)
const iceForm = ref<IceForm | null>(null)
const iceSaved = ref(false)
const startedNote = ref("")

const phaseLabel = computed(() => {
  if (!session.value.started) return icePhaseLabel("idle", "admin")
  return icePhaseLabel(session.value.phase, "admin")
})

async function onLogin() {
  loginError.value = ""
  try {
    const result = await login(user.value, password.value)
    if (!result.ok) {
      loginError.value = result.error ?? "入れませんでした"
      return
    }
    password.value = ""
    await load()
  } catch {
    loginError.value = "入れませんでした"
  }
}

async function onLogout() {
  await logout()
  password.value = ""
}

async function load() {
  books.value = await $fetch("/api/books")
  portalForm.value = await $fetch("/api/portal")
  iceForm.value = await $fetch("/api/ice-topics")
  await refresh()
}

async function saveIceTopics() {
  if (!iceForm.value) return
  iceForm.value = await adminPost("/api/ice-topics", iceForm.value)
  iceSaved.value = true
  setTimeout(() => {
    iceSaved.value = false
  }, 2000)
}

function addTopic() {
  if (!iceForm.value) return
  iceForm.value.topics.push({ line: "" })
}

function removeTopic(index: number) {
  if (!iceForm.value || iceForm.value.topics.length <= 1) return
  iceForm.value.topics.splice(index, 1)
}

async function savePortal() {
  if (!portalForm.value) return
  portalForm.value = await adminPost("/api/portal", portalForm.value)
  portalSaved.value = true
  setTimeout(() => {
    portalSaved.value = false
  }, 2000)
}

async function toggle(book: Book) {
  books.value = await adminPost("/api/books", { id: book.id, visible: !book.visible })
}

async function start() {
  if (session.value.started) {
    const ok = window.confirm("進行中の場をリセットします。よろしいですか？")
    if (!ok) return
  }
  await startIcebreak()
  startedNote.value = "開始しました。参加者の画面に「アイスブレイクに参加」が出ます。"
}

async function advanceLobby() {
  await skipLobby()
  startedNote.value = "お題フェーズへ進めました。"
}

function addLink() {
  if (!portalForm.value) return
  portalForm.value.links.push({ label: "", href: "" })
}

function removeLink(index: number) {
  portalForm.value?.links.splice(index, 1)
}

watch(isAdmin, (ok) => {
  if (ok) load()
})

onMounted(async () => {
  if (isAdmin.value) await load()
})

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  timer = setInterval(() => {
    if (isAdmin.value) refresh()
  }, ICE_ADMIN_POLL_MS)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.play {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 0;
}

header {
  padding: 36px 28px 24px 36px;
  border-right: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.kicker {
  margin: 0;
  font-family: "M PLUS Rounded 1c", sans-serif;
  color: var(--nano);
  letter-spacing: 0.16em;
  font-size: 12px;
  font-weight: 700;
}

h1 {
  margin: 10px 0 0;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: clamp(24px, 3vw, 32px);
  line-height: 1.3;
}

.lead {
  margin: 12px 0 0;
  color: var(--muted);
  line-height: 1.7;
  font-size: 14px;
}

.join {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  padding: 32px;
  background: #e7f7fc;
}

.join label {
  display: grid;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}

.join input {
  border: 0;
  background: var(--island);
  padding: 12px 14px;
  font-size: 16px;
  color: var(--ink);
}

.join button,
.save,
.logout,
.link-add {
  appearance: none;
  border: 0;
  background: var(--nano);
  color: #fff;
  padding: 12px;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-weight: 700;
  cursor: pointer;
}

.err {
  margin: 0;
  color: #b42318;
  font-size: 13px;
}

.desk {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 28px 32px 20px;
  min-height: 0;
  overflow: auto;
}

.desk--login {
  justify-content: center;
  align-items: center;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 0;
  border: 0;
}

.logout {
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 8px 16px;
  background: transparent;
  color: var(--ink);
  box-shadow: inset 0 0 0 1px var(--line);
  font-size: 12px;
}

.block {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

.block h2 {
  margin: 0 0 10px;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 16px;
}

.status,
.status-topic {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--muted);
}

.status-topic {
  font-weight: 700;
  color: var(--ink);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.dock-btn {
  appearance: none;
  border: 0;
  border-radius: 999px;
  padding: 11px 24px;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-decoration: none;
  color: #fff;
  cursor: pointer;
}

.dock-btn--screen {
  background: var(--violet);
}

.dock-btn--start {
  background: var(--sun);
  color: var(--ink);
}

.dock-btn--advance {
  background: var(--nano);
}

.done {
  margin: 10px 0 0;
  color: var(--nano);
  font-size: 13px;
  font-weight: 700;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}

.toggle {
  appearance: none;
  border: 0;
  border-radius: 999px;
  padding: 7px 16px;
  cursor: pointer;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}

.toggle--show {
  background: var(--coral);
}

.toggle--hide {
  background: var(--muted);
}

.portal-form {
  display: grid;
  gap: 10px;
}

.portal-form label {
  display: grid;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}

.portal-form input {
  border: 0;
  background: var(--paper);
  padding: 10px 12px;
  font-size: 14px;
  color: var(--ink);
}

.save {
  justify-self: start;
  border-radius: 999px;
  padding: 10px 18px;
  margin-top: 4px;
}

.saved {
  margin: 0;
  color: var(--leaf);
  font-size: 12px;
  font-weight: 700;
}

.links {
  display: grid;
  gap: 8px;
}

.links-head {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}

.link-row {
  display: grid;
  grid-template-columns: 1fr 1.4fr auto;
  gap: 8px;
}

.link-del {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.link-add {
  justify-self: start;
  border-radius: 999px;
  padding: 8px 14px;
  background: transparent;
  color: var(--nano);
  box-shadow: inset 0 0 0 1px var(--nano);
  font-size: 12px;
}

.ice-form {
  display: grid;
  gap: 10px;
}

.rounds {
  display: grid;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
  max-width: 120px;
}

.rounds input {
  border: 0;
  background: var(--paper);
  padding: 10px 12px;
  font-size: 14px;
  color: var(--ink);
}

.topics {
  display: grid;
  gap: 8px;
}

.topic-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 8px;
  align-items: center;
}

.topic-num {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
  min-width: 1.5em;
}

.topic-row input {
  border: 0;
  background: var(--paper);
  padding: 10px 12px;
  font-size: 14px;
  color: var(--ink);
}

.topic-del {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.topic-add {
  appearance: none;
  border: 0;
  border-radius: 999px;
  padding: 8px 14px;
  background: transparent;
  color: var(--nano);
  box-shadow: inset 0 0 0 1px var(--nano);
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  justify-self: start;
}

@media (max-width: 720px) {
  .play {
    grid-template-columns: 1fr;
  }

  header {
    border-right: 0;
    padding: 24px 20px 8px;
  }

  .link-row {
    grid-template-columns: 1fr;
  }
}
</style>
