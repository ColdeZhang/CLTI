<script setup lang="ts">
</script>

<template>
  <div class="intro-page">
    <div class="intro-card">
      <h2 class="intro-title">准备好了吗？</h2>
      <p class="intro-desc">接下来你将回答 15 道趣味选择题，大约需要 3-5 分钟。</p>

      <ul class="intro-points">
        <li>
          <span class="intro-icon">🎯</span>
          <div>
            <strong>五维人格模型</strong>
            <p>测试基于秩序、掌控、表达、协作、行动五个维度</p>
          </div>
        </li>
        <li>
          <span class="intro-icon">🎲</span>
          <div>
            <strong>娱乐向测试</strong>
            <p>结果有趣但不严肃，适合分享和聊天</p>
          </div>
        </li>
        <li>
          <span class="intro-icon">🖼️</span>
          <div>
            <strong>生成专属卡片</strong>
            <p>你将获得一张可截图分享的语言人格海报</p>
          </div>
        </li>
      </ul>

      <router-link to="/quiz" class="intro-btn">
        开始答题 →
      </router-link>

      <router-link to="/" class="intro-back">
        ← 返回首页
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.intro-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.intro-card {
  max-width: 500px;
  width: 100%;
  padding: 40px 32px;
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  text-align: center;
}

.intro-title {
  font-size: 1.8rem;
  font-weight: 700;
}

.intro-desc {
  margin-top: 12px;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.intro-points {
  list-style: none;
  margin-top: 28px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.intro-points li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.intro-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.intro-points li strong {
  display: block;
  font-size: 0.95rem;
}

.intro-points li p {
  margin-top: 2px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.intro-btn {
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

.intro-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 71, 87, 0.3);
}

.intro-back {
  display: block;
  margin-top: 16px;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.intro-back:hover {
  color: var(--color-text-secondary);
}
</style>
