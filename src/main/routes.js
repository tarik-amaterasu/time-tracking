import express from "express";
import { getPages, insertRecord, getPageRows } from "./sheets";

const router = express.Router();

router.post("/addRecord", async function (req, res) {
  const { date, startTime, endTime, durationInS, duration } = req.body;
  const { credentials, sheetID, pageName } = req;
  const payload = {
    date: date,
    startTime: new Date(startTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    endTime: new Date(endTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    durationInS: durationInS,
    duration: duration,
  };
  await insertRecord(payload, { credentials, sheetID, pageName });
  return res.send({
    success: true,
  });
});
router.get("/setView", (req, res) => {
  const { view } = req.query;
  switch (view) {
    case "expanded": {
      req.resizeWindow(true);
      break;
    }
    case "small": {
      req.resizeWindow(false);
      break;
    }
    default: {
      return res.send({ ok: false, message: `unknown view ${view}` });
    }
  }
  return res.send({ ok: true, message: "View Updated" });
});
router.get("/getPages", async (req, res) => {
  const { credentials, sheetID } = req;
  const pages = await getPages(credentials, sheetID);
  return res.send({
    pages,
    length: pages.length,
  });
});
router.get("/getRows", async (req, res) => {
  const { credentials, sheetID, pageName } = req;
  const rows = await getPageRows({ credentials, sheetID, pageName });
  return res.send({ rows, length: rows.length });
});
router.get("/exit", async (req, res) => {
  res.send({ code: 200 });
  return req.electronApp.exit();
});
router.get("/setBadge", async (req, res) => {
  req.electronApp.setBadgeCount("-");
  return res.send({ code: 200 });
});
router.get("/unsetBadge", async (req, res) => {
  req.electronApp.setBadgeCount(0);
  return res.send({ code: 200 });
});
export default router;
