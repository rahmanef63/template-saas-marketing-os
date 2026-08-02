import { PricingMatrixEditorView } from "@/features/admin/pricing-matrix/PricingMatrixEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PricingMatrixEditorView id={id} />;
}
