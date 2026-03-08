# React Hook Form 学習ロードマップ

Next.js + TypeScript + Tailwind CSS 環境でRHFを体系的に学習するためのチェックリスト。
セクション単位で実装・確認しながら進める。

---

## フェーズ1：基礎固め

RHFの核心である「非制御コンポーネントベース」のアプローチを理解する。
`useForm`・`register`・`handleSubmit` の三点セットで基本的なフォームを作れるようになる。

### 1-1. `useForm` / `register` / `handleSubmit` の基本

**何を学ぶか：** RHFのエントリーポイント。`register` でinputをRHFに登録し、`handleSubmit` でバリデーション後の送信処理を定義する流れを掴む。

**実装ファイル：** `app/phase1/basic/page.tsx`

- [x] `useForm` でフォームインスタンスを生成できる
- [x] `register` をinputの `{...spread}` で適用できる
- [x] `handleSubmit` でフォームデータを受け取れる
- [x] 送信時にコンソールでデータが確認できる

---

### 1-2. `formState` とエラー表示

**何を学ぶか：** `formState.errors` を使ってバリデーションエラーをUIに反映する方法。`isSubmitting`・`isValid` などの状態も活用する。

**実装ファイル：** `app/phase1/form-state/page.tsx`

- [x] `formState.errors` でエラーメッセージを表示できる
- [x] `isSubmitting` でローディング状態を制御できる
- [x] `isValid` でサブミットボタンの活性/非活性を切り替えられる

---

### 1-3. ビルトインバリデーション（required, minLength, pattern等）

**何を学ぶか：** `register` の第2引数に渡せるバリデーションルール。外部ライブラリ不要でよく使う検証が実装できる。

**実装ファイル：** `app/phase1/builtin-validation/page.tsx`

- [x] `required`・`minLength`・`maxLength` を使える
- [x] `pattern` で正規表現バリデーションを実装できる
- [x] `validate` でカスタムバリデーション関数を書ける

---

## フェーズ2：実践力強化

UIライブラリやカスタムコンポーネントとの連携、動的フォームを扱えるようになる。

### 2-1. `Controller` と制御コンポーネント

**何を学ぶか：** RHFが直接管理できない制御コンポーネント（Select・DatePickerなど）をRHFに組み込む方法。`Controller` の `render` propパターンを理解する。

**実装ファイル：** `app/phase2/controller/page.tsx`

- [x] `Controller` の `control`・`name`・`render` を正しく設定できる
- [x] カスタムSelectコンポーネントをRHFと連携できる
- [x] `field.onChange`・`field.value` の役割を説明できる

---

### 2-2. `watch` / `setValue` / `getValues`

**何を学ぶか：** フォームの値をリアクティブに監視したり、プログラムから値を操作する方法。条件分岐UIに必須。

**実装ファイル：** `app/phase2/watch-setvalue/page.tsx`

- [x] `watch` で特定フィールドの変化をリアルタイム表示できる
- [x] `setValue` でボタンクリック時にフィールドを更新できる
- [x] `getValues` で現在の全フォーム値を取得できる

---

### 2-3. `useFieldArray`（動的フォーム）

**何を学ぶか：** フィールドの追加・削除・並び替えが可能な動的フォームの実装。Todoリストや商品明細行などの実装に直結。

**実装ファイル：** `app/phase2/field-array/page.tsx`

- [x] `useFieldArray` で配列フィールドを管理できる
- [x] `append`・`remove` で行の追加・削除ができる
- [x] 各行に独立したバリデーションを設定できる

---

## フェーズ3：深堀り

RHFが「なぜ速いのか」の内部機構と、Zodとの型安全な連携を理解する。

### 3-1. 非制御コンポーネントの仕組みと再レンダリング戦略

**何を学ぶか：** RHFがDOMを直接参照する理由と、React Stateを使わないことによる再レンダリング抑制の仕組み。`React.memo` との組み合わせ効果も確認する。

**実装ファイル：** `app/phase3/uncontrolled/page.tsx`

- [ ] `ref` ベースの値管理と State ベースの違いを説明できる
- [ ] React DevToolsで再レンダリング回数の差を確認できる
- [ ] `mode: 'onChange'` vs `mode: 'onBlur'` の挙動差を理解できる

---

### 3-2. Zodとの連携（`@hookform/resolvers/zod`）

**何を学ぶか：** Zodスキーマ定義からTypeScriptの型とバリデーションを同時に生成する方法。`zodResolver` を使ってRHFとZodを繋ぐ。

**実装ファイル：** `app/phase3/zod-resolver/page.tsx`

- [ ] Zodスキーマを定義してフォーム型を `z.infer` で生成できる
- [ ] `zodResolver` を `useForm` の `resolver` オプションに渡せる
- [ ] Zodのエラーメッセージが `formState.errors` に反映されることを確認できる
- [ ] `.refine()` でフィールド間の相関バリデーションを実装できる

---

### 3-3. `useFormContext` / フォームの分割設計

**何を学ぶか：** フォームを複数コンポーネントに分割する際、Context経由でフォームの状態を共有する方法。大規模フォームの設計に必須。

**実装ファイル：** `app/phase3/form-context/page.tsx`

- [ ] `FormProvider` でフォームコンテキストをラップできる
- [ ] 子コンポーネントで `useFormContext` を使って値にアクセスできる
- [ ] Props drilling なしでフォームを分割できる

---

## フェーズ4：応用パターン

実務レベルのフォーム設計パターンを身につける。

### 4-1. パフォーマンス最適化

**何を学ぶか：** `shouldUnregister`・`mode`・`reValidateMode` などのオプションがパフォーマンスに与える影響。大きなフォームで効いてくる最適化テクニック。

**実装ファイル：** `app/phase4/performance/page.tsx`

- [ ] `shouldUnregister: true` でアンマウント時に値を削除できる
- [ ] `mode` オプションの各値（onChange/onBlur/onSubmit/all）の違いを説明できる
- [ ] `useWatch` vs `watch` のパフォーマンス差を理解できる

---

### 4-2. マルチステップフォーム

**何を学ぶか：** 複数ステップに分割されたウィザード形式のフォーム実装。ステップ間でデータを保持しつつ、各ステップで独立したバリデーションを行う。

**実装ファイル：** `app/phase4/multi-step/page.tsx`

- [ ] ステップ間でフォームデータを保持できる
- [ ] 各ステップで部分的なバリデーションができる
- [ ] 最終ステップで全データをまとめて送信できる

---

## 進捗サマリー

| フェーズ | セクション数 | 完了 |
|----------|------------|------|
| フェーズ1：基礎固め | 3 | 3/3 ✅ |
| フェーズ2：実践力強化 | 3 | 3/3 ✅ |
| フェーズ3：深堀り | 3 | 0/3 |
| フェーズ4：応用パターン | 2 | 0/2 |

---

## 参考リソース

- [React Hook Form 公式ドキュメント](https://react-hook-form.com/)
- [Zod 公式ドキュメント](https://zod.dev/)
- [React Hook Form + Zod サンプル](https://react-hook-form.com/get-started#SchemaValidation)
