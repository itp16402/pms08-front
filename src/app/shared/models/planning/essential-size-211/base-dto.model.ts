import {MaterialityBaseDtoListModel} from './materiality-base-dto-list.model';

export interface BaseDtoModel{
  id: number;
  materialityBaseDtoList: MaterialityBaseDtoListModel[];
  name: string;
}
