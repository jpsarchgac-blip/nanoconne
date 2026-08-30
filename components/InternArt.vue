<template>

  <div class="art" :style="{ '--accent': accent }">

    <figure v-if="scene === 'intern-poster'" class="demo demo--poster">

      <img :src="poster" alt="2028 コンペ形式インターンシップ ポスター" class="poster-img">

      <figcaption class="poster-cap">

        <span class="poster-date">8/18 〜 9/4</span>

        <span class="poster-prize">賞品総額 200万円!?</span>

      </figcaption>

    </figure>



    <div v-else-if="scene === 'intern-video'" class="demo demo--video">

      <iframe

        class="video-frame"

        :src="videoEmbed"

        title="昨年のインターン初日"

        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"

        allowfullscreen

      />

      <a :href="videoUrl" class="video-link" target="_blank" rel="noopener">

        YouTube で開く

      </a>

    </div>



    <div v-else-if="scene === 'compete-seed'" class="demo demo--compete">
      <p class="compete-kicker">コンペ形式</p>
      <div class="compete-track">
        <span class="compete-rail" aria-hidden="true">
          <i :style="{ width: competeRail }"/>
        </span>
        <article
          v-for="(step, i) in competeSteps"
          :key="step.n"
          class="compete-step"
          :class="{
            'compete-step--on': competeBeat === i,
            'compete-step--done': competeDone,
            'compete-step--passed': competeBeat > i,
          }"
        >
          <small>{{ step.n }}</small>
          <strong>{{ step.title }}</strong>
          <p>{{ step.line }}</p>
        </article>
      </div>
      <p class="compete-caption">{{ competeCaption }}</p>
      <ul class="compete-ok" :class="{ 'compete-ok--show': competeDone }">
        <li>文理OK</li>
        <li>未経験OK</li>
        <li>選考ではない</li>
      </ul>
    </div>



    <div v-else-if="scene === 'compete-flow'" class="demo demo--days">

      <article v-for="(day, i) in days" :key="day.title" class="day" :style="{ '--d': i }">

        <small>{{ day.n }}</small>

        <strong>{{ day.title }}</strong>

        <p>{{ day.line }}</p>

      </article>

    </div>



    <div v-else-if="scene === 'schedule-flags'" class="demo demo--flags">

      <div v-for="flag in flags" :key="flag.name" class="flag" :class="flag.kind">

        <span class="flag-tag">{{ flag.kind === 'must' ? '必須' : '任意' }}</span>

        <strong>{{ flag.name }}</strong>

      </div>

    </div>



    <div v-else-if="scene === 'intern-courses'" class="demo demo--courses">
      <p class="course-kicker">2日目に、どちらかを選ぶ</p>
      <div class="course-split">
        <article
          v-for="(course, i) in courses"
          :key="course.id"
          class="course"
          :class="`course--${course.id}`"
          :style="{ '--d': i }"
        >
          <img :src="course.image" :alt="course.name" class="course-img">
          <div class="course-veil" />
          <div class="course-body">
            <small>{{ course.tag }}</small>
            <strong>{{ course.name }}</strong>
            <p>{{ course.line }}</p>
            <ul class="course-points">
              <li v-for="point in course.points" :key="point">{{ point }}</li>
            </ul>
          </div>
        </article>
        <span class="course-vs" aria-hidden="true">or</span>
      </div>
    </div>



    <div v-else-if="scene === 'action-links'" class="demo demo--next">
      <article class="ticket">
        <p class="ticket-kicker">Next</p>
        <h3 class="ticket-title">今日からすること</h3>
        <ol class="steps">
          <li v-for="(step, i) in nextSteps" :key="step.n" :style="{ '--d': i }">
            <span class="step-n">{{ step.n }}</span>
            <div>
              <strong>{{ step.title }}</strong>
              <p>{{ step.line }}</p>
            </div>
          </li>
        </ol>
        <a
          :href="primaryLink.href"
          class="ticket-cta"
          target="_blank"
          rel="noopener"
        >{{ primaryLink.label }}</a>
        <ul class="facts">
          <li v-for="fact in facts" :key="fact.label">
            <small>{{ fact.label }}</small>{{ fact.value }}
          </li>
        </ul>
      </article>
    </div>

  </div>

</template>



<script setup lang="ts">

import type { SpreadScene } from "~/utils/bookContent"

import {

  INTERN_COMPETE_STEPS,

  INTERN_COURSES,

  INTERN_FLAGS,

  INTERN_POSTER,

  INTERN_RECRUIT_URL,

  INTERN_SCHEDULE,

  INTERN_VIDEO_EMBED,

  INTERN_VIDEO_URL,

} from "~/utils/internRecruit"



const props = defineProps<{

  scene: SpreadScene

  accent: string

  portal?: {

    period: string

    requiredDays: string

    optionalDays: string

    venue: string

    zoom: string

    courses: string

    prizeNote?: string

    taskOutline: string

    links: { label: string; href: string }[]

  } | null

}>()



const poster = INTERN_POSTER

const videoEmbed = INTERN_VIDEO_EMBED

const videoUrl = INTERN_VIDEO_URL

