/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

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

export default function KanbanBoard({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <main
      css={style}
    >
      {children}
    </main>
  );
}
