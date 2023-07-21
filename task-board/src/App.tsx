/** @jsxImportSource @emotion/react */
import {
  useState,
  useEffect,
  DragEvent,
} from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { css } from '@emotion/react';
import KanbanBoard from './KanbanBoard';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import KanbanNewCard from './KanbanNewCard';

const DATA_STORE_KEY = 'kanban-data-store';
const COLUMN_KEY_TODO = 'todo';
const COLUMN_KEY_ONGOING = 'ongoing';
const COLUMN_KEY_DONE = 'done';

type ColumnKeys =
  | typeof COLUMN_KEY_TODO
  | typeof COLUMN_KEY_ONGOING
  | typeof COLUMN_KEY_DONE;

function App() {
  const [showAdd, setShowAdd] = useState(false);
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
  const [draggedItem, setDraggedItem] = useState<(typeof todoList)[number]>();
  const [dragSource, setDragSource] = useState<ColumnKeys>();
  const [dragTarget, setDragTarget] = useState<ColumnKeys>();

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

  const handleAdd = () => {
    setShowAdd(true);
  };

  const handleSubmit = (title: string) => {
    setTodoList((oldTodoList) => [
      { title, status: new Date().toLocaleString() },
      ...oldTodoList,
    ]);
  };

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    if (
      !draggedItem ||
      !dragSource ||
      !dragTarget ||
      dragSource === dragTarget
    ) {
      return;
    }

    const updater = {
      [COLUMN_KEY_TODO]: setTodoList,
      [COLUMN_KEY_ONGOING]: setOngoingList,
      [COLUMN_KEY_DONE]: setDoneList,
    };

    if (dragSource) {
      updater[dragSource]((preState) =>
        preState.filter((item) => !Object.is(item, draggedItem))
      );
    }

    if (dragTarget) {
      updater[dragTarget]((preState) => [...preState, draggedItem]);
    }
  };

  return (
    <>
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
            我的看板<button onClick={handleSaveAll}>保存所有卡片</button>
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
        <KanbanBoard>
          {loading ? (
            <KanbanColumn
              title="读取数据中..."
              bgColor="#E3E3E3"
            ></KanbanColumn>
          ) : (
            <>
              <KanbanColumn
                bgColor="#C9AF97"
                title={
                  <>
                    待处理
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
                  </>
                }
                setIsDragSource={(isSource: boolean) =>
                  setDragSource(isSource ? COLUMN_KEY_TODO : undefined)
                }
                setIsDragTarget={(isTarget: boolean) =>
                  setDragTarget(isTarget ? COLUMN_KEY_TODO : undefined)
                }
                onDrop={handleDrop}
              >
                <>
                  {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
                  {todoList.map((props) => (
                    <KanbanCard
                      key={props.title}
                      {...props}
                      onDragStart={() => setDraggedItem(props)}
                    />
                  ))}
                </>
              </KanbanColumn>
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
              >
                <>
                  {ongoingList.map((props) => (
                    <KanbanCard
                      key={props.title}
                      {...props}
                      onDragStart={() => setDraggedItem(props)}
                    />
                  ))}
                </>
              </KanbanColumn>
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
              >
                <>
                  {doneList.map((props) => (
                    <KanbanCard
                      key={props.title}
                      {...props}
                      onDragStart={() => setDraggedItem(props)}
                    />
                  ))}
                </>
              </KanbanColumn>
            </>
          )}
        </KanbanBoard>
      </div>
    </>
  );
}

export default App;