const days = INTERN_SCHEDULE

const flags = INTERN_FLAGS

const courses = INTERN_COURSES
const competeSteps = INTERN_COMPETE_STEPS
const COMPETE_BEAT_MS = 1100
const competeBeat = ref(-1)
const competeDone = ref(false)
let competeTimer: ReturnType<typeof setInterval> | null = null

const competeRail = computed(() => {
  if (competeDone.value) return "100%"
  if (competeBeat.value < 0) return "0%"
  return `${(competeBeat.value / (competeSteps.length - 1)) * 100}%`
})

const competeCaption = computed(() => {
  if (competeDone.value) return "ニーズ → 提出 → 評価。これを数日で体験する"
  const step = competeSteps[competeBeat.value]
  return step ? `${step.title}：${step.line}` : "実務の流れを、順に見る"
})

function setupCompeteTimer() {
  if (competeTimer) clearInterval(competeTimer)
  competeTimer = null
  competeBeat.value = -1
  competeDone.value = false
  if (props.scene !== "compete-seed") return
  competeBeat.value = 0
  competeTimer = setInterval(() => {
    if (competeBeat.value >= competeSteps.length - 1) {
      competeDone.value = true
      if (competeTimer) clearInterval(competeTimer)
      competeTimer = null
      return
    }
    competeBeat.value += 1
  }, COMPETE_BEAT_MS)
}

watch(() => props.scene, setupCompeteTimer, { immediate: true })
onBeforeUnmount(() => {
  if (competeTimer) clearInterval(competeTimer)
})

const nextSteps = computed(() => [
  { n: "01", title: "期間を見る", line: props.portal?.period ?? "8/18（火）〜 9/4（金）" },
  { n: "02", title: "必須日を確保", line: props.portal?.requiredDays ?? "8/18 初日 · 8/19 選択 · 9/4 発表" },
  { n: "03", title: "採用ページで予約", line: "詳しい日程とフォームは公式へ" },
])

const facts = computed(() => {
  if (!props.portal) {
    return [
      { label: "会場", value: "神戸 + Zoom" },
      { label: "コース", value: "企画 / 開発" },
    ]
  }
  return [
    { label: "会場", value: props.portal.venue },
    { label: "任意", value: props.portal.optionalDays },
  ]
})

const primaryLink = computed(() => props.portal?.links?.[0] ?? {
  label: "採用ページで予約する",
  href: INTERN_RECRUIT_URL,
})

</script>



<style scoped>

.art {

  position: absolute;

  inset: 0;

  color: #fff;

}



.demo {

  position: absolute;

  inset: 0;

}



.demo--poster {

  margin: 0;

  padding: 12px 14px 18px;

  display: flex;

  flex-direction: column;

  gap: 10px;

}



.poster-img {

  flex: 1;

  min-height: 0;

  width: 100%;

  border-radius: 12px;

  object-fit: contain;

  background: rgb(0 0 0 / 0.15);

  animation: pop 0.55s ease backwards;

}



.poster-cap {

  display: flex;

  justify-content: space-between;

  gap: 8px;

  margin: 0;

}



.poster-date,

.poster-prize {

  padding: 6px 10px;

  border-radius: 999px;

  background: rgb(255 255 255 / 0.92);

  color: var(--accent);

  font-size: 11px;

  font-weight: 800;

}



.demo--video {

  padding: 14px;

  display: flex;

  flex-direction: column;

  gap: 10px;

}



.video-frame {

  flex: 1;

  min-height: 0;

  width: 100%;

  border: 0;

  border-radius: 12px;

  background: rgb(0 0 0 / 0.2);

}



.video-link {

  align-self: center;

  padding: 8px 14px;

  border-radius: 999px;

  background: rgb(255 255 255 / 0.92);

  color: var(--accent);

  font-size: 12px;

  font-weight: 800;

  text-decoration: none;

}



.demo--compete {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  padding: 16px 12px 18px;
  box-sizing: border-box;
}

.compete-kicker {
  margin: 0;
  text-align: center;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  opacity: 0.88;
}

.compete-track {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.compete-rail {
  position: absolute;
  left: 16%;
  right: 16%;
  top: 18px;
  height: 4px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.22);
  overflow: hidden;
}

.compete-rail i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #fff;
  transition: width 0.7s ease;
}

.compete-step {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 22px 8px 12px;
  border-radius: 14px;
  background: rgb(255 255 255 / 0.14);
  border: 1.5px solid rgb(255 255 255 / 0.28);
  text-align: center;
  transition: background 0.3s ease, color 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease;
}

.compete-step small {
  font-size: 10px;
  font-weight: 800;
  opacity: 0.7;
}

.compete-step strong {
  font-size: 16px;
  line-height: 1.2;
}

.compete-step p {
  margin: 0;
  font-size: 10px;
  line-height: 1.4;
  opacity: 0.88;
}

.compete-step--on {
  background: #fff;
  color: var(--accent);
  box-shadow: 0 0 0 2px rgb(255 255 255 / 0.45);
}

.compete-step--passed {
  opacity: 0.7;
}

.compete-step--done {
  background: #fff;
  color: var(--accent);
  opacity: 1;
}

