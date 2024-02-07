<script setup>
const newTodo = ref('');
const defaultData = [
  {
    done: false,
    content: 'Write a blog post',
  },
];
const todosData = JSON.parse(getLocalStorage('todos')) || defaultData;
const todos = ref(todosData);

function getLocalStorage(key) {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
}

function setLocalStorage(key, value) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

function addTodo() {
  if (newTodo.value) {
    todos.value.push({
      done: false,
      content: newTodo.value,
    });
    newTodo.value = '';
  }
  saveData();
}

function doneTodo(todo) {
  todo.done = !todo.done;
  saveData();
}

function removeTodo(index) {
  todos.value.splice(index, 1);
  saveData();
}

function saveData() {
  const storageData = JSON.stringify(todos.value);
  setLocalStorage('todos', storageData);
}

// Trigger saveData on component mount to initialize localStorage
onMounted(() => {
  saveData();
});
</script>

<template>
  <div>
    <h1>ToDo App</h1>
    <form @submit.prevent="addTodo()">
      <label>New ToDo </label>
      <input v-model="newTodo" name="newTodo" autocomplete="off" />
      <button class="text">Add ToDo</button>
    </form>
    <h2 :class="$style.text2">ToDo List</h2>
    <ul>
      <li v-for="(todo, index) in todos" :key="index">
        <span :class="{ done: todo.done }" @click="doneTodo(todo)">{{ todo.content }}</span>
        <button @click="removeTodo(index)">Remove</button>
      </li>
    </ul>
    <h4 v-if="todos.length === 0">Empty list.</h4>
  </div>
</template>

<style scoped>
.text {
  color: blue;
}
</style>

<style module>
.text2 {
  color: red;
}
</style>
