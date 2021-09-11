import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

type Props = {
  id: string;
};

const svgBaseUrl = new URL('/images/icons/bundle.svg', location.href);

export const Icon: FunctionComponent<Props> = ({ id }) => {
  const url = useMemo(() => {
    const _url = new URL(svgBaseUrl.href);
    _url.hash = id;

    return _url.href;
  }, [id]);

  return (
    <svg>
      <use href={url} />
    </svg>
  );
};
