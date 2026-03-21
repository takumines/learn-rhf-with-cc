'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

// ─── Zod スキーマ定義 ────────────────────────────────────────
const registerSchema = z
	.object({
		username: z
			.string()
			.min(3, '3文字以上入力してください')
			.max(20, '20文字以内で入力してください')
			.regex(/^[a-zA-Z0-9_]+$/, '英数字とアンダースコアのみ入力可能です'),
		email: z.email(),
		password: z
			.string()
			.min(8, '8文字以上で入力してください')
			.refine((v) => /[A-Z]/.test(v), '大文字を1文字以上含めてください')
			.refine((v) => /[a-z]/.test(v), '小文字を1文字以上含めてください')
			.refine((v) => /[0-9]/.test(v), '数字を1文字以上含めてください'),
		confirmPassword: z.string(),
	})
	.refine((val) => val.password === val.confirmPassword, {
		message: 'パスワードが一致しません',
		path: ['confirmPassword'],
	});

type FormValues = z.infer<typeof registerSchema>;

// ─── エラー表示コンポーネント ────────────────────────────────
function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

// ─── ページ本体 ─────────────────────────────────────────────
export default function ZodResolverPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(registerSchema),
		mode: 'onBlur',
	});

	const onSubmit: SubmitHandler<FormValues> = (data) => {
		console.log(data);
		alert(JSON.stringify(data, null, 2));
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
					Phase 3-2: Zod との連携
				</h1>
				<p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
					スキーマから型とバリデーションを同時に生成し、フィールド間バリデーションも
					Zod で解決する。
				</p>

				<form
					className="mt-8 flex flex-col gap-5"
					onSubmit={handleSubmit(onSubmit)}
				>
					{/* ユーザー名 */}
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
							{...register('username')}
						/>
						<FieldError message={errors.username?.message} />
					</div>

					{/* メールアドレス */}
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
							placeholder="you@example.com"
							{...register('email')}
						/>
						<FieldError message={errors.email?.message} />
					</div>

					{/* パスワード */}
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
							{...register('password')}
						/>
						<FieldError message={errors.password?.message} />
					</div>

					{/* パスワード確認 */}
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
							{...register('confirmPassword')}
						/>
						<FieldError message={errors.confirmPassword?.message} />
					</div>

					<button
						type="submit"
						className="rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
					>
						登録する
					</button>
				</form>

				{/* ─── 学習メモ ──────────────────────────────────────── */}
				<div className="mt-8 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 flex flex-col gap-2">
					<p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
						ポイント
					</p>
					<ul className="text-xs text-zinc-500 dark:text-zinc-400 list-disc list-inside space-y-1">
						<li>
							スキーマに <code>required</code> を書かなくてよい — Zod
							のデフォルトは必須
						</li>
						<li>
							パスワード一致は <code>.refine()</code> をスキーマレベルに書く
						</li>
						<li>
							<code>mode: &quot;onBlur&quot;</code> でも confirmPassword
							が正しく再検証される
						</li>
					</ul>
				</div>
			</main>
		</div>
	);
}
