<!-- src/components/Card.vue -->
<template>
    <div class="card">
      <div class="card-header">
        <slot name="header"></slot>
      </div>
      <div class="card-body">
        <slot name="body"></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Card'
  }
  </script>
  
  <style scoped>
  .card {
    width: 30%;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 16px;
    margin-top: 16px;
    background-color: #fff;
  }
  .card-header, .card-footer {
    font-weight: bold;
    margin-bottom: 8px;
  }
  .card-body {
    margin-bottom: 16px;
  }
  </style>
  