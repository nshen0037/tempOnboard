import { defineStore } from 'pinia'

// Define state type
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
