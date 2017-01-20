import "jquery";
import toastr from "toastr";

toastr.options = {
  "closeButton": true,
  "showDuration": "300",
  "hideDuration": "2000",
  "timeOut": "2000",
  "extendedTimeOut": "1000",
};
const hToastr = toastr;

export default hToastr;