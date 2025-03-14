<template>
  <div class="page-container">
    <div class="top-nav">
      <div class="nav-title">Sunscreen Guide</div>
      <div class="nav-buttons">
        <router-link to="/" class="nav-button active">
          <i class="fas fa-umbrella-beach"></i> Sun Protector
        </router-link>
        <router-link to="/cancer-chart" class="nav-button">
          <i class="fas fa-chart-bar"></i> Cancer Chart
        </router-link>
        <router-link to="/uv-indicator" class="nav-button">
          <i class="fas fa-sun"></i> UV Indicator
        </router-link>
        <router-link to="/recommendation" class="nav-button">
          <i class="fas fa-lightbulb"></i> Recommendation
        </router-link>
        <router-link to="/reminder" class="nav-button">
          <i class="fas fa-bell"></i> Set Reminders
        </router-link>
      </div>
    </div>

    <div class="content">
      <div class="home-section">
        <h1><i class="fas fa-umbrella-beach icon-title"></i> Sun Protector</h1>

        <div class="main-content-box">
          <div class="description">
            <p>
              <i class="fas fa-radiation icon-paragraph"></i> UV radiation is a major contributor to
              skin cancer, with Australia having one of the highest rates of skin cancer in the
              world. Understanding the relationship between UV exposure and skin cancer risk is
              crucial for prevention.
            </p>
            <p>
              <i class="fas fa-chart-line icon-paragraph"></i> This tool allows you to explore skin
              cancer rates in Melbourne from 1960 to 2024 based on your age and gender. By
              understanding these trends, you can make more informed decisions about sun protection
              and regular skin checks.
            </p>
            <p>
              <i class="fas fa-compass icon-paragraph"></i> Use the navigation menu to access
              different features including cancer statistics, current UV index information,
              personalized recommendations, and reminders for reapplying sunscreen.
            </p>
          </div>
        </div>
      </div>

      <NextPageArrow nextRoute="/cancer-chart" nextPageName="Cancer Chart" />
    </div>
  </div>
</template>

<script setup lang="ts">
import NextPageArrow from '../components/NextPageArrow.vue'
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-image: linear-gradient(to bottom, #e0f7fa, #b2ebf2, #80deea);
  background-size: cover;
  background-position: center;
  padding: 0;
  margin: 0;
}

.top-nav {
  background-color: #1976d2;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 10;
}

.nav-title {
  font-size: 24px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.nav-buttons {
  display: flex;
  gap: 10px;
}

.nav-button {
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.nav-button.active {
  background-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.content {
  flex: 1;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.85);
  display: flex;
  flex-direction: column;
  padding: 30px;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 5;
}

.home-section {
  flex: 1;
  background: transparent;
  padding: 30px;
  box-shadow: none;
  margin-bottom: 0;
  animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h1 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
  color: #1565c0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
}

.icon-title {
  color: #f39c12;
  margin-right: 10px;
  filter: drop-shadow(0 0 3px rgba(243, 156, 18, 0.4));
}

.icon-paragraph {
  color: #1976d2;
  margin-right: 10px;
  font-size: 18px;
  filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.1));
}

.main-content-box {
  background: white;
  padding: 35px;
  border-radius: 18px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  max-width: 800px;
  margin: 0 auto;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.main-content-box::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}

.main-content-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.description {
  font-size: 18px;
  line-height: 1.6;
  color: #455a64;
  margin-bottom: 0;
}

.description p {
  margin-bottom: 20px;
  text-align: left;
  transition: all 0.3s ease;
}

.description p:hover {
  transform: translateY(-3px);
}

.description p:last-child {
  margin-bottom: 0;
}
</style>
