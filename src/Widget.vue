<template>
  <div class="wrapper">
    <button class="nav prev" @click="prev">&#10094;</button>
    <div class="box">
      <div
        class="items"
        :style="itemsStyle"
        @transitionend="onTransitionEnd"
        ref="itemsContainer"
      >
        <div class="item" v-for="(p, i) in loopItems" :key="`prod-${i}`">
          <img :src="p.image" :alt="p.title" />
          <div class="info">
            <h4>{{ p.title }}</h4>
            <p>${{ p.price }}</p>
          </div>
          <button class="btn" @click="addToCart($event, p)">
            Add
          </button>
        </div>
      </div>
    </div>
    <button class="nav next" @click="next">&#10095;</button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'

const props = defineProps({
  category: { type: String, default: 'electronics' },
  visibleCount: { type: Number, default: 5 }
})

const items = ref([])         // real data
const loopItems = ref([])     // data with clones
const idx = ref(props.visibleCount)
const itemsContainer = ref(null)

const transitionSpeed = 500
const gap = 16

const itemsStyle = reactive({
  transform: '',
  transition: ''
})

// move carousel to current idx
function updateTransform() {
  const firstCard = itemsContainer.value.children[0]
  if (!firstCard) return
  const cardWidth = firstCard.getBoundingClientRect().width + gap
  itemsStyle.transform = `translateX(-${cardWidth * idx.value}px)`
}

// handle snapping when clones are reached
function onTransitionEnd() {
  const n = items.value.length
  itemsStyle.transition = ''
  if (idx.value >= n + props.visibleCount) {
    idx.value = props.visibleCount
    itemsStyle.transition = 'none'
    updateTransform()
  }
  if (idx.value < props.visibleCount) {
    idx.value = n + props.visibleCount - 1
    itemsStyle.transition = 'none'
    updateTransform()
  }
}

// navigation
function prev() {
  itemsStyle.transition = `transform ${transitionSpeed}ms ease`
  idx.value--
  updateTransform()
}
function next() {
  itemsStyle.transition = `transform ${transitionSpeed}ms ease`
  idx.value++
  updateTransform()
}

// add-to-cart handler
function addToCart(e, p) {
  const btn = e.currentTarget
  btn.disabled = true
  btn.textContent = 'Adding…'
  fetch('https://fakestoreapi.com/carts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 1,
      date: new Date().toISOString(),
      products: [{ productId: p.id, quantity: 1 }]
    })
  })
    .then(() => { btn.textContent = 'Added!' })
    .catch(() => {
      btn.textContent = 'Error'
      btn.disabled = false
    })
}

// initial fetch & setup loopItems
onMounted(async () => {
  try {
    const res = await fetch(
      `https://fakestoreapi.com/products/category/${props.category}`
    )
    const data = await res.json()
    items.value = data
    // prepare infinite loop sequence
    const head = data.slice(0, props.visibleCount)
    const tail = data.slice(-props.visibleCount)
    loopItems.value = [...tail, ...data, ...head]
    // wait for DOM to update
    await nextTick()
    updateTransform()
  } catch (err) {
    console.error('Failed to fetch products', err)
  }
})
</script>

<style scoped>
.wrapper {
  position: relative;
  font-family: 'Inter', sans-serif;
}
.box {
  --gap: 16px;
  --visible: 5;
  overflow: hidden;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
}
/* edge fade overlays */
.box::before,
.box::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: calc((100% - (100% - (var(--visible) - 1) * var(--gap))) / 2);
  pointer-events: none;
  z-index: 5;
}
.box::before {
  left: 0;
  background: linear-gradient(to right, #fff, transparent);
}
.box::after {
  right: 0;
  background: linear-gradient(to left, #fff, transparent);
}

.items {
  display: flex;
  gap: var(--gap);
}

.item {
  flex: 0 0
    calc((100% - (var(--visible) - 1) * var(--gap)) / var(--visible));
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.item img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 8px;
}

.info {
  text-align: center;
}

.info h4 {
  font-size: 14px;
  margin: 0 0 4px;
  color: #111;
  height: 32px;
  overflow: hidden;
}

.info p {
  font-size: 13px;
  margin: 0;
  color: #666;
}

.btn {
  margin-top: 8px;
  padding: 6px 12px;
  font-size: 13px;
  border: none;
  border-radius: 4px;
  background: #0070f3;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
.btn:hover {
  background: #0055aa;
}

.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-size: 16px;
  line-height: 32px;
  text-align: center;
  z-index: 10;
}
.nav.prev {
  left: 8px;
}
.nav.next {
  right: 8px;
}
</style>
