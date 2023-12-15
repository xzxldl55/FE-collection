/**
 * 当前项目使用 vite 搭建，没有用 babel，目前无法执行
 * jest 需要基于 babel 安装 @babel/preset-typescript 来执行（添加到babel.config.js - presets: [...]）
 */
import { act, fireEvent, render } from '@testing-library/react';
import KanbanNewCard from '../KanbanNewCard';

describe('KanbanNewCard', () => {
	it('添加新卡片', async () => {
		const onSubmit = jest.fn();
		// Act动作 --> 渲染卡片组件，并获取以其为基准的 selector 们
		const { findByText, findByRole } = render(<KanbanNewCard onSubmit={onSubmit} />);

		// Assert断言
		const titleElem = await findByText('添加新卡片'); // 获取元素
		except(titleElem).toBeInTheDocument();

		const inputElem = await findByRole('textbox');
		except(inputElem).toHaveFocus();

        // 触发动作新增卡片
		act(() => {
			fireEvent.change(inputElem, { target: { value: '单元测试卡片-1' } });
			fireEvent.keyDown(inputElem, { key: 'Enter' });
		});

        // 断言，检测动作
        except(onSubmit).toHaveBeenCalledTimes(1); // 函数是否被调用
        except(onSubmit.mock.lastCall[0]).toHaveProperty('title', '单元测试卡片-1');
	});
});
