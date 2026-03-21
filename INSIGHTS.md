# React Hook Form — 学習インサイト集

学習を通じて得た実装上のポイントをフェーズ・セクション別にまとめたメモ。

---

## Phase 1: 基礎固め

### 1-1. `useForm` / `register` / `handleSubmit`

- **`register` はSpreadオブジェクト**
  `register("email")` は `{ ref, name, onChange, onBlur }` を返す。`{...register("email")}` のスプレッドでinputをDOMレベルで直接管理するため、React Stateを使わず再レンダリングが発生しない。

- **`handleSubmit` はバリデーションラッパー**
  バリデーションが失敗した場合はコールバックは呼ばれず、`formState.errors` だけが更新される。内部で `event.preventDefault()` も自動で呼ばれるのでページリロードが起きない。

- **`SubmitHandler<FormValues>` で型安全を保証**
  `data` パラメータが `FormValues` 型として推論される。「フォームのスキーマとUIの入力が一致していること」をコンパイル時に保証する仕組み。

---

### 1-2. `formState` とエラー表示

- **`formState` はプロキシベース**
  destructureしたプロパティだけを購読するため、取り出さなかったプロパティの変化では再レンダリングが起きない。使わない `isValid` を取り出すと「isValid が変わるたびに再レンダリング」が発生するので注意。

- **`errors.fieldName` と `isValid` は冗長になる**
  `errors.username` が存在するとき、`isValid` は必ず `false`。エラー表示には `errors.fieldName &&` だけで十分。`isValid` はフォーム全体の状態でUIを制御する場面（ボタンの活性制御など）に使う。

- **`isValid` は `mode` 依存**

  | mode | isValid の挙動 |
  |------|--------------|
  | `'onSubmit'`（デフォルト） | 初回送信前は常に `false` |
  | `'onBlur'` / `'onChange'` | フィールドを操作するたびに更新 |

---

### 1-3. ビルトインバリデーション

- **`validate` はオブジェクトで複数ルールを定義できる**
  ```ts
  validate: {
    noSpace: (v) => !v.includes(" ") || "エラー",
    alphanumeric: (v) => /^[a-zA-Z0-9_]+$/.test(v) || "エラー",
  }
  ```
  各ルールに名前が付くため `errors.fieldName.type` でどのルールで失敗したかを判別できる。

- **クロスフィールドバリデーションには `validate` + `getValues`**
  ```ts
  validate: (v) => v === getValues("password") || "パスワードが一致しません"
  ```

- **`mode: "onBlur"` でのクロスフィールドバリデーションの落とし穴**
  パスワードを後から変更しても `confirmPassword` は再検証されない。
  解決策:（1）`password` の `onChange` で `trigger("confirmPassword")` を呼ぶ、（2）Phase 3 の Zod `.refine()` でフォームレベルのバリデーションにする。

- **`min` / `max` はメッセージオブジェクト形式で書く**
  ショートハンド `min: 1` だとエラーメッセージが `undefined` になる。
  正しくは `min: { value: 1, message: "エラー文字列" }` または `validate` を使う。

---

## Phase 2: 実践力強化

### 2-1. `Controller` と制御コンポーネント

- **`register` が使えないケース**
  独自の `onChange` シグネチャ（値をイベントオブジェクトでなく直接渡す）を持つコンポーネントや、`ref` をフォワードしないコンポーネントには `register` が使えない。

- **`Controller` は RHF とカスタムコンポーネントの「アダプター」**
  `render` prop の `field`（`onChange` / `value` / `onBlur` / `ref`）をコンポーネントに渡すことで RHF に繋ぐ。

- **`register` と `Controller` は同じフォームに混在できる**
  「ネイティブ input は `register`、カスタム UI は `Controller`」が実務の基本パターン。

- **`defaultValues` で `field.value` の `undefined` リスクをゼロにする**
  TypeScript の型では `number` でも、初期化前は `undefined` になり得る。`useForm({ defaultValues: { skillLevel: 0 } })` を設定することで解消。

### 2-2. `watch` / `setValue` / `getValues`

- **3つのAPIの使い分け**

  | API | リアクティブ | 用途 |
  |-----|------------|------|
  | `watch` | ✓ 再レンダリング発生 | 値の変化に応じてUIを更新する |
  | `getValues` | ✗ スナップショット | イベントハンドラ内で現在値を読み取る |
  | `setValue` | — 書き込み専用 | プログラムからフィールドを更新する |

- **`watch()` と React Compiler の相性問題**
  React 19 + React Compiler 環境では `watch()` を含むコンポーネントのメモ化がスキップされる。
  正式な解決策は `useWatch` Hook（Phase 4 で扱う）。学習段階では `watch()` で概念を掴み、実務では `useWatch` に切り替える。
  ```tsx
  // 学習用
  const value = watch("fieldName");
  // 実務推奨（React Compiler 対応）
  const value = useWatch({ control, name: "fieldName" });
  ```

- **`setValue` の第3引数でバリデーションを即時実行できる**
  ```ts
  setValue("field", newValue, { shouldValidate: true });
  ```
  省略するとバリデーションは次のsubmit時まで走らない。コピーボタンなど「外部から値をセットした後すぐエラー状態を更新したい」場面で必須。

- **`getValues` は配列引数で複数フィールドを一括取得できる**
  ```ts
  const [name, address] = getValues(["senderName", "senderAddress"]);
  // 返り値はタプル型なので数値インデックスでアクセスする（文字列キーは不可）
  ```

### 2-3. `useFieldArray`

- **`fields` は `FormValues.skills` とは別の配列**
  `useFieldArray` が返す `fields` は各要素に `id`（RHF が付与するUUID）が付いたオブジェクト配列。送信データには `id` は含まれず、純粋な `Skill[]` として `onSubmit` に渡される。

