import {BaseDtoModel} from "./base-dto.model";

export interface EssentialSizeOverallDtoModel {
  id: number;
  interimBaseAmount: number;
  maxLimit: number;
  minLimit: number;
  overAmount: number;
  percentage: number;
  base: BaseDtoModel;
}
