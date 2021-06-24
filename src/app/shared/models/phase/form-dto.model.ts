import {MemberNamesDtoModel} from './member-names-dto.model';

export interface FormDtoModel{
  checked: boolean;
  formName: string;
  id: string;
  members: MemberNamesDtoModel[];
}
