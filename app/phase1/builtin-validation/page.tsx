'use client';

import Link from 'next/link';
import { type SubmitHandler, useForm } from 'react-hook-form';

type FormValues = {
	username: string;
	website: string;
	password: string;
	confirmPassword: string;
};

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

export default function BuiltinValidationPage() {
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({ mode: 'onBlur' });

	const onSubmit: SubmitHandler<FormValues> = (data) => {
		console.log(data);
		alert('送信成功！');
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
					Phase 1-3: ビルトインバリデーション
				</h1>
				<p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
					required / minLength / maxLength / pattern / validate を使い分ける。
				</p>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="mt-8 flex flex-col gap-5"
				>
					{/* ユーザー名: required + minLength + maxLength + validate（使用不可文字チェック） */}
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
							placeholder="3〜20文字、英数字とアンダースコアのみ"
							{...register('username', {
								required: 'ユーザー名は必須です',
								minLength: { value: 3, message: '3文字以上で入力してください' },
								maxLength: {
									value: 20,
									message: '20文字以内で入力してください',
								},
								validate: {
									noSpace: (v) =>
										!v.includes(' ') || 'スペースは使用できません',
									alphanumeric: (v) =>
										/^[a-zA-Z0-9_]+$/.test(v) ||
										'英数字とアンダースコアのみ使用できます',
								},
							})}
						/>
						<FieldError message={errors.username?.message} />
					</div>

					{/* ウェブサイト: pattern で URL 形式チェック */}
					<div className="flex flex-col gap-1">
						<label
							htmlFor="website"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							ウェブサイト
						</label>
						<input
							id="website"
							type="url"
							className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
							placeholder="https://example.com"
							{...register('website', {
								pattern: {
									value: /^https?:\/\/.+/,
									message:
										'https:// または http:// から始まるURLを入力してください',
								},
							})}
						/>
						<FieldError message={errors.website?.message} />
					</div>

					{/* パスワード: minLength + validate（強度チェック） */}
					<div className="flex flex-col gap-1">
						<label
							htmlFor="password"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							パスワード <span className="text-red-500">*</span>
						</label>
						<input
							id="password"
							type="password"
							className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
							placeholder="8文字以上、大文字・小文字・数字を含む"
							{...register('password', {
								required: 'パスワードは必須です',
								minLength: { value: 8, message: '8文字以上で入力してください' },
								validate: {
									hasUppercase: (v) =>
										/[A-Z]/.test(v) || '大文字を1文字以上含めてください',
									hasLowercase: (v) =>
										/[a-z]/.test(v) || '小文字を1文字以上含めてください',
									hasNumber: (v) =>
										/[0-9]/.test(v) || '数字を1文字以上含めてください',
								},
							})}
						/>
						<FieldError message={errors.password?.message} />
					</div>

					{/* 確認用パスワード: validate でパスワード一致チェック */}
					<div className="flex flex-col gap-1">
						<label
							htmlFor="confirmPassword"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							パスワード（確認） <span className="text-red-500">*</span>
						</label>
						<input
							id="confirmPassword"
							type="password"
							className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
							placeholder="同じパスワードをもう一度"
							{...register('confirmPassword', {
								required: '確認用パスワードは必須です',
								validate: (v) =>
									v === getValues('password') || 'パスワードが一致しません',
							})}
						/>
						<FieldError message={errors.confirmPassword?.message} />
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className="rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{isSubmitting ? '送信中...' : '登録する'}
					</button>
				</form>
			</main>
		</div>
	);
}
