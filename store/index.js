import Vue from 'vue'
import Vuex from 'vuex'

// import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		sid: '',
	},
	mutations: {
		setsid(state, data) {
			state.sid = data
		}
	},
	//#ifdef H5
// 	plugins: [createPersistedState({
// 		storage: window.sessionStorage
// 	})],
	//#endif
})

export default store
