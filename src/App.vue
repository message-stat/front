<template>
  <div>
    <ul class="navbar ">
      <div class="relative">
        <div class="left flex">
          <li class="navbar-item">
            <RouterLink to="/">Выгрузка</RouterLink>
          </li>
          <li class="navbar-item">
            <RouterLink to="/analytics">Аналитика</RouterLink>
          </li>
        </div>
        <div class="right flex">
          <li class="navbar-item">
            <RouterLink to="/login">Войти</RouterLink>
          </li>
        </div>

      </div>
    </ul>

    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">

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
      width: 800;
      color: #213547;
      text-decoration: none;
      transition: color 0.5s;
      font-size: 16px;

      &.router-link-active,
      &:hover {
        color: rgb(71, 37, 209);
      }
    }
  }
}

.content {
  margin: auto;
  margin-top: 60px;
  max-width: 900px;
}
</style>

<style lang="scss">
body {
  background-color: #edeef0;
  margin: 0;
  padding: 0;
  font-family: "Inter var experimental", "Inter var", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  color: #213547;
}

.flex {
  display: flex;
}

.relative {
  position: relative;
}

.card {
  background-color: white;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;


  &.error {
    background-color: #f8d7da;
    color: #721c24;
  }

  &.warning {
    background-color: #fff3cd;
    color: #856404;
  }
}

h1,
h3,
h4,
p {
  margin: 0px;
}
</style>
