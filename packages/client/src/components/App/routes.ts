import {
  ISwitchItem,
} from 'react-declarative';

import HomePage from '../../pages/HomePage';
import ListPage from "../../pages/ListPage";
import OnePage from "../../pages/OnePage";

import sleep from '../../utils/sleep';

export const routes: ISwitchItem[] = [
  {
    path: '/some-list/:id',
    guard: async () => {
      await sleep(3_000);
      return true;
    },
    component: OnePage,
  },
  {
    path: '/some-list',
    component: ListPage,
  },
  {
    path: '/',
    component: HomePage,
  },
];

export default routes;
