<template>
  <div class="wrapper">
    <!-- HEADER WITH TABS -->
    <header class="widget-header">
      <div class="logo">Newest Logo</div>
      <nav class="widget-menu">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="menu-item"
          :class="{ active: tab.value === currentCategory }"
          @click="changeCategory(tab.value)"
        >
          {{ tab.label }}
        </button>
      </nav>
    </header>

    <!-- CAROUSEL CONTROLS -->
    <button class="nav prev" @click="prev" aria-label="Previous">&#10094;</button>

    <!-- VIEWPORT -->
    <div class="viewport">
      <div
        class="track"
        :style="{ transform: itemsStyle.transform, transition: itemsStyle.transition }"
        @transitionend="onTransitionEnd"
        ref="itemsContainer"
      >
        <div
          class="slide"
          v-for="(p,i) in loopItems"
          :key="i"
          @click="openProduct(p)"
        >
          <img class="cover" :src="p.image" :alt="p.title" />
          <h4 class="title">{{ p.title }}</h4>
          <p class="price">$ {{ p.price.toFixed(2) }}</p>
          <button class="btn" @click.stop="addToCart($event,p)">Add to Cart</button>
        </div>
      </div>
    </div>

    <button class="nav next" @click="next" aria-label="Next">&#10095;</button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'

const props = defineProps({
  visibleCount: { type: Number, default: 1 }
})

// --- CONFIG ---
const WIDTH      = 400
const HEIGHT     = 500
const transitionSpeed = 400

// define your tabs and corresponding API categories
const tabs = [
  { label: 'Olive Oil',     value: 'electronics' },
  { label: 'Vegeterrian',        value: 'jewelery' },
  { label: "Cart",  value: "men's clothing" },
]
const currentCategory = ref(tabs[0].value)

// reactive state
const items         = ref([])
const loopItems     = ref([])
const idx           = ref(props.visibleCount)
const itemsStyle    = reactive({ transform: '', transition: '' })

// fetch & prepare loop
async function fetchProducts(category) {
  const res  = await fetch(`https://fakestoreapi.com/products/category/${category}`)
  const data = await res.json()
  items.value = data
  const head = data.slice(0, props.visibleCount)
  const tail = data.slice(-props.visibleCount)
  loopItems.value = [...tail, ...data, ...head]
  idx.value = props.visibleCount
  await nextTick()
  updateTransform()
}

// transform logic
function updateTransform() {
  itemsStyle.transform = `translateX(-${WIDTH * idx.value}px)`
}
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

// add-to-cart
function addToCart(e, p) {
  const btn = e.currentTarget
  btn.disabled = true
  btn.textContent = 'Adding…'
  fetch('https://fakestoreapi.com/carts', {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({
      userId:1,
      date: new Date().toISOString(),
      products:[{ productId:p.id, quantity:1 }]
    })
  })
    .then(() => btn.textContent = 'Added!')
    .catch(() => { btn.textContent = 'Error'; btn.disabled = false })
}

// open product in new tab
function openProduct(p) {
  const url = `https://fakestoreapi.com/products/${p.id}`
  window.open(url, '_blank')
}

// handle tab change
function changeCategory(val) {
  if (val === currentCategory.value) return
  currentCategory.value = val
}

// watch for category changes
watch(currentCategory, (newCat) => {
  fetchProducts(newCat)
})

// initial load
onMounted(() => {
  fetchProducts(currentCategory.value)
})
</script>

<style scoped>
.wrapper {
  position: relative;
  width: 400px;
  background: #fafafa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin: auto;
}

/* HEADER */
.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #fff;
  border-bottom: 1px solid #eee;
}
.logo {
  font-size: 18px;
  font-weight: bold;
}
.widget-menu {
  display: flex;
  gap: 4px;
}
.menu-item {
  padding: 6px 10px;
  background: none;
  border: none;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color .2s, border-color .2s;
}
.menu-item.active {
  color: #0070f3;
  border-color: #0070f3;
}

/* CAROUSEL */
.nav {
  position: absolute;
  top: calc(50% + 16px);
  transform: translateY(-50%);
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: pointer;
  transition: background .2s;
}
.nav.prev { left: -4px; }
.nav.next { right: -4px; }

.viewport {
  width: 400px;
  height: 500px;
  overflow: hidden;
  position: relative;
}
.track {
  display: flex;
}
.slide {
  flex: 0 0 400px;
  height: 500px;
  box-sizing: border-box;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}
.cover {
  width: 100%;
  height: 60%;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 12px;
}
.title {
  font-size: 18px;
  color: #333;
  margin-bottom: 4px;
}
.price {
  font-size: 16px;
  color: #0070f3;
  margin-bottom: 12px;
}
.btn {
  padding: 8px 16px;
  background: #0070f3;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background .2s;
}
.btn:hover { background: #005bb5; }
.btn:disabled { background: #aaa; cursor: default; }
</style>
