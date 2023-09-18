/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { css } from '@emotion/react';
import KanbanBoard, { COLUMN_KEY_DONE, COLUMN_KEY_ONGOING, COLUMN_KEY_TODO, ColumnKeys } from './KanbanBoard';
import AdminContext from './AdminContext';
import JustPropsMemo from './components/JustPropsMemo';
import store from './redux-store';
import { Provider } from 'react-redux';

const DATA_STORE_KEY = 'kanban-data-store';

function App() {
	const [todoList, setTodoList] = useState([
		{ title: '开发任务-1', status: '2022-05-22 18:15' },
		{ title: '开发任务-3', status: '2023-07-13 13:55' },
		{ title: '开发任务-5', status: '2022-05-22 18:15' },
		{ title: '测试任务-3', status: '2022-05-22 18:15' },
	]);
	const [ongoingList, setOngoingList] = useState([
		{ title: '开发任务-4', status: '2022-05-22 18:15' },
		{ title: '开发任务-6', status: '2022-05-22 18:15' },
		{ title: '测试任务-2', status: '2022-05-22 18:15' },
	]);
	const [doneList, setDoneList] = useState([
		{ title: '开发任务-2', status: '2022-05-22 18:15' },
		{ title: '测试任务-1', status: '2022-05-22 18:15' },
	]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const data = window.localStorage.getItem(DATA_STORE_KEY);
		setTimeout(() => {
			setLoading(false);
			if (data) {
				const parseData = JSON.parse(data) as {
					todoList: typeof todoList;
					ongoingList: typeof ongoingList;
					doneList: typeof doneList;
				};
				setTodoList(parseData.todoList);
				setOngoingList(parseData.ongoingList);
				setDoneList(parseData.doneList);
			}
		}, 1000);
	}, []);

	const handleSaveAll = () => {
		const data = JSON.stringify({
			todoList,
			ongoingList,
			doneList,
		});
		window.localStorage.setItem(DATA_STORE_KEY, data);
	};

	const updater = {
		[COLUMN_KEY_TODO]: setTodoList,
		[COLUMN_KEY_ONGOING]: setOngoingList,
		[COLUMN_KEY_DONE]: setDoneList,
	};

	const handleAdd = (addColumnKey: ColumnKeys, newCard: (typeof todoList)[number]) => {
		updater[addColumnKey]((preState) => [...preState, newCard]);
	};

	const handleRemove = (removeColumnKey: ColumnKeys, item: { title: string }) => {
		updater[removeColumnKey]((preState) => preState.filter((v) => v.title !== item.title));
	};

	const [isAdmin, setIsAdmin] = useState(false);
	const handleToggleIsAdmin = () => {
		setIsAdmin(!isAdmin);
	};

	return (
		<>
			<Provider store={store}>
				<JustPropsMemo
					title="1"
					msg="2"
				/>
				<div
					css={css`
						display: flex;
						flex-direction: column;
						gap: 1rem;
						height: 100vh;
						text-align: center;
					`}
				>
					<header
						css={css`
							flex: 1;
							min-height: 5rem;
							display: flex;
							flex-direction: row-reverse;
							align-items: center;
							justify-content: center;
							margin: 1rem 1rem 0;
							padding: 1rem 0;
							border-radius: 1rem;
							background-color: #282c34;
							font-size: calc(10px + 2vmin);
							color: white;
						`}
					>
						<h1>
							<span>我的看板</span>
							<button onClick={handleSaveAll}>保存所有卡片</button>
							<label
								css={css`
									font-size: 12px;
								`}
							>
								<input
									type="checkbox"
									value={Number(isAdmin)}
									onChange={handleToggleIsAdmin}
								/>
								管理员模式
							</label>
						</h1>
						<img
							src={reactLogo}
							css={css`
								height: 40vmin;
								height: 80%;
								pointer-events: none;
							`}
						/>
					</header>
					<AdminContext.Provider value={isAdmin}>
						<KanbanBoard
							loading={loading}
							todoList={todoList}
							ongoingList={ongoingList}
							doneList={doneList}
							onAdd={handleAdd}
							onRemove={handleRemove}
						/>
					</AdminContext.Provider>
				</div>
			</Provider>
		</>
	);
}

export default App;
