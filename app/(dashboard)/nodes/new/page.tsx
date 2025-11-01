import { PageHeader } from '@/components/layout/page-header';
import { NodeForm } from '@/components/nodes/node-form';

export const dynamic = 'force-dynamic';

export default function NewNodePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Node"
        description="Configure a new node to start monitoring"
      />

      <div className="max-w-2xl">
        <NodeForm />
      </div>
    </div>
  );
}
