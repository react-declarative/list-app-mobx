import {
  ISwitchItem,
} from 'react-declarative';

import ListPage from "../../pages/ListPage";
import OnePage from "../../pages/OnePage";

export const routes: ISwitchItem[] = [
  {
    path: '/:id',
    component: OnePage,
  },
  {
    path: '/',
    component: ListPage,
  },
];

export default routes;
