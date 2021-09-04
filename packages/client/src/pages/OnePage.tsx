import { useState, useEffect } from 'react';

import { inject, observer } from "mobx-react";
import compose from "compose-function";

import {
  OneTyped,
  FieldType,
  TypedField,
  Breadcrumbs,
  useConfirm,
} from 'react-declarative';

import { useSnackbar } from 'notistack';

import IPerson from '../model/IPerson';

import { uuid } from 'uuidv4';

import PersonService from '../lib/PersonService';
import RouterService from '../lib/base/RouterService';

import useRouterBlock from '../hooks/useRouterBlock';

const fields: TypedField<IPerson>[] = [
  {
    type: FieldType.Line,
    title: 'System fields',
  },
  {
    name: 'id',
    type: FieldType.Text,
    title: 'Id',
    readonly: true,
    description: 'Readonly',
    defaultValue: uuid(),
  },
  {
    type: FieldType.Line,
    title: 'Profile data',
  },
  {
    name: 'firstName',
    type: FieldType.Text,
    title: 'First name',
    isInvalid({
      firstName,
    }) {
      if (!/\b([A-Za-z]{3,20}$)+/gm.test(firstName)) {
        return "It should contain letters, from 3 to 20 symbols. Not empty";
      } else {
        return null;
      }
    },
    description: 'Required',
  },
  {
    name: 'lastName',
    type: FieldType.Text,
    title: 'Last name',
    isInvalid({
      lastName,
    }) {
      if (!/\b([A-Za-z]{3,20}$)+/gm.test(lastName)) {
        return "It should contain letters, from 3 to 20 symbols";
      } else {
        return null;
      }
    },
    description: 'Required',
  },
  {
    name: 'age',
    type: FieldType.Text,
    title: 'Age',
    isInvalid({
      age,
    }) {
      if (!/[0-9]+/gm.test(age)) {
        return "It should contain numbers";
      } else {
        return null;
      }
    },
    description: 'Required',
  },
];

interface IOnePageProps {
  id: string;
}

interface IOnePagePrivate {
  personService: PersonService;
  routerService: RouterService;
}

export const OnePage = ({
  personService,
  routerService,
  id,
}: IOnePageProps & IOnePagePrivate) => {

  const [ data, setData ] = useState<IPerson | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useRouterBlock<IPerson | null>(data);

  const handleSave = async () => {
    if (data) {
      try {
        if (id === 'create') {
          await personService.create(data);
          routerService.push(`/${data.id}`);
        } else {
          await personService.save(data);
        }
        enqueueSnackbar('Saved');
        setData(null);
      } catch {
        enqueueSnackbar('Error acquired');
      }
    }
  };

  const handleChange = (data: IPerson, initial: boolean) => {
    if (!initial) {
      setData(data);
    }
  };

  const handleBack = () => {
    routerService.push(`/`);
  };

  const handler = () => personService.one(id);

  return (
    <>
      <Breadcrumbs
        disabled={!data}
        onSave={handleSave}
        onBack={handleBack}
      />
      <OneTyped<IPerson>
        fields={fields}
        handler={handler}
        fallback={personService.fallback}
        change={handleChange}
      />
    </>
  );
};

export default compose(
  inject(({ personService, routerService }) => ({ personService, routerService })),
  observer,
)(OnePage) as React.FC<IOnePageProps>;
