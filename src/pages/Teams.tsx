import { MainLayout } from "@/components/layout/MainLayout";

export default function Teams() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Équipes</h1>
          <p className="text-muted-foreground">Gérez vos équipes et leurs membres</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-muted-foreground">Page Équipes - En construction</p>
        </div>
      </div>
    </MainLayout>
  );
}
