'use client';

import Link from 'next/link';
import { type SubmitHandler, useForm } from 'react-hook-form';

type FormValues = {
	username: string;
	email: string;
	age: number;
};

export default function FormStatePage() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
	} = useForm<FormValues>({ mode: 'onBlur' });

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		await new Promise((resolve) => setTimeout(resolve, 1500)); // 送信中の状態を確認するための遅延
		console.log(data);
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
					Phase 1-2: formState とエラー表示
				</h1>
				<p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
					バリデーションエラーをUIに反映し、送信中の状態を制御する。
				</p>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="mt-8 flex flex-col gap-5"
				>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="username"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							ユーザー名 <span className="text-red-500">*</span>
						</label>
						<input
							id="username"
							className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
							placeholder="3文字以上"
							{...register('username', {
								required: 'ユーザー名は必須です',
								minLength: { value: 3, message: '3文字以上で入力してください' },
							})}
						/>
						{errors.username && (
							<p className="text-xs text-red-500 mt-1">
								{errors.username.message}
							</p>
						)}
					</div>

					<div className="flex flex-col gap-1">
						<label
							htmlFor="email"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							メールアドレス <span className="text-red-500">*</span>
						</label>
						<input
							id="email"
							type="email"
							className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
							placeholder="taro@example.com"
							{...register('email', {
								required: 'メールアドレスは必須です',
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: '正しいメール形式で入力してください',
								},
							})}
						/>
						{errors.email && (
							<p className="text-xs text-red-500 mt-1">
								{errors.email.message}
							</p>
						)}
					</div>

					<div className="flex flex-col gap-1">
						<label
							htmlFor="age"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							年齢 <span className="text-red-500">*</span>
						</label>
						<input
							id="age"
							type="number"
							className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
							placeholder="18〜120"
							{...register('age', {
								required: '年齢は必須です',
								min: { value: 18, message: '18歳以上である必要があります' },
								max: { value: 120, message: '正しい年齢を入力してください' },
								valueAsNumber: true,
							})}
						/>
						{errors.age && (
							<p className="text-xs text-red-500 mt-1">{errors.age.message}</p>
						)}
					</div>

					<button
						type="submit"
						className="rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed"
						disabled={!isValid || isSubmitting}
					>
						{isSubmitting ? '送信中' : '送信'}
					</button>
				</form>
			</main>
		</div>
	);
}
