<script setup>

</script>

<template>
  <nav class="navbar navbar-dark bg-dark fixed-top navbar-expand-md">
    <div class="container-lg container-fluid">
      <a class="navbar-brand" href="#">
        <img src="../../../public/vite.svg" alt="Logo" width="35" height="35">
        Tresoria
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item me-md-5">
            <a class="nav-link" href="#" @click.stop.prevent="$emit('navigate', 'Accueil')">Accueil</a>
          </li>
          <li class="nav-item mx-md-5">
            <a class="nav-link" href="#" @click.stop.prevent="$emit('navigate', 'Jouer')">Jouer</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>