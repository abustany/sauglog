import { onMounted, onUnmounted, Ref, ref } from 'vue'

export default function useCurrentTime(): Ref<Date> {
  const currentTime = ref(new Date())
  let intervalID = 0

  const startTicker = () => {
    if (intervalID) { return }

    currentTime.value = new Date()
    intervalID = setInterval(() => { currentTime.value = new Date() }, 60*1000)
  }

  const stopTicker = () => {
    if (!intervalID) { return }

    clearInterval(intervalID)
    intervalID = 0
  }

  const visibilityChangeEventListener = () => {
    if (document.hidden) {
      stopTicker()
    } else {
      startTicker()
    }
  }

  onMounted(() => {
    startTicker()
    document.addEventListener('visibilitychange', visibilityChangeEventListener)
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', visibilityChangeEventListener)
    stopTicker()
  })

  return currentTime
}
