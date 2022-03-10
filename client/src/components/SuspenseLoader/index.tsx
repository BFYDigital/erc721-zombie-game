import { useEffect } from 'react';
import NProgress from 'nprogress';
import { OverlaySpinner } from '../ui';

const SuspenseLoader = () => {
  useEffect(() => {
    NProgress.start();
    return () => { NProgress.done(); }
  }, []);

  return (
    <OverlaySpinner show={true} />
  );
}

export default SuspenseLoader;
