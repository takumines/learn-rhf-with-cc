'use client';

import Link from 'next/link';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

type FormValues = {
	username: string;
	email: string;
};

export default function BasicPage() {
	const [submitted, setSubmitted] = useState<FormValues | null>(null);

	const { register, handleSubmit } = useForm<FormValues>();

	// SubmitHandler<FormValues>を使うと、引数が片付けされる
	// これは、フォームのスキーマとUIの入力が一致していることをコンパイル時に保証する仕組み
	const onSubmit: SubmitHandler<FormValues> = (data) => {
		setSubmitted(data);
	};

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-16 px-6">
			<main className="mx-auto max-w-md">
				<Link
					href="/"
					className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
				>
					← 一覧へ
				</Link>
				<h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
					Phase 1-1: useForm / register / handleSubmit
				</h1>
				<p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
					RHF の基本三点セットを体験する。
				</p>

				{/* フォーム本体 */}
				<form
					className="mt-8 flex flex-col gap-5"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="username"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							ユーザー名
						</label>
						<input
							id="username"
							className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
							placeholder="taro"
							{...register('username')}
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label
							htmlFor="email"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							メールアドレス
						</label>
						<input
							id="email"
							type="email"
							className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
							placeholder="taro@example.com"
							{...register('email')}
						/>
					</div>

					<button
						type="submit"
						className="rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
					>
						送信
					</button>
				</form>

				{/* 送信結果の表示 */}
				{submitted && (
					<div className="mt-6 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-4">
						<p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
							送信成功 ✓
						</p>
						<pre className="text-xs text-emerald-600 dark:text-emerald-400">
							{JSON.stringify(submitted, null, 2)}
						</pre>
					</div>
				)}
			</main>
		</div>
	);
}
