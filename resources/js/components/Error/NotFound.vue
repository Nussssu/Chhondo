<script setup>

</script>

<template>  

    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-4">
    <div class="text-center">
      <h1 class="text-9xl font-extrabold tracking-widest mb-4 animate-pulse">
        4<span class="text-theme">0</span>4
      </h1>
      <div class="bg-theme px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      <div class="mt-8">
        <svg class="w-32 h-32 mx-auto mb-6 text-theme" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-gray-300 body-3-r mb-8">Oops! The page you're looking for doesn't exist.</p>
        <button 
          @click="goHome" 
          class="bg-theme hover:bg-theme text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-theme focus:ring-opacity-50"
        >
          Go Home
        </button>
      </div>
    </div>
  </div>

</template>