<template>
  <div class="card">
    <h1>Как получить архив</h1>
    <p>Сервис анализирует GDRP архив VK, для его получения, необходимо запросить его через специальную форму.</p>

    Порядок действий:
    <ol>
      <li>Перейти по ссылке <a href="https://vk.com/data_protection?section=rules&scroll_to_archive=1"
          target=”_blank”>vk.com/data_protection?section=rules</a></li>
      <li>Внизу страницы нажать кнопку <b>Запросить архив</b></li>
      <li>В сплывающем меню отметить галочкой <b> Профиль -> Сообщения</b></li>
      <li>В течение 3х часов в <b>личные сообщения</b> от админинстрации ВК придёт <b>ссылка на ваш архив</b></li>
      <li><b>Скачайте архив</b> в ZIP формате и претащите его в форму выше</li>
    </ol>
  </div>
</template>

<style scoped lang="scss">
h1 {
  margin-bottom: 10px;
}

ol {
  list-style-type: decimal;
  margin-top: 0;
  padding-left: 30px;
}

a {
  color: #3b5998;
}
</style>
