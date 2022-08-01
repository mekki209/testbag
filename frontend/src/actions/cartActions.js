import axios from 'axios'
import { ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_INFO } from '../constants/cartConstants'

export const addItemToCart = (id) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/v1/experience/${id}`)

    dispatch({
        type: ADD_TO_CART,
        payload: {
            experience: data.experience._id,
            name: data.experience.name,
            price: data.experience.price,
            startdate: data.experience.startdate,
            enddate: data.experience.enddate,
            place: data.experience.place,
            image: data.experience.images[0].url,   
        }
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeItemFromCart = (id) => async (dispatch, getState) => {

    dispatch({
        type: REMOVE_ITEM_CART,
        payload: id
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

}

export const saveShippingInfo = (data) => async (dispatch) => {

    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    })

    localStorage.setItem('shippingInfo', JSON.stringify(data))

}