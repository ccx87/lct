import Assign from 'lodash.assign'
import { GET_SEARCH_FONT_RESULT } from '../constants/ActionsTypes'

function posts(state = {}, action) {
    switch (action.type) {
        case GET_SEARCH_FONT_RESULT:
            return Assign({}, state, {
	             searchFontData: action.data,
	             searchFontDataLastUpdated: action.receivedAt
            })               
    default:
      return state     

  }  
}
export default function searchfont(state = {}, action) {
    switch (action.type) {   
        case GET_SEARCH_FONT_RESULT:       
            return Assign({}, state, posts(state, action))                                             
        default:
          return state
    }
}
