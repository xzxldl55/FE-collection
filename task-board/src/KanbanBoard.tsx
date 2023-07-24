/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import KanbanColumn from './KanbanColumn';
import { useState } from 'react';

const style = css`
  flex: 10;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin: 0 1rem 1rem;

  @media (max-width: 640px) {
    & {
      flex-direction: column;
    }
  }
`;

export const COLUMN_KEY_TODO = 'todo';
export const COLUMN_KEY_ONGOING = 'ongoing';
export const COLUMN_KEY_DONE = 'done';

export type ColumnKeys =
  | typeof COLUMN_KEY_TODO
  | typeof COLUMN_KEY_ONGOING
  | typeof COLUMN_KEY_DONE;

export default function KanbanBoard({
  loading = true,
  todoList = [],
  ongoingList = [],
  doneList = [],
  onAdd,
  onRemove,
}: {
  loading: boolean;
  todoList: { title: string; status: string }[];
  ongoingList: { title: string; status: string }[];
  doneList: { title: string; status: string }[];
  onAdd: (
    addColumnKey: ColumnKeys,
    newCard: {
      title: string;
      status: string;
    }
  ) => void;
  onRemove: (
    removeColumnKey: ColumnKeys,
    item: {
      title: string;
    }
  ) => void;
}) {
  const [draggedItem, setDraggedItem] = useState<(typeof todoList)[number]>();
  const [dragSource, setDragSource] = useState<ColumnKeys>();
  const [dragTarget, setDragTarget] = useState<ColumnKeys>();

  const handleDrop = () => {
    if (
      !draggedItem ||
      !dragSource ||
      !dragTarget ||
      dragSource === dragTarget
    ) {
      return;
    }

    dragSource && onRemove(dragSource, draggedItem);
    dragTarget && onAdd(dragTarget, draggedItem);
  };

  return (
    <main css={style}>
      {loading ? (
        <KanbanColumn title="读取数据中..." bgColor="#E3E3E3"></KanbanColumn>
      ) : (
        <>
          <KanbanColumn
            bgColor="#C9AF97"
            title="待处理"
            setIsDragSource={(isSource: boolean) =>
              setDragSource(isSource ? COLUMN_KEY_TODO : undefined)
            }
            setIsDragTarget={(isTarget: boolean) =>
              setDragTarget(isTarget ? COLUMN_KEY_TODO : undefined)
            }
            onDrop={handleDrop}
            cardList={todoList}
            setDraggedItem={setDraggedItem}
            canAddNew={true}
            onAdd={onAdd.bind(null, COLUMN_KEY_TODO)}
            onRemove={onRemove.bind(null, COLUMN_KEY_TODO)}
          ></KanbanColumn>
          <KanbanColumn
            bgColor="#FFE799"
            title="进行中"
            setIsDragSource={(isSource: boolean) =>
              setDragSource(isSource ? COLUMN_KEY_ONGOING : undefined)
            }
            setIsDragTarget={(isTarget: boolean) =>
              setDragTarget(isTarget ? COLUMN_KEY_ONGOING : undefined)
            }
            onDrop={handleDrop}
            cardList={ongoingList}
            setDraggedItem={setDraggedItem}
            onRemove={onRemove.bind(null, COLUMN_KEY_ONGOING)}
          />
          <KanbanColumn
            bgColor="#C0E8BA"
            title="已完成"
            setIsDragSource={(isSource: boolean) =>
              setDragSource(isSource ? COLUMN_KEY_DONE : undefined)
            }
            setIsDragTarget={(isTarget: boolean) =>
              setDragTarget(isTarget ? COLUMN_KEY_DONE : undefined)
            }
            onDrop={handleDrop}
            cardList={doneList}
            setDraggedItem={setDraggedItem}
            onRemove={onRemove.bind(null, COLUMN_KEY_DONE)}
          />
        </>
      )}
    </main>
  );
}
