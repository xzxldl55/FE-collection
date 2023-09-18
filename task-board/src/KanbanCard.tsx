/** @jsxImportSource @emotion/react */
import { useState, useEffect, DragEvent, useContext } from 'react';
import { css } from '@emotion/react';
import AdminContext from './AdminContext';
import { Task } from './KanbanBoard';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const UPDATE_INTERVAL = MINUTE;

const cardStyleSheet = css`
  margin-bottom: 1rem;
  padding: 0.6rem 1rem;
  border: 1px solid gray;
  border-radius: 1rem;
  list-style: none;
  background-color: rgba(255, 255, 255, 0.4);
  text-align: left;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.2), inset 0 1px #fff;
  }
`;

export { cardStyleSheet };

export default function KanbanCard({
  title,
  status,
  onDragStart,
  onRemove,
}: {
  title: string;
  status: string;
  onDragStart: () => void;
  onRemove?: (item: Task) => void;
}) {
  const [displayTime, setDisplayTime] = useState(status);
  const isAdmin = useContext(AdminContext);

  useEffect(() => {
    const updateDisplayTime = () => {
      const timePassed = new Date().getTime() - new Date(status).getTime();
      let relativeTime = '刚刚';
      if (timePassed >= MINUTE && timePassed < HOUR) {
        relativeTime = `${Math.ceil(timePassed / MINUTE)} 分钟前`;
      } else if (timePassed >= HOUR && timePassed < DAY) {
        relativeTime = `${Math.ceil(timePassed / HOUR)} 小时前`;
      } else if (timePassed >= DAY) {
        relativeTime = `${Math.ceil(timePassed / DAY)} 天前`;
      }

      setDisplayTime(relativeTime);
    };

    const interval = setInterval(updateDisplayTime, UPDATE_INTERVAL);
    updateDisplayTime();

    // 组件卸载阶段，将调用useEffect返回的清除函数
    return function cleanup() {
      clearInterval(interval);
    };
  }, [status]);

  const handleDragStart = (e: DragEvent<HTMLElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', title);
    onDragStart && onDragStart();
  };

  return (
    <li css={cardStyleSheet} draggable onDragStart={handleDragStart}>
      <div
        css={css`
          min-height: 3rem;
        `}
      >
        {title}
      </div>
      <div
        css={css`
          text-align: right;
          font-size: 0.8rem;
          color: #333;
        `}
        title={status}
      >
        {displayTime}
        {isAdmin && onRemove && (
          <button onClick={() => onRemove({ title, status: '' })}>X</button>
        )}
      </div>
    </li>
  );
}
