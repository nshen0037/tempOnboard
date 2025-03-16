import { defineStore } from 'pinia'

// 定义状态的类型
interface StoreState {
  postcode: string | null
}

export const useStore = defineStore('store', {
  state: (): StoreState => ({
    postcode: null,
  }),
  actions: {
    setPostcode(postcode: string) {
      this.postcode = postcode
    },
  },
})
