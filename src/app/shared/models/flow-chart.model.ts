import {FlowChartChildModel} from './flow-chart-child.model';

export interface FlowChartModel {
  id: number;
  phase?: number;
  name?: string;
  formName?: string;
  formType?: string;
  sorder?: number;
  css?: string;
  type?: string;
  icon?: string;
  language?: string;
  state?: string;
  children: FlowChartChildModel[];
}
