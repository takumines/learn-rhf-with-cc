import Link from "next/link";

const phases = [
	{
		phase: 1,
		title: '基礎固め',
		sections: [
			{
				title: 'useForm / register / handleSubmit の基本',
				href: '/phase1/basic',
			},
			{ title: 'formState とエラー表示', href: '/phase1/form-state' },
			{ title: 'ビルトインバリデーション', href: '/phase1/builtin-validation' },
		],
	},
	{
		phase: 2,
		title: '実践力強化',
		sections: [
			{ title: 'Controller と制御コンポーネント', href: '/phase2/controller' },
			{ title: 'watch / setValue / getValues', href: '/phase2/watch-setvalue' },
			{ title: 'useFieldArray（動的フォーム）', href: '/phase2/field-array' },
		],
	},
	{
		phase: 3,
		title: '深堀り',
		sections: [
			{
				title: '非制御コンポーネントの仕組みと再レンダリング戦略',
				href: '/phase3/uncontrolled',
			},
			{
				title: 'Zod との連携（@hookform/resolvers/zod）',
				href: '/phase3/zod-resolver',
			},
			{
				title: 'useFormContext / フォームの分割設計',
				href: '/phase3/form-context',
			},
		],
	},
	{
		phase: 4,
		title: '応用パターン',
		sections: [
			{ title: 'パフォーマンス最適化', href: '/phase4/performance' },
			{ title: 'マルチステップフォーム', href: '/phase4/multi-step' },
		],
	},
];

export default function Home() {
	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-16 px-6">
			<main className="mx-auto max-w-2xl">
				<header className="mb-12">
					<p className="text-sm font-medium text-zinc-400 dark:text-zinc-500 mb-2">
						Next.js + TypeScript + Tailwind CSS
					</p>
					<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
						React Hook Form 学習ロードマップ
					</h1>
					<p className="mt-3 text-zinc-500 dark:text-zinc-400">
						セクション単位でチェックしながら進める。詳細は{' '}
						<code className="rounded bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 text-sm">
							LEARNING.md
						</code>{' '}
						を参照。
					</p>
				</header>

				<div className="flex flex-col gap-8">
					{phases.map(({ phase, title, sections }) => (
						<section key={phase}>
							<h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
								Phase {phase} — {title}
							</h2>
							<ul className="flex flex-col gap-2">
								{sections.map((section) => (
									<li key={section.href}>
										<Link
											href={section.href}
											className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50"
										>
											<span>{section.title}</span>
											<span className="text-zinc-300 dark:text-zinc-600">
												→
											</span>
										</Link>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
			</main>
		</div>
	);
}
