import {RolesEnumModel} from './roles-enum.model';

// for Order Service
export interface ProjectResponseDtoModel {
  id?: number;
  assignmentControlHours?: number;  //
  customerAddress?: string;
  customerAfm?: string;
  customerId?: number;
  customerName?: string;
  orderId?: number;
  orderTypeComments?: string;
  orderTypeDescription?: string;
  recordDate?: Date;
  year?: string;
  roles?: RolesEnumModel;
  status?: string;
}
