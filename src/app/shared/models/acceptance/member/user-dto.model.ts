export interface UserDtoModel {
  id?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  email?: string;
  active?: boolean;
  authorities?: string;
}
