'use client';

import Link from 'next/link';
// useFormContext は PersonalSection / AddressSection で使う（TODO参照）
import {
	FormProvider,
	type SubmitHandler,
	useForm,
	useFormContext,
} from 'react-hook-form';

// ─── 型定義 ──────────────────────────────────────────────
type FormValues = {
	personal: {
		firstName: string;
		lastName: string;
		email: string;
	};
	address: {
		postalCode: string;
		city: string;
		street: string;
	};
};

// ─── エラー表示コンポーネント ────────────────────────────
function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

// ─── 個人情報セクション（子コンポーネント） ─────────────
// Props は一切受け取らない。Context 経由でフォーム状態を取得する。
function PersonalSection() {
	// TODO(human): useFormContext<FormValues>() で register と errors を取得する
	// （Hint: const { register, formState: { errors } } = useFormContext<FormValues>()）
	const {
		register,
		formState: { errors },
	} = useFormContext<FormValues>();

	return (
		<fieldset className="flex flex-col gap-4 rounded-lg border border-zinc-200 dark:border-zinc-700 p-5">
			<legend className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 px-1">
				個人情報
			</legend>

			{/* 姓 */}
			<div className="flex flex-col gap-1">
				<label
					htmlFor="lastName"
					className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
				>
					姓 <span className="text-red-500">*</span>
				</label>
				{/* TODO(human): {...register("personal.lastName", { required: "必須です" })} を追加する */}
				<input
					id="lastName"
					className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
					placeholder="山田"
					{...register('personal.lastName', { required: '必須です' })}
				/>
				{/* TODO(human): <FieldError message={errors.personal?.lastName?.message} /> を追加する */}
				<FieldError message={errors.personal?.lastName?.message} />
			</div>

			{/* 名 */}
			<div className="flex flex-col gap-1">
				<label
					htmlFor="firstName"
					className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
				>
					名 <span className="text-red-500">*</span>
				</label>
				{/* TODO(human): {...register("personal.firstName", { required: "必須です" })} を追加する */}
				<input
					id="firstName"
					className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
					placeholder="太郎"
					{...register('personal.firstName', {required: '必須です'})}
				/>
				{/* TODO(human): <FieldError message={errors.personal?.firstName?.message} /> を追加する */}
				<FieldError message={errors.personal?.firstName?.message} />
			</div>

			{/* メール */}
			<div className="flex flex-col gap-1">
				<label
					htmlFor="email"
					className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
				>
					メールアドレス <span className="text-red-500">*</span>
				</label>
				{/* TODO(human): {...register("personal.email", { required: "必須です", pattern: { value: /.../, message: "..." } })} を追加する */}
				<input
					id="email"
					type="email"
					className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
					placeholder="you@example.com"
					{...register('personal.email', { required: '必須です',pattern: {
							value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: '正しいメール形式で入力してください',
						}, })}
				/>
				{/* TODO(human): <FieldError message={errors.personal?.email?.message} /> を追加する */}
				<FieldError message={errors.personal?.email?.message} />
			</div>
		</fieldset>
	);
}

