import {LangModel} from '../lang.model';
import {OptionalModel} from '../optional.model';

export class FormViewModel {
  cell?:	string;
  comments?:	string;
  css?:	string;
  formType?:	string;
  help?:	string;
  id?:	number;
  infos?:	string;
  keli?:	string;
  language?:	LangModel;
  onoma?:	string;
  optional?:	OptionalModel;
  sfunction?:	string;
  sorder?:	number;
  sprint?:	number;
  svalues?:	any;
  tableName?:	string;
  typos?:	string;
  upload?: string;
  value?: number;
}
