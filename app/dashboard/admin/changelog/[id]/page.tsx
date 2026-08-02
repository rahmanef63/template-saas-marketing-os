import { ChangelogEditorView } from "@/features/admin/changelog/ChangelogEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ChangelogEditorView id={id} />;
}
