import { handleActions } from 'redux-actions'
import { INDEX_DATA, INDEX_DETAIL, TYPE_DATA, TYPE_LIST, LOAD_MORE } from '../types/counter'

export default handleActions({
  [INDEX_DATA] (state, action) {
    return {
      ...state,
      index_data: {
        banner: action.payload.banner,
        list: action.payload.list
      }
    }
  },
  [INDEX_DETAIL] (state, action) {
    return {
      ...state,
      index_detail: action.payload
    }
  },
  [LOAD_MORE] (state, action) {
    state.index_data.list.push(...action.payload.list)
    return {
      ...state,
      ended: false
    }
  },
  [TYPE_DATA] (state, action) {
    return {
      ...state,
      type_data: action.payload.list
    }
  },
  [TYPE_LIST] (state, action) {
    return {
      ...state,
      type_list: {
        list: action.payload.list,
        name: action.payload.name
      }
      
    }
  }
}, {
  index_data: {},
  index_detail: [],
  type_data: [],
  type_detail: [],
  type_list: [],
  ended: true
})