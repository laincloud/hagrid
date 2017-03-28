import hToastr from "../components/HagridToastr";

export function outputErrorMsg(responseText) {
  let errStruct = JSON.parse(responseText);
  if (errStruct) {
    hToastr.error(errStruct["error"]);
  } else {
    hToastr.error("Unknown error");
  }
}