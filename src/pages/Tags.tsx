import { MainLayout } from "@/components/layout/MainLayout";

export default function Tags() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Tags</h1>
          <p className="text-muted-foreground">Gérez vos tags et règles d'auto-tagging</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-muted-foreground">Page Tags - En construction</p>
        </div>
      </div>
    </MainLayout>
  );
}
