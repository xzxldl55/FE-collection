/**
 * Redux-toolkit 学习代码
 * 
 * 全局状态管理
 */
import { createSlice, configureStore, SliceCaseReducers, PayloadAction } from '@reduxjs/toolkit';
import { Task } from './KanbanBoard';

const cardListSlice = createSlice<Task[], SliceCaseReducers<Task[]>, 'cardList'>({
	name: 'cardList',
	initialState: [],
	reducers: {
		addCard(state, action: PayloadAction<{ newCard: Task }>) {
			state.unshift(action.payload.newCard);
		},
		removeCard(state, action: PayloadAction<Task>) {
			const index = state.findIndex((v) => v.title === action.payload.title);
			if (index !== -1) {
				state.splice(index, 1);
			}
		},
	},
});

const store = configureStore({
	reducer: cardListSlice.reducer,
});

export const { addCard, removeCard } = cardListSlice.actions;

export default store
