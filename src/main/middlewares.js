export default function extractBasics(req, res, next) {
  try {
    const credentials = req.headers["x-credentials"] || "{}";
    const sheetID = req.headers["x-sheet-id"];
    const pageName = req.headers["x-sheet-name"];
    req.sheetID = sheetID;
    req.credentials = JSON.parse(credentials);
    req.pageName = pageName;
    next();
  } catch (exception) {
    return res.status(500).send({ message: exception.message });
  }
}
