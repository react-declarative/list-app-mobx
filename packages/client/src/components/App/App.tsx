import { Scaffold, Switch } from 'react-declarative';

import { inject, observer } from "mobx-react";
import compose from "compose-function";

import RouterService from '../../lib/base/RouterService';

import options from './options';
import routes from './routes';

interface IAppPrivate {
  routerService: RouterService;
}

export const App = ({
  routerService,
}: IAppPrivate) => {
  const handleMenuClick = () => {
    routerService.push('/');
  };
  return (
    <Scaffold onOptionClick={handleMenuClick} options={options}>
      <Switch
        Loading={() => <p>Checking permissions (mock)</p>}
        NotFound={() => <p>Not found(</p>}
        history={routerService}
        items={routes}
      />
    </Scaffold>
  );
};

export default compose(
  inject(({ routerService }) => ({ routerService })),
  observer,
)(App) as React.FC;