.compete-caption {
  margin: 0;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.45;
  min-height: 1.45em;
}

.compete-ok {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.compete-ok--show {
  opacity: 1;
  transform: none;
}

.compete-ok li {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.92);
  color: var(--accent);
  font-size: 11px;
  font-weight: 800;
}



.demo--days {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 10px;

  padding: 28px 18px 24px;

}



.day {

  padding: 12px 12px 10px;

  border-radius: 14px;

  background: rgb(255 255 255 / 0.92);

  color: var(--accent);

  animation: pop 0.5s ease backwards;

  animation-delay: calc(var(--d) * 0.12s);

}



.day small {

  font-size: 11px;

  opacity: 0.7;

}



.day strong {

  display: block;

  margin-top: 4px;

  font-size: 18px;

}



.day p {

  margin: 6px 0 0;

  font-size: 12px;

  line-height: 1.4;

}



.demo--flags {

  display: flex;

  align-items: flex-end;

  justify-content: space-around;

  padding: 40px 16px 28px;

}



.flag {

  width: 17%;

  min-height: 42%;

  border-radius: 10px 10px 4px 4px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: flex-end;

  padding: 10px 4px 12px;

  text-align: center;

  animation: rise 0.6s ease backwards;

}



.flag:nth-child(1) { animation-delay: 0.05s; }

.flag:nth-child(2) { animation-delay: 0.12s; height: 52%; }

.flag:nth-child(3) { animation-delay: 0.2s; height: 38%; }

.flag:nth-child(4) { animation-delay: 0.28s; height: 58%; }

.flag:nth-child(5) { animation-delay: 0.36s; height: 48%; }



.must {

  background: #fff;

  color: var(--accent);

}



.opt {

  background: transparent;

  border: 2px dashed rgb(255 255 255 / 0.55);

}



.flag-tag {

  font-size: 10px;

  letter-spacing: 0.08em;

  margin-bottom: 6px;

}



.flag strong {

  font-size: 13px;

}



.demo--courses {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 10px 14px;
  box-sizing: border-box;
}

.course-kicker {
  margin: 0;
  text-align: center;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  opacity: 0.88;
}

.course-split {
  position: relative;
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.course {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 0;
  overflow: hidden;
  border-radius: 16px;
  animation: pop 0.55s ease backwards;
  animation-delay: calc(var(--d) * 0.12s);
}

.course-img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.course-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgb(0 0 0 / 0.08) 28%, rgb(0 0 0 / 0.78) 100%);
}

.course-body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 8px;
  padding: 10px 10px 10px;
  border-radius: 12px;
  background: rgb(0 0 0 / 0.46);
  backdrop-filter: blur(6px);
  color: #fff;
}

.course small {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  opacity: 0.82;
}

.course strong {
  display: block;
  font-size: 26px;
  line-height: 1.1;
}

.course p {
  margin: 0;
  font-size: 11px;
  line-height: 1.4;
  opacity: 0.92;
}

.course-points {
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.course-points li {
  padding: 4px 8px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.18);
  font-size: 10px;
  font-weight: 700;
}

.course-vs {
  position: absolute;
  left: 50%;
  top: 42%;
  z-index: 2;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #fff;
  color: var(--accent);
  font-size: 11px;
  font-weight: 800;
  box-shadow: 0 4px 14px rgb(0 0 0 / 0.18);
}

.demo--next {
  padding: 12px 12px 16px;
  display: grid;
  place-items: center;
}

.ticket {
  width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 14px 12px;
  border-radius: 16px;
  background: rgb(255 255 255 / 0.96);
  color: var(--accent);
  overflow: auto;
}

.ticket-kicker {
  margin: 0;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
  opacity: 0.62;
}

.ticket-title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.3;
}

.steps {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.steps li {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 8px;
  align-items: start;
  animation: pop 0.45s ease backwards;
  animation-delay: calc(var(--d) * 0.1s);
}

.step-n {
  display: grid;
  place-items: center;
  height: 32px;
  border-radius: 10px;
  background: rgb(47 190 166 / 0.14);
  font-size: 11px;
  font-weight: 800;
}

.steps strong {
  display: block;
  font-size: 13px;
  line-height: 1.3;
}

.steps p {
  margin: 2px 0 0;
  font-size: 11px;
  line-height: 1.4;
  opacity: 0.82;
}

.ticket-cta {
  display: block;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--accent);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  text-align: center;
  text-decoration: none;
}

.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.facts li {
  flex: 1 1 40%;
  min-width: 0;
  padding: 6px 8px;
  border-radius: 10px;
  background: rgb(47 190 166 / 0.1);
  font-size: 10px;
  line-height: 1.35;
}

.facts small {
  display: block;
  font-size: 9px;
  letter-spacing: 0.06em;
  opacity: 0.7;
  margin-bottom: 2px;
}



@keyframes pop {

  from { transform: translateY(10px); opacity: 0; }

  to { transform: none; opacity: 1; }

}



@keyframes rise {

  from { transform: translateY(18px); opacity: 0; }

  to { transform: none; opacity: 1; }

}

</style>


