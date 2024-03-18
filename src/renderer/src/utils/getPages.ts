import getData from "./getData";

export default async function getPages(credentials: string, sheetID: string) {
  try {
    const payload = await getData("api/getPages", {
      credentials,
      sheetID,
      pageName: "",
    });
    return Promise.resolve(payload);
  } catch (e: any) {
    console.error("Error", e.message);
  }
}
