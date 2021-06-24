import {EssentialSizeOverallDtoModel} from './essential-size-overall-dto.model';
import {EssentialSizePerformanceDtoModel} from './essential-size-performance-dto.model';
import {StatusEnumModel} from '../../status-enum.model';
import {BaseDtoModel} from "./base-dto.model";

export interface EssentialSizeDtoModel{
  id: number;
  base: BaseDtoModel;
  documentationBase: string;
  overAmount: number;
  taxOverAmount: number;
  essentialSizeOverallDtoList: EssentialSizeOverallDtoModel[];
  essentialSizePerformanceDtoList: EssentialSizePerformanceDtoModel[];
  status: StatusEnumModel;
}
