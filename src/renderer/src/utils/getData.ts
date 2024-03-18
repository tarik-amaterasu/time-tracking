export default function getData(
  action: string,
  options: Record<string, any> = {}
) {
  const credentials =
    options.credentials || localStorage.getItem("credentials");
  const sheetID = options.sheetID || localStorage.getItem("sheetID");
  const pageName =
    options.pageName ||
    JSON.parse(localStorage.getItem("pageName") || "{}")?.pageID ||
    "";

  const fetchOptions = options.fetchOptions || {};
  return fetch(`http://localhost:8080/${action}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-sheet-id": sheetID,
      "x-credentials": credentials,
      "x-sheet-name": pageName,
    },
    ...fetchOptions,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  });
}
