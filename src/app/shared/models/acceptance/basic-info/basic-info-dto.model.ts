import {StatusEnumModel} from '../../status-enum.model';

export interface BasicInfoDtoModel {
  id?: number;
  acceptance?: string;
  agreementDate?: string;
  appointmentDate?: string;
  archivingDate?: string;
  balanceSheetType?: number;
  branch?: string;
  consecutiveYears?: number;
  endDate?: string;
  financialStatementsDate?: string;
  folderCopy?: number;
  formType?: number;
  hours?: number;
  isAuditTax?: number;
  letterDate?: string;
  reportDate?: string;
  startDate?: string;
  turnover?: number;
  status?: StatusEnumModel;
}
