import {FormDtoModel} from './form-dto.model';

export interface StepDtoModel{
  checked: boolean;
  name: string;
  phase: number;
  sorder: number;
  forms: FormDtoModel[];
}
