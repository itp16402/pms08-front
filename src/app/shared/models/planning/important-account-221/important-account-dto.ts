import {ImportantAccountAddDtoListModel} from './important-account-add-dto-list.model';
import {StatusEnumModel} from '../../status-enum.model';

export interface ImportantAccountDto{
  id?: number;
  perAmount?: number;
  importantAccountAddDtoList: ImportantAccountAddDtoListModel[];
  status?: StatusEnumModel;
}
