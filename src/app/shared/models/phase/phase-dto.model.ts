import {StepDtoModel} from './step-dto.model';

export interface PhaseDtoModel {
  checked: boolean;
  name: string;
  phase: number;
  sorder: number;
  steps: StepDtoModel[];
}
