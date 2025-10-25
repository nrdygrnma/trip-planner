import {Toaster} from 'vue-sonner'
import {defineNuxtPlugin} from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('Toaster', Toaster)
})