import * as React from "react";
import { makeStyles } from "@fluentui/react-components";
import { AssignedSme } from "../types/AssignedSme";
import { ISmeRequestApiResult, SmeRequest } from "../types/SmeRequest";
import { ControlProps } from "../types/ControlProps";
import { SmeRequestService } from "../services/SmeRequestService";
import { mockSmeRequest } from "../data/mockSmeRequest";

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
export const useStyles = makeStyles({
  root: {
    backgroundColor: "transparent",
    width: "100%",
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
  return overlappingRequests.length > 0 ? (
    <div className={styles.root}>
      <h3>Overlapping Requests</h3>
      {overlappingRequests.length > 0 ? (
        <ul>
          {overlappingRequests.map((request) => {
            return (
              <li key={request.smeRequest.id}>
                {request.smeRequest.autoId}
                {request.smeRequest.request?.program.name}
                {request.date}
                {request.hours}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No overlapping requests</p>
      )}
    </div>
  ) : null;
};
