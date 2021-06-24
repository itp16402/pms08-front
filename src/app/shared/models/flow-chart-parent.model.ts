import {FlowChartModel} from './flow-chart.model';

export class FlowChartParentModel {
  id?: number;
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
  flowcharts?: FlowChartModel[];
}
