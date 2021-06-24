import {FormListDtoModel} from './form-list-dto.model';
import {UserDtoModel} from '../acceptance/member/user-dto.model';
import {StatusEnumModel} from '../status-enum.model';

export interface FormRoleDtoModel {
  formList: FormListDtoModel;
  memberRole: UserDtoModel;
  status: StatusEnumModel;
}
