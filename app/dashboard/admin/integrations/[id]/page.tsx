import { IntegrationEditorView } from "@/features/admin/integrations/IntegrationEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <IntegrationEditorView id={id} />;
}
