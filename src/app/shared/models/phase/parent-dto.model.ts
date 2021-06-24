import {PhaseDtoModel} from './phase-dto.model';

export interface ParentDtoModel {
  checked:	boolean;
  name: string;
  phase:	number;
  phases: PhaseDtoModel[];
  sorder: number;
}
