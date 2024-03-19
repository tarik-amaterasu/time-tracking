import { GoogleSpreadsheet } from "google-spreadsheet";
const { JWT } = require("google-auth-library");
export function getSheets() {}
export function getDataByPage() {}
export async function getPages(credentials, sheetID) {
  const document = createDocument(credentials, sheetID);
  await document.loadInfo();
  const pages = Object.entries(document.sheetsByTitle).map(([key, content]) => {
    return {
      pageName: key,
      pageID: content.sheetId,
    };
  });
  return Promise.resolve(pages);
}
export async function insertRecord(payload, config) {
  const { credentials, sheetID, pageName } = config;
  const { date, startTime, endTime, durationInS, duration } = payload;
  const document = createDocument(credentials, sheetID);
  await document.loadInfo();
  const sheetPage = document.sheetsById[+pageName];
  try {
    if (sheetPage.headerValues.length >= 0) {
      console.log("Headers Are set");
    }
  } catch (e) {
    sheetPage.setHeaderRow(
      [
        "Date",
        "Duration on App",
        "Starting Time",
        "Ending Time",
        "Duration Computed",
        "Duration in Seconds",
      ],
      0
    );
  }

  //   console.log(sheetPage);
  //   P = await sheetPage.loadHeaderRow();

  const rowsCount = (await sheetPage.getRows()).length + 2;
  await sheetPage.addRow(
    [
      date,
      duration,
      startTime,
      endTime,
      `=D${rowsCount} - C${rowsCount}`,
      durationInS,
    ],
    { raw: false, insert: true }
  );
  Promise.resolve(true);
}
export async function getPageRows(config) {
  const { credentials, sheetID, pageName } = config;
  const document = createDocument(credentials, sheetID);
  await document.loadInfo();
  const sheetPage = document.sheetsById[+pageName];
  const rows = (await sheetPage.getRows()).map((row, index) => {
    // const _row = row.toObject();
    const _row = row._rawData;
    return {
      id: index,
      date: _row[0], // _row["Date"],
      durationComputed: _row[4], // _row["Duration Computed"],
      durationInSeconds: +_row[5], // _row["Duration in Seconds"],
      durationOnApp: _row[1], // _row["Duration on App"],
      startTime: _row[2], // _row["Starting Time"],
      endingTime: _row[3], // _row["Ending Time"],
    };
  });

  return Promise.resolve(rows);
}

function createDocument(credentials, sheetID) {
  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const document = new GoogleSpreadsheet(sheetID, auth);
  return document;
}
