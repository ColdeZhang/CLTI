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
    <div class="hero-actions">
      <router-link to="/intro" class="hero-btn">
        开始测试 →
      </router-link>
      <a
        class="hero-repo-link"
        href="https://github.com/ColdeZhang/CLTI"
        target="_blank"
        rel="noreferrer"
      >
        查看仓库 / GitHub
      </a>
    </div>
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

.hero-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
}

.hero-btn {
  display: inline-block;
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

.hero-repo-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.84rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-bottom: 1px solid rgba(76, 88, 102, 0.22);
  padding-bottom: 2px;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.hero-repo-link:hover {
  color: var(--color-accent);
  border-color: rgba(255, 71, 87, 0.36);
}

@media (min-width: 768px) {
  .hero-card {
    max-width: 540px;
    padding: 56px 48px;
  }

  .hero-title {
    font-size: 3.8rem;
  }

  .hero-subtitle {
    font-size: 1.3rem;
  }

  .hero-desc {
    font-size: 1.05rem;
  }
}
</style>
