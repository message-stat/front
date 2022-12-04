<template>
  <div>
    <Card :loading="loading" :elapsed="serverStats.elapsed">
      <h2>Общее количество слов</h2>
      <div v-if="userId" class="col2grid">
        <p class="serverColor title">сервер
        <p class="serverColor bigNumber">{{ format(serverStats.server.totalWords) }}</p>
        </p>
        <p class="userColor title">вы
        <p class="userColor bigNumber">{{ format(serverStats.user.totalWords) }}</p>
        </p>
      </div>
      <p v-else class="serverColor bigNumber">{{ format(serverStats.server.totalWords) }}</p>
    </Card>
    <Card :loading="loading">
      <h2 slot="title">Общее количество сообщений</h2>
      <div v-if="userId" class="col2grid">
        <p class="serverColor title">сервер
        <p class="serverColor bigNumber">{{ format(serverStats.server.totalMessages) }}</p>
        </p>
        <p class="userColor title">вы
        <p class="userColor bigNumber">{{ format(serverStats.user.totalMessages) }}</p>
        </p>
      </div>
      <p v-else class="serverColor bigNumber">{{ format(serverStats.server.totalWords) }}</p>
    </Card>
    <Card :loading="loading">
      <h2 slot="title">Количество пользователей</h2>
      <p class="serverColor bigNumber">{{ format(serverStats.server.totalUsers) }}</p>
    </Card>
    <Card :loading="loading">
      <h2 slot="title">Размер базы данных</h2>
      <p class="serverColor bigNumber">{{ format(Math.round(serverStats.server.totalSize)) }} мб</p>
    </Card>
  </div>

</template>


<script setup lang="ts">
import axios from 'axios';
import { ref, watchEffect } from 'vue';
import Card from '../../components/Card.vue';
import { userIdHash, userId } from '../../storage/user';

const loading = ref(true);


type ServerStats = {
  server: {
    totalWords: number;
    totalMessages: number;
    totalUsers: number;
    totalSize: number;
  }
  user?: {
    totalWords: number;
    totalMessages: number;
  },
  elapsed?: number;
}

const serverStats = ref<ServerStats>(null)
const formatter = new Intl.NumberFormat('ru-RU')

function format(num: number) {
  return formatter.format(num)
}

serverStats.value = {
  server: {
    totalWords: 0,
    totalMessages: 0,
    totalUsers: 0,
    totalSize: 0
  },
  user: {
    totalWords: 0,
    totalMessages: 0
  },
  elapsed: null
}


watchEffect(async () => {
  loading.value = true
  serverStats.value = (await axios.get(`${import.meta.env.VITE_API_URL}/stats`, { params: { userId: userIdHash.value } })).data
  loading.value = false
})
</script>


<style scoped lang="scss">
.col2grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;

  @media (max-width: 750px) {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 500;
    text-align: center;
  }

  .bigNumber {
    @media (max-width: 1000px) {
      font-size: 2.5rem;
    }
  }
}

.bigNumber {
  text-align: center;
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: 2px;
  overflow-wrap: anywhere;

  @media (max-width: 750px) {
    font-size: 3rem;
  }

  @media (max-width: 650px) {
    font-size: 2rem;
  }
}
</style>
