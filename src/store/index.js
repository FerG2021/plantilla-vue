import { createStore } from 'vuex'
// axios
import axios from 'axios'
import VueAxios from 'vue-axios'

// usado para login
axios.defaults.withCredentials = true
axios.defaults.baseURL = "http://localhost:8000"
export default createStore({
  state: {
    user: null,
  },
  
  mutations: {
    SET_USER(state, user){
      state.user = user
    }
  },
  
  actions: {
    async login({ dispatch },credentials){
      await axios.get("/sanctum/csrf-cookie");
      await axios.post("/login", credentials);
      return dispatch("getUser");
    },

    getUser({ commit }){
      axios.get("/user")
        .then(res => {
          commit("SET_USER", res.data)
        })
        .catch(() => {
          commit("SET_USER", null)
        })
    },
  },
  
  modules: {

  }
})

