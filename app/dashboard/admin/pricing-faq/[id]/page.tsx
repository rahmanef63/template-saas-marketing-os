import { PricingFaqEditorView } from "@/features/admin/pricing-faq/PricingFaqEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PricingFaqEditorView id={id} />;
}
