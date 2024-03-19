import {
  Button,
  IconButton,
  InputBase,
  Paper,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  CircularProgress,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Save, Clear, Loop, CloudUpload } from "@mui/icons-material";

import "../assets/settings.css";
import readJsonFile from "../utils/readfile";
import { useState } from "react";
import getPages from "../utils/getPages";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

type SheetPage = { pageName: string; pageID: any };
interface ISettingsProps {
  onCancel: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Settings(props: ISettingsProps) {
  const [config, setConfig] = useState<string>(
    localStorage.getItem("credentials") || ""
  );

  const [sheetID, setSheetID] = useState<string>(
    localStorage.getItem("sheetID") || ""
  );
  const [isLoading, setLoading] = useState<boolean>(false);
  const [selectedPage, setSelectedPage] = useState<SheetPage>(
    JSON.parse(localStorage.getItem("pageName") || "{}")
  );
  const [pages, setPages] = useState<Array<SheetPage>>(
    JSON.parse(localStorage.getItem("cachedPages") || "[]")
  );
  function onLoadPages() {
    setLoading(true);
    getPages(config, sheetID)
      .then((p) => {
        console.log(p.length);
        setPages(p.pages as SheetPage[]);
        setLoading(false);
      })
      .catch((e) => {
        setPages([]);
        setLoading(false);
      });
  }
  function onSave() {
    localStorage.setItem("credentials", config);
    localStorage.setItem("sheetID", sheetID);
    localStorage.setItem("pageName", JSON.stringify(selectedPage));
    localStorage.setItem("cachedPages", JSON.stringify(pages));
    (onCancel as any)();
  }
  const { onCancel } = props;
  return (
    <div className="settings-container">
      <div className="app-row">
        <Typography
          variant="h3"
          sx={{ color: "#FFF", textAlign: "center", width: "100%" }}
        >
          Settings
        </Typography>
      </div>
      <div className="app-row">
        <Paper
          sx={{
            p: "0",
            paddingTop: "5px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: 2,
            position: "relative",
          }}
          elevation={5}
        >
          <InputBase
            id="creeds"
            placeholder="Credentials (.JSON)"
            aria-readonly="true"
            inputProps={{
              readOnly: true,
            }}
            multiline
            rows={4}
            sx={{ flex: 1 }}
            value={
              config ? JSON.stringify(JSON.parse(config), undefined, 2) : ""
            }
          ></InputBase>
          <div
            className="fileUploadContainer"
            style={{ position: "absolute", right: 20, top: 2 }}
          >
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUpload />}
            >
              Choose Config
              <VisuallyHiddenInput
                type="file"
                onChange={async (e) => {
                  const _config = await readJsonFile(
                    (e.target.files as FileList)[0]!
                  );
                  setConfig(_config ? JSON.stringify(_config) : "");
                }}
                accept=".json"
              />
            </Button>
          </div>
        </Paper>
      </div>
      <div className="app-row">
        <Paper
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: 2,
          }}
          elevation={5}
        >
          <InputBase
            id="SheetName"
            placeholder="Sheet ID"
            color="secondary"
            sx={{ flex: 1 }}
            fullWidth
            onChange={(e) => setSheetID(e.target.value)}
            defaultValue={sheetID}
          />
          {isLoading ? (
            <CircularProgress color="secondary" />
          ) : (
            <IconButton onClick={onLoadPages}>
              <Loop />
            </IconButton>
          )}
        </Paper>
      </div>
      <div className="app-row">
        <Paper
          sx={{
            p: "0",
            pt: 1,
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: 2,
          }}
          elevation={5}
        >
          <FormControl fullWidth>
            <InputLabel id="pageNameLabel">Page Name</InputLabel>
            <Select
              fullWidth
              labelId="pageNameLabel"
              id="pageName"
              label="Page Name"
              disabled={!config || !sheetID}
              sx={{ border: "none" }}
              variant="standard"
              onChange={(e) => {
                setSelectedPage(JSON.parse(e.target.value as any) as SheetPage);
              }}
              value={JSON.stringify(selectedPage)}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.pageID}
                  value={JSON.stringify(page)}
                  sx={{ textTransform: "capitalize" }}
                  selected={page.pageID === selectedPage.pageID}
                >
                  {page.pageName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </div>
      <div className="app-row" style={{ justifyContent: "center" }}>
        <Button variant="contained" color="primary" onClick={onSave}>
          <Save /> &nbsp; Save
        </Button>
        <Button variant="contained" color="secondary" onClick={onCancel}>
          <Clear /> &nbsp; Cancel
        </Button>
      </div>
    </div>
  );
}
