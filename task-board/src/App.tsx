import { ChangeEvent, KeyboardEvent, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';

function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [todoList, setTodoList] = useState([
    { title: '开发任务-1', status: '22-05-22 18:15' },
    { title: '开发任务-3', status: '22-05-22 18:15' },
    { title: '开发任务-5', status: '22-05-22 18:15' },
    { title: '测试任务-3', status: '22-05-22 18:15' },
  ]);
  const [ongoingList, setOngoingList] = useState([
    { title: '开发任务-4', status: '22-05-22 18:15' },
    { title: '开发任务-6', status: '22-05-22 18:15' },
    { title: '测试任务-2', status: '22-05-22 18:15' },
  ]);
  const [doneList, setDoneList] = useState([
    { title: '开发任务-2', status: '22-05-22 18:15' },
    { title: '测试任务-1', status: '22-05-22 18:15' },
  ]);

  const handleAdd = () => {
    setShowAdd(true);
  };
  const handleSubmit = (title: string) => {
    setTodoList((oldTodoList) => [
      { title, status: new Date().toLocaleString() },
      ...oldTodoList,
    ]);
  };

  const KanbanCard = ({ title, status }: (typeof todoList)[number]) => (
    <li className="kanban-card">
      <div className="card-title">{title}</div>
      <div className="card-status">{status}</div>
    </li>
  );

  const KanbanNewCard = ({
    onSubmit,
  }: {
    onSubmit: (title: string) => void;
  }) => {
    const [title, setTitle] = useState('');
    const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
      setTitle(evt.target.value);
    };
    const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
      if (evt.key.toLocaleLowerCase() === 'enter') {
        onSubmit(title);
      }
    };

    return (
      <li className="kanban-card">
        <h3>添加新卡片</h3>
        <div className="card-title">
          <input
            type="text"
            value={title}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      </li>
    );
  };

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>我的看板</h1>
          <img src={reactLogo} alt="" className="App-logo" />
        </header>
        <main className="kanban-board">
          <section className="kanban-column column-todo">
            <h2>
              待处理
              <button onClick={handleAdd}>&#8853; 添加新卡片</button>
            </h2>
            <ul>
              {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
              {todoList.map((props) => (
                <KanbanCard {...props} />
              ))}
            </ul>
          </section>
          <section className="kanban-column column-ongoing">
            <h2>进行中</h2>
            <ul>
              {ongoingList.map((props) => (
                <KanbanCard {...props} />
              ))}
            </ul>
          </section>
          <section className="kanban-column column-done">
            <h2>已完成</h2>
            <ul>
              {doneList.map((props) => (
                <KanbanCard {...props} />
              ))}
            </ul>
          </section>
        </main>
      </div>
    </>
  );
}

export default App;