- **`key` に `field.id` を使う理由**
  `append`/`remove` で配列が変化すると、`index` ベースのkeyはReactに「要素が入れ替わった」と誤認識させる。`field.id` はstable UUIDなので並び替え・削除後も同じDOMノードが再利用され、入力値が保持される。

- **削除ボタンに `type="button"` は必須**
  `type` 未指定のボタンのデフォルトは `"submit"`。`useFieldArray` 内の削除ボタンに `type="button"` を忘れると、削除クリック時に `handleSubmit` が発火しバリデーションが走る。

- **ネストしたフィールドのエラーアクセスパターン**
  ```ts
  errors.skills?.[index]?.name?.message
  ```
  `errors.skills` は `FieldErrors<Skill>[]` 型なので数値インデックスでアクセスする。オプショナルチェーンを3段重ねるのが基本形。

---

## Phase 3: 深堀り

### 3-1. 非制御コンポーネントの仕組みと再レンダリング戦略

- **React Strict Mode が開発時のカウントを増やす2つの仕組み**
  1. レンダー関数の二重呼び出し（副作用の検出）→ 全コンポーネントに +1
  2. エフェクトの二重実行（mount → cleanup → remount）→ `useEffect` を持つコンポーネントに +2
  `useForm` は内部で `useEffect` を使って初期化するため、開発環境では Strict Mode により初回レンダーが 4 回になる。本番では 1 回。

- **`mode` オプションとレンダリングの関係**

  | mode | 再レンダーが走るタイミング |
  |------|--------------------------|
  | `'onSubmit'`（デフォルト） | 送信時のみ |
  | `'onBlur'` | フォーカスアウト時 |
  | `'onChange'` | 入力のたびに |

  `'onChange'` が `useState` と同じ頻度に見えるのは、`formState.errors` / `isValid` の更新が再レンダーを引き起こすため。入力値そのものは React state を経由しないが、バリデーション結果は経由する。

- **`React.memo` が効くのは「下流の子コンポーネント保護」だけ**
  `useForm` を呼んでいるコンポーネント自体を `memo` 化しても、内部 state（`formState`）の変化は止められない。`memo` の効果は「親からの再レンダーを止める」こと。フィールドを子コンポーネントに切り出して `memo` 化すると、エラーが出たフィールドだけが再レンダーされ、他は保護される。

- **`register()` の参照が安定している理由**
  RHF は入力値を `useRef` に保持しており、`register` が返す `onChange`/`onBlur`/`ref` の参照はマウント時に一度生成されたまま変わらない。これにより `memo` 化した子コンポーネントへの props が安定し、`useCallback` なしでも再レンダーを防げる。

### 3-2. Zod との連携（`@hookform/resolvers/zod`）

- **`z.infer<typeof schema>` で型とバリデーションを1ソースに統一**
  `type FormValues = z.infer<typeof registerSchema>` とすると、スキーマを変更するだけで型が自動追随する。`register("fieldName")` の `fieldName` もスキーマのキーと一致しないとコンパイルエラーになるため、フィールド名の打ち間違いをコンパイル時に検出できる。

- **スキーマレベルの `.refine()` で `mode: "onBlur"` + クロスフィールド問題を解消**
  `zodResolver` はバリデーション時にスキーマ全体を評価する。フィールドレベルの `validate` では `confirmPassword` のバリデーションは `confirmPassword` がblurされた時しか走らないが、Zod のスキーマレベル `.refine()` を使うと `password` がblurされた時も `confirmPassword` の一致チェックが走る。`trigger()` による手動再検証が不要になる。

- **チェーンした `.refine()` はシリアル実行（直列）**
  ```ts
  z.string()
    .refine((v) => /[A-Z]/.test(v), "大文字を含む")
    .refine((v) => /[a-z]/.test(v), "小文字を含む")
  ```
  最初の `.refine()` が失敗した時点でそれ以降は評価されず、エラーは1つだけ返る。複数エラーを同時に表示したい場合は `.superRefine()` を使う。

- **Zod v4 の `z.email()` ショートハンド**
  `z.string().email()` の代わりに `z.email()` と書けるのは Zod v4 の機能。既存の Zod v3 コードベースに混在させると動作しないため、バージョンを確認してから使う。

### 3-3. `useFormContext` / フォームの分割設計

- **`FormProvider` は `useForm()` の返り値をそのまま Context に格納する**
  `<FormProvider {...methods}>` の `...methods` スプレッドで `register`・`handleSubmit`・`control`・`formState` 等が Context に注入される。`useFormContext()` はそれを取り出すだけで、メソッドのコピーや再生成は行わない。参照の安定性は `useForm` を直接使う場合と変わらない。

- **ネストしたフィールド名のドット記法**
  `register("personal.firstName")` と書くと送信データが `{ personal: { firstName: "..." } }` のネスト構造になる。`FormValues` 型の構造と対応しているため TypeScript の補完と型チェックが効き、フィールド名の打ち間違いをコンパイル時に検出できる。

- **`pattern` バリデーションは部分一致に注意**
  RHF の `register` の `pattern` は内部で `RegExp.test()` を使うため、アンカーなしの正規表現は部分一致になる。
  ```ts
  // ❌ "abc123-4567xyz" も通る（部分一致）
  pattern: { value: /\d{3}-?\d{4}/ }
  // ✅ 完全一致
  pattern: { value: /^\d{3}-?\d{4}$/ }
  ```

- **フォームを分割するメリットは「関心の分離」**
  `PersonalSection` は個人情報に、`AddressSection` は住所にだけ関心を持つ。セクションごとに独立してテスト・修正でき、フォームが大きくなるほどこの恩恵が増す。

---

*フェーズを進めるたびに更新していく。*
