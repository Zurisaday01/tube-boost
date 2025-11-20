import { KBarResults, useMatches } from 'kbar';
import ResultItem from './result-item';

// https://www.npmjs.com/package/kbar/v/0.1.0-beta.45
export default function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div className='text-primary-foreground px-4 py-2 text-sm uppercase opacity-50'>
            {item}
          </div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId ?? ''}
          />
        )
      }
    />
  );
}
