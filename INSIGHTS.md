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

*フェーズを進めるたびに更新していく。*
