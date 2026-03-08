'use client';

import Link from 'next/link';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';

type FormValues = {
	name: string;
	role: string;
	skillLevel: number;
};

// --- カスタムコンポーネント群 ---
// これらは「ref をフォワードしない」制御コンポーネントの例

type SelectProps = {
	id?: string;
	options: string[];
	value: string;
	onChange: (value: string) => void;
	onBlur: () => void;
	placeholder?: string;
};

function CustomSelect({
	id,
	options,
	value,
	onChange,
	onBlur,
	placeholder,
}: SelectProps) {
	return (
		<select
			id={id}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			onBlur={onBlur}
			className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
		>
			<option value="" disabled>
				{placeholder ?? '選択してください'}
			</option>
			{options.map((opt) => (
				<option key={opt} value={opt}>
					{opt}
				</option>
			))}
		</select>
	);
}

type StarRatingProps = {
	value: number;
	onChange: (value: number) => void;
	onBlur: () => void;
};

function StarRating({ value, onChange, onBlur }: StarRatingProps) {
	return (
		<fieldset className="flex gap-1 border-none p-0 m-0" onBlur={onBlur}>
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					key={star}
					type="button"
					onClick={() => onChange(star)}
					className={`text-2xl transition-colors ${
						star <= value
							? 'text-amber-400'
							: 'text-zinc-300 dark:text-zinc-600'
					}`}
				>
					★
				</button>
			))}
		</fieldset>
	);
}

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

// --- ページ本体 ---

const ROLE_OPTIONS = [
	'エンジニア',
	'デザイナー',
	'プロダクトマネージャー',
	'その他',
];

export default function ControllerPage() {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({ defaultValues: { skillLevel: 0 } });

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
					Phase 2-1: Controller と制御コンポーネント
				</h1>
				<p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
					register が使えないカスタムコンポーネントを RHF に繋ぐ。
				</p>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="mt-8 flex flex-col gap-6"
				>
					{/* 通常の register（参考） */}
					<div className="flex flex-col gap-1">
						<label
							htmlFor="name"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							名前 <span className="text-red-500">*</span>
						</label>
						<input
							id="name"
							className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
							{...register('name', { required: '名前は必須です' })}
						/>
						<FieldError message={errors.name?.message} />
					</div>

					{/* Controller + CustomSelect（実装済み参考例） */}
					<div className="flex flex-col gap-1">
						<label
							htmlFor="role"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							役職 <span className="text-red-500">*</span>
						</label>
						<Controller
							name="role"
							control={control}
							rules={{ required: '役職を選択してください' }}
							render={({ field }) => (
								<CustomSelect
									id="role"
									options={ROLE_OPTIONS}
									value={field.value ?? ''}
									onChange={field.onChange}
									onBlur={field.onBlur}
									placeholder="役職を選択"
								/>
							)}
						/>
						<FieldError message={errors.role?.message} />
					</div>

					{/* Controller + StarRating */}
					<div className="flex flex-col gap-1">
						<p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
							スキルレベル <span className="text-red-500">*</span>
						</p>
						<Controller
							name="skillLevel"
							control={control}
							rules={{
								validate: (v) => v >= 1 || 'スキルレベルを選択してください',
							}}
							render={({ field }) => (
								<StarRating
									value={field.value ?? 0}
									onChange={field.onChange}
									onBlur={field.onBlur}
								/>
							)}
						/>
						<FieldError message={errors.skillLevel?.message} />
					</div>

					<button
						type="submit"
						className="rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
					>
						送信
					</button>
				</form>
			</main>
		</div>
	);
}
