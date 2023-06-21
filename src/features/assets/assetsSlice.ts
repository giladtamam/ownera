import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Asset } from "../../mock"

export interface AsssetsState {
  items: Asset[]
}

const initialState: AsssetsState = {
  items: []
}

export const counterSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    updateItem: (state: AsssetsState, action: PayloadAction<Asset>) => {
      const index = state.items.findIndex(asset => asset.id === action.payload.id)
      if (index === -1) {
        state.items.push(action.payload)
      } else {
        state.items[index] = { ...state.items[index], ...action.payload }
      }
    }
  },
})

export const { increment, decrement, incrementByAmount, updateItem } = counterSlice.actions

export default counterSlice.reducer
