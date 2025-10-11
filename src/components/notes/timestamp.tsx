import { formatTimestampTime } from '@/lib/utils';
import { createReactBlockSpec } from '@blocknote/react';

const createTimestamp = (jumpTo: (time: number) => void) =>
  createReactBlockSpec(
    {
      type: 'timestamp',
      propSchema: {
        time: { default: 0 }
      },
      content: 'none'
    },
    {
      render: (props) => {
        const time = props.block.props.time;

        const formatted = formatTimestampTime(time);

        const handleClick = (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          if (jumpTo) jumpTo(time);
        };

        return (
          <div className='u-timestamp-selected w-full'>
            <span
              className=''
              onClick={handleClick}
              style={{
                color: 'var(--color-primary)',
                cursor: 'pointer',
                fontWeight: 'bold',
                textDecoration: 'underline'
              }}
            >
              {formatted}
            </span>
            <div className='bg-neutral-200 h-[2px] w-full'></div>
          </div>
        );
      }
    }
  );
export default createTimestamp;
