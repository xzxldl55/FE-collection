/** @jsxImportSource @emotion/react */
import {
  ChangeEvent,
  KeyboardEvent,
  useState,
  useEffect,
  useRef,
  DragEvent,
} from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { css } from '@emotion/react';

const DATA_STORE_KEY = 'kanban-data-store';
const COLUMN_KEY_TODO = 'todo';
const COLUMN_KEY_ONGOING = 'ongoing';
const COLUMN_KEY_DONE = 'done';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const UPDATE_INTERVAL = MINUTE;

type ColumnKeys =
  | typeof COLUMN_KEY_TODO
  | typeof COLUMN_KEY_ONGOING
  | typeof COLUMN_KEY_DONE;

const KanbanBoard = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => (
  <main
    css={css`
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
    `}
  >
    {children}
  </main>
);

const KanbanColumn = ({
  children,
  bgColor,
  title,
  setIsDragSource = () => {},
  setIsDragTarget = () => {},
  onDrop = () => {},
}: {
  children?: JSX.Element | JSX.Element[];
  bgColor: string;
  title: string | JSX.Element;
  setIsDragSource?: (TF: boolean) => void;
  setIsDragTarget?: (TF: boolean) => void;
  onDrop?: (e: DragEvent<HTMLElement>) => void;
}) => (
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
      console.log(1);
      setIsDragSource(false);
      setIsDragTarget(false);
    }}
    css={css`
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
    `}
  >
    <h2>{title}</h2>
    <ul>{children}</ul>
  </section>
);

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
const KanbanCard = ({
  title,
  status,
  onDragStart,
}: {
  title: string;
  status: string;
  onDragStart: () => void;
}) => {
  const [displayTime, setDisplayTime] = useState(status);

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
      </div>
    </li>
  );
};

const KanbanNewCard = ({ onSubmit }: { onSubmit: (title: string) => void }) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 第二个参数为 []，即无关联状态，该副作用仅在组件挂在完毕后执行一次
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.target.value);
  };
  const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key.toLocaleLowerCase() === 'enter') {
      onSubmit(title);
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
};

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
