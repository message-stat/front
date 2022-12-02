<template>
  <div>
    <ul class="navbar ">
      <div class="relative">
        <div class="left flex">
          <li class="navbar-item">
            <RouterLink to="/" :class="route.path == '/' ? 'active' : ''">{{ loadTitle }}</RouterLink>
          </li>
          <li class="navbar-item">
            <RouterLink to="/analytics" :class="route.path.includes('/analytics') ? 'active' : ''">Аналитика
            </RouterLink>
          </li>
        </div>
        <div class="right flex">
          <li class="navbar-item">
            <div v-if="userId">id{{ userId }} <a @click="onLogout">(Выйти)</a></div>
            <a v-else @click="onLogin">Войти</a>
          </li>
        </div>

      </div>
    </ul>

    <div class="content">
      <AppLayout>
        <router-view></router-view>
      </AppLayout>
    </div>


    <LoginCard v-model:show="showLogin" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from '@vue/reactivity';
import { useProcessor, ProcessStatus } from './core/messages/processArchive';
import { userId } from './storage/user';
import LoginCard from './components/LoginCard.vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import AppLayout from './components/AppLayout.vue';

const processor = useProcessor()

const loadTitle = computed(() => {
  if (processor.processStatus.value != ProcessStatus.processing) return 'Выгрузка'
  const progress = Math.round(processor.processedInfo.value.messageCount / processor.archiveInfo.value.messageCount * 100)
  if (progress < 100 && progress > 0) return `Выгрузка (${progress}%)`
  return 'Выгрузка'
})

const showLogin = ref(false)

function onLogin() {
  showLogin.value = true
}

function onLogout() {
  userId.value = ''
}

const route = useRoute()
</script>

<style scoped lang="scss">
.navbar {
  position: fixed;
  width: 100%;
  height: 50px;
  z-index: 100;
  top: 0;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid rgba(185, 185, 185, 0.5);
  background-color: rgb(255, 255, 255);
  list-style-type: none;

  .right,
  .left {
    position: absolute;
    top: 0;
  }

  .right {
    right: 0;
  }

  .left {
    left: 0;
  }

  .navbar-item {
    margin: 15px;

    a {
      cursor: pointer;
      width: 800;
      color: #213547;
      text-decoration: none;
      transition: color 0.5s;
      font-size: 16px;

      &.active,
      &:hover {
        color: rgb(71, 37, 209);
      }
    }
  }
}

.content {
  margin-top: 50px;
}
</style>

<style lang="scss">
@import './styles/main.scss';
</style>
