<script setup lang="ts">
</script>

<template>
  <div class="hero-card">
    <h1 class="hero-title">CLTI</h1>
    <p class="hero-subtitle">编程语言人格测试</p>
    <p class="hero-desc">
      如果你是一门编程语言，你会是哪一种？<br />
      15 道趣味题，揭晓属于你的语言人格。
    </p>
    <router-link to="/intro" class="hero-btn">
      开始测试 →
    </router-link>
  </div>
</template>

<style scoped>
.hero-card {
  position: relative;
  z-index: 1;
  max-width: 460px;
  width: 90%;
  margin: 0 auto;
  padding: 48px 36px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.hero-title {
  font-size: 3.2rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--color-accent);
}

.hero-subtitle {
  margin-top: 8px;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--color-text);
}

.hero-desc {
  margin-top: 20px;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.hero-btn {
  display: inline-block;
  margin-top: 32px;
  padding: 14px 40px;
  background: var(--color-accent);
  color: #fff;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 50px;
  transition: transform 0.15s, box-shadow 0.15s;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 71, 87, 0.3);
}
</style>
