import { makeObservable } from "mobx";
import { action, observable } from "mobx";

import {
  ListHandlerPagination,
  ListHandlerSortModel,
} from "react-declarative";

import IPerson from "../model/IPerson";

import ApiService from "./base/ApiService";
import RouterService from "./base/RouterService";

import { CC_ERROR } from "../config";

export class PersonService {

  constructor(
    public apiService: ApiService,
    public routerService: RouterService,
  ) {
    makeObservable(this, {
      list: action.bound,
      remove: action.bound,
      fallback: action.bound,
      one: action.bound,
      save: action.bound,
      create: action.bound,
      apiService: observable,
      routerService: observable,
    });
  }

  async list(
    filters: Record<string, unknown>,
    pagination: ListHandlerPagination,
    sort: ListHandlerSortModel
  ) {  
    let rows = await this.apiService.get<IPerson[]>(`crud`, {
      filters,
      pagination,
      sort,
    });
    const { length: total } = rows;
    rows = rows.slice(pagination.offset, pagination.limit + pagination.offset);
    return {
      rows,
      total,
    };
  };

  one(id: string): Promise<IPerson | null> {
    if (id === 'create') {
      return Promise.resolve(null);
    } else {
      return this.apiService.get<IPerson>(`crud/${id}`);
    }
  };

  save(person: IPerson) {
    return this.apiService.put(`crud/${person.id}`, person);
  }

  create(person: IPerson) {
    return this.apiService.post(`crud`, person);
  }

  async remove(person: IPerson) {
    await this.apiService.delete(`crud/${person.id}`);
  };

  fallback(e: Error) {
    this.routerService.push(CC_ERROR);
    console.warn(e);
  }

};

export default PersonService;
