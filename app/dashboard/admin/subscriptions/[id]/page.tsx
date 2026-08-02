import { SubscriptionEditorView } from "@/features/admin/subscriptions/SubscriptionEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SubscriptionEditorView id={id} />;
}
