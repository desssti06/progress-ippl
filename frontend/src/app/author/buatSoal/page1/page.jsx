import { Suspense } from 'react';
import MembuatSoalClient from './MembuatSoalClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MembuatSoalClient />
    </Suspense>
  );
}