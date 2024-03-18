import { useEffect, useMemo, useState } from "react";
import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import "../assets/records.css";
import getData from "../utils/getData";
type SheetRecord = {
  id: string;
  date: string;
  durationComputed: string;
  durationInSeconds: number;
  durationOnApp: string;
  endingTime: string;
  startTime: string;
};
interface Columns {
  id: keyof SheetRecord;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: any) => string;
}
interface IRecordsProps {
  onGoBack: React.MouseEventHandler<HTMLButtonElement>;
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&": {
    transition: "all .5s",
  },
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.grey[200],
  },
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.grey[100],
  },
  "&:nth-of-type(even):hover,&:nth-of-type(odd):hover": {
    backgroundColor: theme.palette.action.active,
  },
  "&:nth-of-type(even):hover td,&:nth-of-type(odd):hover td": {
    color: "#FFF!important",
    fontWeight: "bold",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const columns: readonly Columns[] = [
  { id: "id", label: "#" },
  { id: "date", label: "Date", align: "center" },
  { id: "durationComputed", label: "Duration" },
  { id: "startTime", label: "Start Time" },
  { id: "endingTime", label: "End Time" },
];
export default function Records(props: IRecordsProps) {
  const [records, setRecords] = useState<Array<SheetRecord>>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalRecordedHours = useMemo(() => {
    const today = new Date().getMonth() + 1;
    console.log(totalRecords);
    const totalHours: [number, number, number] = records
      .filter((record) => +record.date.split("/")[0] === today)
      .reduce(
        (acc, record) => {
          const [hours, minutes, seconds] = record.durationOnApp.split(":");
          return [acc[0] + +hours, acc[1] + +minutes, acc[2] + +seconds];
        },
        [0, 0, 0]
      );
    function handleDisplayTotal([hours, minutes, seconds]: [
      number,
      number,
      number
    ]) {
      if (hours === 0 && minutes === 0 && seconds === 0) return "---";
      const _ = (n: number) => String(n).padStart(2, "0");
      const _seconds = seconds % 60;
      const _minutes = (Math.floor(seconds / 60) + minutes) % 60;
      const _hours =
        hours + Math.floor((Math.floor(seconds / 60) + minutes) / 60);
      return `${_(_hours)}:${_(_minutes)}:${_(_seconds)}`;
    }
    return handleDisplayTotal(totalHours);
  }, [records]);

  const handleChangePage = (event: unknown, newPage: number) => {
    event;
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const { onGoBack } = props;
  useEffect(() => {
    getData(`api/setView?view=expanded`);
    getData(`api/getRows`).then(({ rows, length }) => {
      setRecords(rows as SheetRecord[]);
      setTotalRecords(length);
    });
  }, []);
  return (
    <div className="records-container">
      <div className="app-row">
        <Typography
          variant="h6"
          sx={{ color: "#FFF", textAlign: "center", width: "100%" }}
        >
          Records
        </Typography>
      </div>
      <div className="app-row">
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 270 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead sx={{}}>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {records.length > 0 ? (
                  records
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <StyledTableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.id}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format ? column.format(value) : value}
                              </TableCell>
                            );
                          })}
                        </StyledTableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      <CircularProgress
                        color="secondary"
                        size={65}
                        thickness={1.8}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {records.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 100]}
              component="div"
              count={records.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Paper>
      </div>
      <div className="app-row">
        <Paper
          elevation={1}
          sx={{
            width: "100%",
            p: `8px 15px`,
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
          }}
        >
          <Button variant="contained" color="secondary" onClick={onGoBack}>
            <ArrowBack /> &nbsp; Back
          </Button>
          <Typography variant="body2" align="left" sx={{ flex: 1 }}>
            Total Recorded Hours in{" "}
            {new Date().toLocaleString("default", { month: "long" })}:
          </Typography>
          <Typography variant="body1" align="center">
            {totalRecordedHours}
          </Typography>
        </Paper>
      </div>
    </div>
  );
}
