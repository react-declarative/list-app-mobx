import { useEffect } from "react";
import { useConfirm } from "react-declarative";

import ioc from "../lib/ioc";

type Data = Record<string, unknown> | null;

export const useRouterBlock = <T = Data>(data: T) => {
  const pickConfirm = useConfirm({
    title: 'Continue?',
    msg: 'The form contains unsaved changes. Continue?',
  });
  useEffect(() => {
    const unsubscribe = ioc.routerService.block(({ retry }) => {
      const moveon = () => {
        unsubscribe();
        retry();
      };
      if (!!data) {
        pickConfirm().then((result) => result && moveon());
      } else {
        moveon();
      }
    });
    return () => unsubscribe();
  }, [data]);
};

export default useRouterBlock;
