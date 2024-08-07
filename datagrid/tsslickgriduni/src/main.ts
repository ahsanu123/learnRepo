import { BasicSlickGrid } from "./component/basic";
import { SlickGridRowDetail } from "./component/row-detail";
import { CreateDiv } from "./util/createDiv";

CreateDiv("basicGrid")
CreateDiv("rowDetail")

const basic = new BasicSlickGrid();
const rowDetail = new SlickGridRowDetail()

basic.Begin()
rowDetail.Begin()
