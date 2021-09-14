import {
  ISwitchItem,
} from 'react-declarative';

import ListPage from "../../pages/ListPage";
import OnePage from "../../pages/OnePage";

import sleep from '../../utils/sleep';

export const routes: ISwitchItem[] = [
  {
    path: '/:id',
    guard: async () => {
      await sleep(3_000);
      return true;
    },
    component: OnePage,
  },
  {
    path: '/',
    component: ListPage,
  },
];

export default routes;
