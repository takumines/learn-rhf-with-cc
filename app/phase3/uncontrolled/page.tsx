'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

// ─── レンダリング回数カウンター ─────────────────────────────
// React Compiler は render 中の ref 読み書きを禁止するが、
// このコンポーネントは「再レンダリングなしにカウントを増やす」という
// useRef の性質を学習目的で意図的に利用している。
function RenderCounter({ label }: { label: string }) {
	const count = useRef(0);
	// eslint-disable-next-line react-hooks/refs
	count.current += 1;
	return (
		<p className="text-xs text-zinc-400 dark:text-zinc-500">
			{label} レンダリング回数:{' '}
			{/* eslint-disable-next-line react-hooks/refs */}
			<span className="font-bold text-amber-500">{count.current}</span>
		</p>
	);
}

// ─── 制御コンポーネント（useState）フォーム ─────────────────
// 入力のたびに setState → 再レンダリングが発生することを確認する
function ControlledForm() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [result, setResult] = useState<string | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setResult(JSON.stringify({ name, email }, null, 2));
	};

	return (
		<section className="flex flex-col gap-4 rounded-lg border border-zinc-200 dark:border-zinc-700 p-5">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
					制御コンポーネント（useState）
				</h2>
				<RenderCounter label="Controlled" />
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				<input
					className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
					placeholder="名前"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<input
					className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
					placeholder="メール"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<button
					type="submit"
					className="rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
				>
					送信
				</button>
			</form>

			{result && (
				<pre className="text-xs bg-zinc-100 dark:bg-zinc-800 rounded p-3 text-zinc-600 dark:text-zinc-400">
					{result}
				</pre>
			)}
		</section>
	);
}

// ─── 非制御コンポーネント（RHF）フォーム ────────────────────

const FieldError = ({ message }: { message?: string }) => {
	if (!message) return null;
	return <p className="text-xs text-red-500 mt-1">{message}</p>;
};

type FormValues = {
	name: string;
	email: string;
};

function UncontrolledForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			name: '',
			email: '',
		},
		mode: 'onBlur',
	});

	const [result, setResult] = useState<string | null>(null);

	const onSubmit: SubmitHandler<FormValues> = (data) => {
		setResult(JSON.stringify(data, null, 2));
	};

	return (
		<section className="flex flex-col gap-4 rounded-lg border border-zinc-200 dark:border-zinc-700 p-5">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
					非制御コンポーネント（RHF）
				</h2>
				<RenderCounter label="Uncontrolled" />
			</div>

			<form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
				<input
					className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
					placeholder="名前"
					{...register('name', { required: '必須です' })}
				/>
				<FieldError message={errors.name?.message} />

				<input
					className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
					placeholder="メール"
					{...register('email', {
						required: '必須です',
						pattern: {
							value: /.+@.+/,
							message: 'メール形式で入力してください',
						},
					})}
				/>
				<FieldError message={errors.email?.message} />

				<button
					type="submit"
					className="rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
				>
					送信
				</button>
			</form>

			{result && (
				<pre className="text-xs bg-zinc-100 dark:bg-zinc-800 rounded p-3 text-zinc-600 dark:text-zinc-400">
					{result}
				</pre>
			)}
		</section>
	);
}

// ─── ページ本体 ─────────────────────────────────────────────

export default function UncontrolledPage() {
	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-16 px-6">
			<main className="mx-auto max-w-2xl">
				<Link
					href="/"
					className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
				>
					← 一覧へ
				</Link>
				<h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
					Phase 3-1: 非制御コンポーネントの仕組みと再レンダリング戦略
				</h1>
				<p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
					左右のフォームを並べて「入力のたびにレンダリング回数がどう変わるか」を確認する。
				</p>

				<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
					<ControlledForm />
					<UncontrolledForm />
				</div>

				{/* ─── 解説パネル ─────────────────────────────────── */}
				<div className="mt-8 rounded-lg border border-zinc-200 dark:border-zinc-700 p-5 flex flex-col gap-3">
					<h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
						観察ポイント
					</h2>
					<ul className="text-sm text-zinc-500 dark:text-zinc-400 list-disc list-inside space-y-1">
						<li>制御フォームは文字を打つたびにカウントが増える</li>
						<li>RHF フォーム（mode: &quot;onChange&quot;）は何回増える？</li>
						<li>mode を &quot;onBlur&quot; に変えると増えるタイミングが変わる</li>
						<li>mode を &quot;onSubmit&quot;（デフォルト）にすると送信時のみ増える</li>
					</ul>
				</div>
			</main>
		</div>
	);
}
