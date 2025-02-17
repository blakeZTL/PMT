import * as React from "react";
import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { AssignedSme } from "../types/AssignedSme";
import { ISmeRequestApiResult, SmeRequest } from "../types/SmeRequest";
import { ControlProps } from "../types/ControlProps";
import { SmeRequestService } from "../services/SmeRequestService";
import { mockSmeRequest } from "../data/mockSmeRequest";

import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
} from "@fluentui/react-components";

export interface IOverlappingRequestsProps {
  assignedSme: AssignedSme;
  smeRequestId: string;
  controlProps: ControlProps;
}
export interface IOverlappingSmeRequest {
  smeRequest: SmeRequest;
  date: string;
  hours: number;
}
const useStyles = makeStyles({
  root: {
    backgroundColor: "transparent",
    width: "100%",
    padding: "10px",
    marginTop: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  headerCell: {
    backgroundColor: "#f3f2f1",
    fontWeight: "bold",
    padding: "10px",
    borderBottom: "2px solid #e1dfdd",
    paddingLeft: "10px",
  },
  bodyCell: {
    textAlign: "left",
    paddingLeft: "10px",
    borderBottom: "1px solid #e1dfdd",
  },
  row: {
    "&:nth-child(even)": {
      backgroundColor: "#faf9f8",
    },
  },
  autoId: {
    color: "#0f6cbd",
    cursor: "pointer",
  },
  tableTitle: {
    fontSize: "14px",
    fontWeight: "semibold",
    marginBottom: "3px",
  },
  tableSubTitle: {
    fontSize: "10px",
    marginBottom: "10px",
    color: "#6d6c6b",
    paddingLeft: "10px",
    paddingRight: "10px",
  },
});

export const OverlappingRequests = (props: IOverlappingRequestsProps) => {
  const { assignedSme, controlProps, smeRequestId } = props;
  const { context } = controlProps;
  if (!smeRequestId) {
    console.error("OverlappingRequests.smeRequestId is required");
    return null;
  }
  console.debug("OverlappingRequests.assignedSme: ", assignedSme);
  console.debug("OverlappingRequests.smeRequestId: ", smeRequestId);
  const styles = useStyles();

  const columns = [
    {
      key: "smeRequest",
      name: "SME Request",
      fieldName: "smeRequest",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "program",
      name: "Program Name",
      fieldName: "program",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "date",
      name: "Date",
      fieldName: "date",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "hours",
      name: "Hours",
      fieldName: "hours",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
  ];

  const [overlappingRequests, setOverlappingRequests] = React.useState<
    IOverlappingSmeRequest[]
  >([]);

  React.useEffect(() => {
    const requests: { smeRequest: SmeRequest; date: string; hours: number }[] =
      [];
    const currentSmeRequest = assignedSme.smeRequests.find(
      (smeRequest) => smeRequest.pmt_smerequestid === smeRequestId
    );
    console.debug("OverlappingRequests.currentSmeRequest: ", currentSmeRequest);
    const otherSmeRequests = assignedSme.smeRequests.filter(
      (smeRequest) => smeRequest.pmt_smerequestid !== smeRequestId
    );
    console.debug("OverlappingRequests.otherSmeRequests: ", otherSmeRequests);
    currentSmeRequest?.pmt_smehour_Request_pmt_smerequest?.forEach((hour) => {
      const date = hour.pmt_date;
      otherSmeRequests?.forEach((otherSmeRequest) => {
        otherSmeRequest.pmt_smehour_Request_pmt_smerequest?.forEach(
          (otherHour) => {
            if (otherHour.pmt_date === date) {
              requests.push({
                smeRequest: new SmeRequest(
                  otherSmeRequest.pmt_smerequestid,
                  otherSmeRequest.pmt_autoid
                ),
                date,
                hours: otherHour.pmt_hours,
              });
            }
          }
        );
      });
    });
    if (controlProps.environment === "DEV") {
      console.debug("OverlappingRequests: Using mock data");
      const smeRequestData = mockSmeRequest;
      console.debug("OverlappingRequests.requests: ", requests);
      requests.forEach((request) => {
        const smeRequest = smeRequestData.value.find(
          (item) => item.pmt_smerequestid === request.smeRequest.id
        );
        if (smeRequest) {
          const smeRequestFromJson = SmeRequest.fromJson(
            smeRequest as unknown as ISmeRequestApiResult
          );
          const overlappingSmeRequest = {
            smeRequest: smeRequestFromJson,
            date: request.date,
            hours: request.hours,
          };
          setOverlappingRequests((prev) => [...prev, overlappingSmeRequest]);
        }
      });
    } else {
      const smeRequestService = new SmeRequestService(context);
      requests.forEach((request) => {
        smeRequestService
          .getSmeRequest(request.smeRequest.id)
          .then((smeRequest) => {
            const overlappingSmeRequest = {
              smeRequest,
              date: request.date,
              hours: request.hours,
            };
            setOverlappingRequests((prev) => [...prev, overlappingSmeRequest]);
            return;
          })
          .catch((error) => {
            console.error("Error getting smeRequest: ", error);
          });
      });
    }
  }, [assignedSme, context, smeRequestId, controlProps]);

  console.debug(
    "OverlappingRequests.overlappingRequests: ",
    overlappingRequests
  );

  const goToSmeRequest = (smeRequestId: string) => {
    console.debug("OverlappingRequests.goToSmeRequest: ", smeRequestId);
    context.navigation
      .openForm({
        entityName: "pmt_smerequest",
        entityId: smeRequestId,
        openInNewWindow: true,
      })
      .then((success) => {
        return;
      })
      .catch((error) => {
        console.error("Error opening form: ", error);
      });
  };

  return overlappingRequests.length > 0 ? (
    <div className={styles.root}>
      <div className={styles.tableTitle}>Overlapping Requests</div>
      <div className={styles.tableSubTitle}>
        There are overlapping SME requests for the selected SME. Detailed below
        is a link to the SME Request along with the associated Program Name,
        Date and amount of Hours alloted for the day.
      </div>
      <Table
        arial-label="Overlapping Requests"
        size="small"
        className={styles.table}
      >
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell key={column.key} className={styles.headerCell}>
                {column.name}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {overlappingRequests.map((request) => {
            return (
              <TableRow key={request.smeRequest.id} className={styles.row}>
                <TableCell
                  className={mergeClasses(styles.bodyCell, styles.autoId)}
                  onClick={() => goToSmeRequest(request.smeRequest.id)}
                  style={{ textDecoration: "underline" }}
                >
                  {request.smeRequest.autoId}
                </TableCell>
                <TableCell className={styles.bodyCell}>
                  {request.smeRequest.request?.program.name}
                </TableCell>
                <TableCell className={styles.bodyCell}>
                  {new Date(request.date).toISOString().split("T")[0]}
                </TableCell>
                <TableCell className={styles.bodyCell}>
                  {request.hours}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  ) : null;
};
