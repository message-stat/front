<template>
  <div class="wrapper">
    <div class="sidebar">
      <div class="sidebar-content">
        <RouterLink v-for="link in links" :to="link.to" :class="route.path == link.to ? 'active' : ''">{{ link.title }}
        </RouterLink>
      </div>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>


<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

const links = router.getRoutes()
  .filter(route => route.meta?.layout === 'AnalyticsLayout' && route.meta?.layoutTitle)
  .sort((a, b) => (a.meta.layoutTitleOrder as number ?? 0) - (b.meta.layoutTitleOrder as number ?? 0))
  .map(route => ({ to: route.path, title: route.meta.layoutTitle }))

</script>


<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  // gap: 10px;

  .sidebar {
    min-width: 190px;
    position: relative;
    margin: 10px;
    min-height: 500px;

    .sidebar-content {
      position: sticky;
      width: 100%;
      top: 80px;
      display: flex;
      flex-direction: column;


      a {
        margin-bottom: 10px;
        text-decoration: none;
        color: #213547;
        padding: 8px;
        border-radius: 10px;
        margin: 0;

        &.active {
          background-color: #ffffff;
        }

        &:hover {
          background-color: white;
        }
      }
    }

  }

  .content {
    flex: 1;
    min-width: 100px;
    max-width: 900px;

    @media (min-width: 1300px) {
      margin-right: 190px;
    }

    @media (max-width: 1300px) {
      margin-right: 0;
      max-width: 100%;
    }
  }
}
</style>
