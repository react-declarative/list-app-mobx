import { useRef } from 'react';

import { inject, observer } from "mobx-react";
import compose from "compose-function";

import {
  ListTyped,
  FieldType,
  TypedField,
  SelectionMode,
  IColumn,
  IListApi,
  IListAction,
  ActionType,
  ColumnType,
} from 'react-declarative';

import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';

import IPerson from '../model/IPerson';

import PersonService from '../lib/PersonService';
import RouterService from '../lib/base/RouterService';

const filters: TypedField[] = [
  {
    type: FieldType.Text,
    name: 'firstName',
    title: 'First name',
  },
  {
    type: FieldType.Text,
    name: 'lastName',
    title: 'Last name',
  }
];

const columns: IColumn[] = [
  {
    type: ColumnType.Text,
    field: 'id',
    headerName: 'ID',
    width: 'max(calc(100vw - 650px), 200px)',
  },
  {
    type: ColumnType.Text,
    field: 'firstName',
    headerName: 'First name',
    width: '200px',
  },
  {
    type: ColumnType.Text,
    field: 'lastName',
    headerName: 'Last name',
    width: '200px',
  },
  {
    type: ColumnType.Action,
    headerName: 'Actions',
    sortable: false,
    width: '150px',
  },
];

const actions: IListAction[] = [
  {
    type: ActionType.Add,
  },
  {
    type: ActionType.Menu,
    options: [
      {
        label: 'Create new person',
        icon: Add,
      }
    ]
  },
];

const rowActions = [
  {
    label: 'Remove person',
    action: 'remove-action',
    icon: Delete,
  },
];

interface IFilterData {
  firstName: string;
  lastName: string;
}

const heightRequest = () => window.innerHeight - 100;
const widthRequest = () => window.innerWidth - 20;

interface IListPageProps {
}

interface IListPagePrivate {
  personService: PersonService;
  routerService: RouterService;
}

export const ListPage = ({
  personService,
  routerService,
}: IListPageProps & IListPagePrivate) => {

  const apiRef = useRef<IListApi>(null);

  const handleRemove = async (person: IPerson) => {
    await personService.remove(person);
    await apiRef.current?.reload();
  };

  const handleClick = (person: IPerson) => {
    routerService.push(`/${person.id}`);
  };

  const handleCreate = () => {
    routerService.push(`/create`);
  };

  return (
    <ListTyped<IFilterData, IPerson>
      ref={apiRef}
      title="List Component"
      filterLabel="Filters"
      selectionMode={SelectionMode.Multiple}
      heightRequest={heightRequest}
      widthRequest={widthRequest}
      rowActions={rowActions}
      actions={actions}
      filters={filters}
      columns={columns}
      handler={personService.list}
      fallback={personService.fallback}
      onRowAction={handleRemove}
      onRowClick={handleClick}
      onAction={handleCreate}
      sizeByParent={false}
    />
  );
};

export default compose(
  inject(({ personService, routerService }) => ({ personService, routerService })),
  observer,
)(ListPage) as React.FC<IListPageProps>;
