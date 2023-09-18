/** @jsxImportSource @emotion/react */

interface JustPropsProps {
	title: string;
	msg: string;
}

export default function JustProps({ title, msg }: JustPropsProps) {
	return (
		<>
			<div>我是标题：{title}</div>
			<div>我是内容：{msg}</div>
		</>
	);
}
