import { UseCaseEditorView } from "@/features/admin/use-cases/UseCaseEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UseCaseEditorView id={id} />;
}
