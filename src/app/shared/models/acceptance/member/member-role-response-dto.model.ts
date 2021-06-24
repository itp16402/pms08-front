import {RoleDtoModel} from '../../role-dto.model';

export class MemberRoleResponseDtoModel {
  fatherName?:	string;
  firstName?:	string;
  lastName?:	string;
  userId?:	number;
  projectId?: number;
  roles?: RoleDtoModel[];
}
