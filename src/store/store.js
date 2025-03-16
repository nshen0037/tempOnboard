import { defineStore } from 'pinia'
 
 export const useStore = defineStore('store', {
   state: () => {
     return { postcode: null }
   },
   actions: {
     setPostcode(postcode) {
       this.postcode = postcode
     },
   },
 })