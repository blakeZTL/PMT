import * as React from "react";
import { AssignedSme, IAssignedSmeApiResult } from "../types/AssignedSme";
import { mockAssignedSmeData } from "../data/mockAssignedSme";
import { mockResourceRequest } from "../data/mockResourceRequest";
import { AssignedSmeService } from "../services/AssignedSmeService";
import { SmeLookup } from "./SmeLookup";
import { ControlProps } from "../types/ControlProps";
import { ResourceRequestService } from "../services/ResourceRequestService";
import {
  IResourceRequestApiResult,
  ResourceRequest,
} from "../types/ResourceRequest";

export interface IContainerProps {
  controlProps: ControlProps;
  onInputChange: (sme: ComponentFramework.LookupValue | undefined) => void;
}

export const Container = (props: IContainerProps) => {
  const { controlProps, onInputChange } = props;
  const {
    context,
    environment,
    selectedItem,
    resourceRequest,
    restrictToResourceRequest,
  } = controlProps;

  const [isLoading, setIsLoading] = React.useState(true);
  const [assignedSmes, setAssignedSmes] = React.useState<AssignedSme[]>([]);
  const [selectedSme, setSelectedSme] = React.useState<
    ComponentFramework.LookupValue | undefined
  >(selectedItem ?? undefined);
  const [resourceRequestRecord, setResourceRequestRecord] = React.useState<
    ResourceRequest | undefined
  >(undefined);
  console.debug("Container.ControlProps: ", controlProps);

  React.useEffect(() => {
    if (environment === "DEV") {
      console.debug("Using mock data");
      const smes = mockAssignedSmeData.value.map((item) => {
        return AssignedSme.fromJson(item as IAssignedSmeApiResult);
      });
      setAssignedSmes(smes);

      if (!selectedSme?.id && smes.length > 0 && isLoading) {
        console.debug("Setting selectedSme: ", smes[0]);
        setSelectedSme({
          id: smes[0].id,
          name: smes[0].email,
          entityType: "pmt_assignedsme",
        });
      }
      //if (restrictToResourceRequest) {
      const resourceRequest = ResourceRequest.fromJson(
        mockResourceRequest.value[0] as IResourceRequestApiResult
      );
      setResourceRequestRecord(resourceRequest);
      // const filteredSmes = smes.filter((sme) => {
      //   return resourceRequest.assignedSmes.some((assignedSme) => {
      //     return assignedSme.id === sme.id;
      //   });
      // });
      // setAssignedSmes(filteredSmes);
      //}
      setIsLoading(false);
    } else {
      const assignedSmeService = new AssignedSmeService(context);
      assignedSmeService
        .getAssignedSmes()
        .then((data) => {
          setAssignedSmes(data);
          setIsLoading(false);
          return;
        })
        .catch((error) => {
          console.error("Error fetching assigned smes: ", error);
          setIsLoading(false);
        });
      setSelectedSme(selectedItem);
      //restrictToResourceRequest &&
      if (resourceRequest?.id) {
        const resourceRequestService = new ResourceRequestService(context);
        resourceRequestService
          .getResourceRequest(resourceRequest?.id)
          .then((data) => {
            setResourceRequestRecord(data);
            // const filteredSmes = assignedSmes.filter((sme) => {
            //   return data.assignedSmes.some((assignedSme) => {
            //     return assignedSme.id === sme.id;
            //   });
            // });
            // setAssignedSmes(filteredSmes);
            return;
          })
          .catch((error) => {
            console.error("Error fetching resource request: ", error);
          });
      }
    }
  }, [selectedItem, environment, context, resourceRequest]);

  console.debug("Container.ResourceRequest: ", resourceRequestRecord);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <SmeLookup
      assignedSmes={assignedSmes}
      selectedItem={selectedSme}
      resourceRequest={resourceRequestRecord}
      filterSmes={restrictToResourceRequest}
      onInputChange={(sme) => {
        setSelectedSme(sme);
        onInputChange(sme);
      }}
    />
  );
};
