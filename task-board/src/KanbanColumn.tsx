/** @jsxImportSource @emotion/react */
import { DragEvent } from 'react';
import { css } from '@emotion/react';

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
}) {
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
        console.log(1);
        setIsDragSource(false);
        setIsDragTarget(false);
      }}
      css={style(bgColor)}
    >
      <h2>{title}</h2>
      <ul>{children}</ul>
    </section>
  );
}
