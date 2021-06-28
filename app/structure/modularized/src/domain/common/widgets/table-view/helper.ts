import { TableColumn } from '@/types/table';
import { Field } from '@/types/metadata';

function resolveTableColumns(fields: Field[]): TableColumn[] {
  return fields.map(f => ({ prop: f.name, label: f.label, ...(f.config || {}) }));
}

export { resolveTableColumns };
