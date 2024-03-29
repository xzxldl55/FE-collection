/** @jsxImportSource @emotion/react */
import { ChangeEvent, KeyboardEvent, useState, useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import { cardStyleSheet } from './KanbanCard';
import { useSelector, useDispatch } from 'react-redux';
import { addCard } from './redux-store';

export default function KanbanNewCard({ onSubmit }: { onSubmit: (title: string) => void }) {
	const [title, setTitle] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);
	const cardList = useSelector((state) => state);
	const dispatch = useDispatch();

	// 第二个参数为 []，即无关联状态，该副作用仅在组件挂载完毕后执行一次
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
		setTitle(evt.target.value);
	};
	const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
		if (evt.key.toLocaleLowerCase() === 'enter') {
			onSubmit(title);
			dispatch(addCard({ newCard: { title } }));
		}
	};

	return (
		<li css={cardStyleSheet}>
			<h3>添加新卡片</h3>
			<div
				css={css`
					min-height: 3rem;
				`}
			>
				<input
					ref={inputRef}
					css={css`
						width: 80%;
					`}
					type="text"
					value={title}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
				/>
			</div>
		</li>
	);
}
