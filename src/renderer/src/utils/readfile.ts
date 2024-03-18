export default function readJsonFile(
  fileName: Blob | null
): Promise<Record<string, any> | null> {
  if (!fileName) return Promise.resolve(null);
  return new Promise<any>((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", function (event) {
      const jsonData = JSON.parse((event.target?.result as string) || "null");
      if (jsonData) {
        console.log("JSON data: ", jsonData);
        return resolve(jsonData);
      }
      return resolve(null);
    });
    reader.readAsText(fileName as Blob);
  });
}