// ─── 住所セクション（子コンポーネント） ──────────────────
// Props は一切受け取らない。Context 経由でフォーム状態を取得する。
function AddressSection() {
	// TODO(human): useFormContext<FormValues>() で register と errors を取得する
	const {
		register,
		formState: { errors },
	} = useFormContext<FormValues>();

	return (
		<fieldset className="flex flex-col gap-4 rounded-lg border border-zinc-200 dark:border-zinc-700 p-5">
			<legend className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 px-1">
				住所
			</legend>

			{/* 郵便番号 */}
			<div className="flex flex-col gap-1">
				<label
					htmlFor="postalCode"
					className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
				>
					郵便番号 <span className="text-red-500">*</span>
				</label>
				{/* TODO(human): {...register("address.postalCode", { required, pattern })} を追加する */}
				<input
					id="postalCode"
					className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
					placeholder="123-4567"
					{...register('address.postalCode', {
						required: '必須です',
						pattern: {
							value: /^\d{3}-?\d{4}$/,
							message: "フォーマットが異なります"
						},
					})}
				/>
				{/* TODO(human): <FieldError message={errors.address?.postalCode?.message} /> を追加する */}
				<FieldError message={errors.address?.postalCode?.message} />
			</div>

			{/* 市区町村 */}
			<div className="flex flex-col gap-1">
				<label
					htmlFor="city"
					className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
				>
					市区町村 <span className="text-red-500">*</span>
				</label>
				{/* TODO(human): {...register("address.city", { required: "必須です" })} を追加する */}
				<input
					id="city"
					className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
					placeholder="渋谷区"
					{...register("address.city", { required: "必須です" })}
				/>
				{/* TODO(human): <FieldError message={errors.address?.city?.message} /> を追加する */}
				<FieldError message={errors.address?.city?.message} />
			</div>

			{/* 番地・建物名 */}
			<div className="flex flex-col gap-1">
				<label
					htmlFor="street"
					className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
				>
					番地・建物名 <span className="text-red-500">*</span>
				</label>
				{/* TODO(human): {...register("address.street", { required: "必須です" })} を追加する */}
				<input
					id="street"
					className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
					placeholder="道玄坂1-2-3 ○○ビル5F"
					{...register("address.street", { required: "必須です" })}
				/>
				{/* TODO(human): <FieldError message={errors.address?.street?.message} /> を追加する */}
				<FieldError message={errors.address?.street?.message} />
			</div>
		</fieldset>
	);
}

// ─── ページ本体 ─────────────────────────────────────────
export default function FormContextPage() {
	// TODO(human): useForm<FormValues> をセットアップして methods に代入する
	//   defaultValues で全フィールドを空文字で初期化する
	//   const methods = useForm<FormValues>({ defaultValues: { ... } })
	const methods = useForm<FormValues>({
		defaultValues: {
			personal: { firstName: '', lastName: '', email: '' },
			address: { postalCode: '', city: '', street: '' },
		},
	});

	// TODO(human): onSubmit を実装する（console.log と alert でデータ確認）
	const onSubmit: SubmitHandler<FormValues> = (data) => {
		console.log(data);
		alert(JSON.stringify(data, null, 2));
	};

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-16 px-6">
			<main className="mx-auto max-w-lg">
				<Link
					href="/"
					className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
				>
					← 一覧へ
				</Link>
				<h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
					Phase 3-3: useFormContext / フォームの分割設計
				</h1>
				<p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
					フォームを複数コンポーネントに分割し、Context
					経由で状態を共有する。Props drilling なしで大規模フォームを設計する。
				</p>

				{/* TODO(human): FormProvider に {...methods} をスプレッドして form タグをラップする */}
				{/* Hint: <FormProvider {...methods}><form ...>...</form></FormProvider> */}
				<FormProvider {...methods}>
					<form
						className="mt-8 flex flex-col gap-6"
						onSubmit={methods.handleSubmit(onSubmit)}
					>
						<PersonalSection />
						<AddressSection />

						<button
							type="submit"
							className="rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
						>
							送信する
						</button>
					</form>
				</FormProvider>

				{/* ─── 学習メモ ──────────────────────────────────────── */}
				<div className="mt-8 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 flex flex-col gap-2">
					<p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
						ポイント
					</p>
					<ul className="text-xs text-zinc-500 dark:text-zinc-400 list-disc list-inside space-y-1">
						<li>
							<code>FormProvider</code> は <code>useForm()</code>{' '}
							が返すメソッド群を Context に注入する
						</li>
						<li>
							子コンポーネントは <code>useFormContext()</code> で Props なしに{' '}
							<code>register</code>・<code>errors</code> にアクセスできる
						</li>
						<li>
							ネストしたフィールド名は{' '}
							<code>&quot;personal.firstName&quot;</code>{' '}
							のようにドット記法で指定する
						</li>
					</ul>
				</div>
			</main>
		</div>
	);
}
