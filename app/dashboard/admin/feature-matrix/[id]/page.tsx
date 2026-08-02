import { FeatureMatrixEditorView } from "@/features/admin/feature-matrix/FeatureMatrixEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FeatureMatrixEditorView id={id} />;
}
