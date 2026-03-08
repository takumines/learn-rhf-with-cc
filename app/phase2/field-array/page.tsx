'use client';

// TODO(human): react-hook-form から必要なものを import する
// useForm, useFieldArray, SubmitHandler
import Link from 'next/link';
import { type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

type Skill = {
	name: string;
	level: 'beginner' | 'intermediate' | 'advanced';
};

type FormValues = {
	username: string;
	skills: Skill[];
};

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

export default function FieldArrayPage() {
	// TODO(human): useForm<FormValues> をセットアップする
	//   defaultValues: { username: "", skills: [{ name: "", level: "beginner" }] }
	//   取り出すもの: register, control, handleSubmit, formState: { errors }
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			username: '',
			skills: [{ name: '', level: 'beginner' }],
		},
	});

	// TODO(human): useFieldArray をセットアップする
	//   引数: { control, name: "skills" }
	//   取り出すもの: fields, append, remove
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'skills',
	});

	// TODO(human): onSubmit: SubmitHandler<FormValues> を実装する
	//   受け取ったデータを console.log と alert で確認する
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
					Phase 2-3: useFieldArray
				</h1>
				<p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
					スキルを動的に追加・削除できるフォーム。
				</p>

				{/* TODO(human): onSubmit={handleSubmit(onSubmit)} を form に追加する */}
				<form
					className="mt-8 flex flex-col gap-6"
					onSubmit={handleSubmit(onSubmit)}
				>
					{/* TODO(human): {...register("username", { required: "必須です" })} を input に追加する */}
					<div className="flex flex-col gap-1">
						<label
							htmlFor="username"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							ユーザー名 *
						</label>
						<input
							id="username"
							className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
							{...register('username', { required: '必須です' })}
						/>
						{/* TODO(human): <FieldError message={errors.username?.message} /> を追加する */}
						<FieldError message={errors.username?.message} />
					</div>

					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
								スキル一覧
							</p>
							{/* TODO(human): onClick で append({ name: "", level: "beginner" }) を呼ぶ */}
							<button
								type="button"
								className="text-xs rounded-md bg-zinc-900 dark:bg-zinc-50 px-3 py-1.5 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
								onClick={() => append({ name: '', level: 'beginner' })}
							>
								+ スキルを追加
							</button>
						</div>

						{/* TODO(human): fields.map((field, index) => ...) で各行を描画する
                ポイント:
                - key は field.id を使う（index はNG）
                - スキル名: register(`skills.${index}.name`, { required: "必須です" })
                - レベル: register(`skills.${index}.level`)
                  <select> の options: beginner / intermediate / advanced
                - 削除ボタン: onClick で remove(index) を呼ぶ
                  fields.length <= 1 のとき非表示にするとUX向上
                - 各フィールドのエラー: errors.skills?.[index]?.name?.message
            */}
						{fields.map((field, i) => (
							<div key={field.id}>
								<div className="flex gap-2 items-center justify-between">
									<input
										className="w-auto rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
										{...register(`skills.${i}.name`, { required: '必須です' })}
									/>
									<select {...register(`skills.${i}.level`)}>
										<option value="beginner">beginner</option>
										<option value="intermediate">intermediate</option>
										<option value="advanced">advanced</option>
									</select>
									{fields.length > 1 && (
										<button
											type="button"
											className="text-xs rounded-md bg-zinc-900 dark:bg-zinc-50 px-3 py-1.5 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
											onClick={() => remove(i)}
										>
											削除
										</button>
									)}
								</div>
								<FieldError message={errors.skills?.[i]?.name?.message} />
							</div>
						))}
					</div>

					<button
						type="submit"
						className="rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
					>
						保存する
					</button>
				</form>
			</main>
		</div>
	);
}
