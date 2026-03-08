'use client';

import Link from 'next/link';
import { type SubmitHandler, useForm } from 'react-hook-form';

type DeliveryType = 'standard' | 'express' | 'scheduled';

type FormValues = {
	senderName: string;
	senderAddress: string;
	recipientName: string;
	recipientAddress: string;
	deliveryType: DeliveryType;
	deliveryDate: string;
};

const MOCK_LAST_ORDER = {
	recipientName: '田中 花子',
	recipientAddress: '東京都渋谷区1-2-3',
};

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

export default function WatchSetValuePage() {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<FormValues>({ defaultValues: { deliveryType: 'standard' } });

	const watchedDeliveryType = watch('deliveryType');
	const watchedAll = watch();

	const handleCopyFromSender = () => {
		const values = getValues(['senderName', 'senderAddress']);
		setValue('recipientName', values[0], { shouldValidate: true });
		setValue('recipientAddress', values[1], { shouldValidate: true });
	};

	const handleCopyFromLastOrder = () => {
		setValue('recipientName', MOCK_LAST_ORDER.recipientName, {
			shouldValidate: true,
		});
		setValue('recipientAddress', MOCK_LAST_ORDER.recipientAddress, {
			shouldValidate: true,
		});
	};

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
					Phase 2-2: watch / setValue / getValues
				</h1>
				<p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
					フォームの値をリアクティブに監視し、プログラムから操作する。
				</p>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="mt-8 flex flex-col gap-5"
				>
					{/* 送り主情報 */}
					<fieldset className="flex flex-col gap-3 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
						<legend className="text-xs font-semibold uppercase tracking-widest text-zinc-400 px-1">
							送り主
						</legend>
						<div className="flex flex-col gap-1">
							<label
								htmlFor="senderName"
								className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								名前 *
							</label>
							<input
								id="senderName"
								className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
								{...register('senderName', { required: '必須です' })}
							/>
							<FieldError message={errors.senderName?.message} />
						</div>
						<div className="flex flex-col gap-1">
							<label
								htmlFor="senderAddress"
								className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								住所 *
							</label>
							<input
								id="senderAddress"
								className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
								{...register('senderAddress', { required: '必須です' })}
							/>
							<FieldError message={errors.senderAddress?.message} />
						</div>
					</fieldset>

					{/* 届け先情報 */}
					<fieldset className="flex flex-col gap-3 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
						<legend className="text-xs font-semibold uppercase tracking-widest text-zinc-400 px-1">
							届け先
						</legend>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={handleCopyFromSender}
								className="text-xs rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
							>
								送り主と同じ
							</button>
							<button
								type="button"
								onClick={handleCopyFromLastOrder}
								className="text-xs rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
							>
								前回の注文からコピー
							</button>
						</div>
						<div className="flex flex-col gap-1">
							<label
								htmlFor="recipientName"
								className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								名前 *
							</label>
							<input
								id="recipientName"
								className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
								{...register('recipientName', { required: '必須です' })}
							/>
							<FieldError message={errors.recipientName?.message} />
						</div>
						<div className="flex flex-col gap-1">
							<label
								htmlFor="recipientAddress"
								className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								住所 *
							</label>
							<input
								id="recipientAddress"
								className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
								{...register('recipientAddress', { required: '必須です' })}
							/>
							<FieldError message={errors.recipientAddress?.message} />
						</div>
					</fieldset>

					{/* 配送オプション */}
					<div className="flex flex-col gap-1">
						<label
							htmlFor="deliveryType"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							配送タイプ
						</label>
						<select
							id="deliveryType"
							className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
							{...register('deliveryType')}
						>
							<option value="standard">通常配送</option>
							<option value="express">速達</option>
							<option value="scheduled">日時指定</option>
						</select>
					</div>

					{/* TODO(human) D: watchedDeliveryType === "scheduled" のときだけこのフィールドを表示する */}
					{watchedDeliveryType === 'scheduled' && (
						<div className="flex flex-col gap-1">
							<label
								htmlFor="deliveryDate"
								className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								配送日時 *
							</label>
							<input
								id="deliveryDate"
								type="datetime-local"
								className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
								{...register('deliveryDate', {
									required: '配送日時を選択してください',
								})}
							/>
							<FieldError message={errors.deliveryDate?.message} />
						</div>
					)}

					<button
						type="submit"
						className="rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
					>
						注文する
					</button>
				</form>

				{/* TODO(human) E: watchedAll を JSON.stringify してライブプレビューを表示する */}
				<div className="mt-8 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
					<p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
						ライブプレビュー
					</p>
					<pre className="text-xs text-zinc-500 dark:text-zinc-400">
						<p>{JSON.stringify(watchedAll, null, 2)}</p>
					</pre>
				</div>
			</main>
		</div>
	);
}
