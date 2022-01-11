import dotenv from 'dotenv';
import pgpMod from 'pg-promise';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error(`DATABASE_URL must be configured`);
}

export const pgp = pgpMod();
export const db = pgp(process.env.DATABASE_URL as string);

export function skipIfAbsent({ value }: { value: any }) {
  return value === undefined;
}

export interface PartialUpdateOptions {
  columns: pgpMod.ColumnSet;
  whereColumns: string[];
  data: object;
  updateModified?: boolean;
}

export function partialUpdate({
  columns,
  whereColumns,
  data,
  updateModified,
}: PartialUpdateOptions): string | null {
  let sets = [];

  for (let col of columns.columns) {
    if (col.cnd || col.skip?.call(data, col) || data[col.name] === undefined) {
      continue;
    }

    sets.push(`${col.escapedName}=$[${col.name}]`);
  }

  if (!sets.length) {
    return null;
  }

  if (updateModified) {
    sets.push('modified=now()');
  }

  let wheres = whereColumns.map((n) => `${pgpMod.as.name(n)}=$[${n}]`).join(' AND ');

  return `UPDATE ${columns.table.toString()} SET ${sets.join(', ')} WHERE ${wheres}`;
}
