/** @jsxImportSource @emotion/react */
import { DragEvent, useState } from 'react';
import { css } from '@emotion/react';
import KanbanCard from './KanbanCard';
import KanbanNewCard from './KanbanNewCard';

const style = (bgColor: string) => css`
  flex: 1 1;
  display: flex;
  flex-direction: column;
  border: 1px solid gray;
  border-radius: 1rem;
  background-color: ${bgColor};

  & > h2 {
    margin: 0.6rem 1rem;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid gray;
  }

  & > ul {
    flex: 1;
    flex-basis: 0;
    margin: 1rem;
    padding: 0;
    overflow: auto;
  }
`;

export default function KanbanColumn({
  bgColor,
  title,
  setIsDragSource = () => {},
  setIsDragTarget = () => {},
  onDrop = () => {},
  cardList = [],
  setDraggedItem,
  canAddNew = false,
  onAdd,
  onRemove,
}: {
  children?: JSX.Element | JSX.Element[];
  bgColor: string;
  title: string | JSX.Element;
  onRemove?: (item: { title: string; }) => void;
  setIsDragSource?: (TF: boolean) => void;
  setIsDragTarget?: (TF: boolean) => void;
  onDrop?: (e: DragEvent<HTMLElement>) => void;
  cardList?: { title: string; status: string }[];
  setDraggedItem?: (props: { title: string; status: string }) => void;
  canAddNew?: boolean;
  onAdd?: (newCard: { title: string; status: string }) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const handleAdd = () => {
    setShowAdd(true);
  };
  const handleSubmit = (title: string) => {
    onAdd && onAdd({ title, status: new Date().toString() });
    setShowAdd(false);
  };

  return (
    <section
      // card的dragStart事件会冒泡上来，这样我们就能够设置正确的列为数据源列了
      onDragStart={() => setIsDragSource(true)}
      onDragOver={(e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDragTarget(true);
      }}
      onDragLeave={(e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'none';
        setIsDragTarget(false);
      }}
      onDrop={(e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        onDrop && onDrop(e);
      }}
      onDragEnd={(e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        setIsDragSource(false);
        setIsDragTarget(false);
      }}
      css={style(bgColor)}
    >
      <h2>
        {title}
        {canAddNew && (
          <button
            css={css`
              float: right;
              margin-top: 0.2rem;
              padding: 0.2rem 0.5rem;
              border: 0;
              border-radius: 1rem;
              height: 1.8rem;
              line-height: 1rem;
              font-size: 1rem;
            `}
            onClick={handleAdd}
          >
            &#8853; 添加新卡片
          </button>
        )}
      </h2>
      <ul>
        {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
        {cardList.map((props) => (
          <KanbanCard
            title={props.title}
            status={props.status}
            key={props.title}
            onDragStart={() => setDraggedItem && setDraggedItem(props)}
            onRemove={onRemove}
          />
        ))}
      </ul>
    </section>
  );
}
