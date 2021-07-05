export interface UserDtoModel {
  id?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  email?: any;
  active?: boolean;
  authorities?: string;
}
