import * as React from "react";
import { IInputs } from "../generated/ManifestTypes";
import { AssignedSme, IAssignedSmeApiResult } from "../types/AssignedSme";
import { mockAssignedSmeData } from "../data/mockAssignedSme";
import { AssignedSmeService } from "../services/AssignedSmeService";
import { SmeLookup } from "./SmeLookup";

export interface IContainerProps {
  context: ComponentFramework.Context<IInputs>;
  environment: string;
  selectedItem: ComponentFramework.LookupValue | null;
  onInputChange: (sme: ComponentFramework.LookupValue | null) => void;
}

export const Container = (props: IContainerProps) => {
  const { context, environment, selectedItem, onInputChange } = props;

  const [isLoading, setIsLoading] = React.useState(true);
  const [assignedSmes, setAssignedSmes] = React.useState<AssignedSme[]>([]);
  const [selectedSme, setSelectedSme] =
    React.useState<ComponentFramework.LookupValue | null>(selectedItem ?? null);

  React.useEffect(() => {
    if (environment === "DEV") {
      console.debug("Using mock data for assigned smes");
      const smes = mockAssignedSmeData.value.map((item) => {
        return AssignedSme.fromJson(item as IAssignedSmeApiResult);
      });
      setAssignedSmes(smes);

      if (!selectedItem?.id && smes.length > 0 && isLoading) {
        console.debug("Setting selectedSme: ", smes[0]);
        setSelectedSme({
          id: smes[0].id,
          name: smes[0].email,
          entityType: "pmt_assignedsme",
        });
      }
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
    }
  }, [selectedItem, environment, context]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <SmeLookup
      assignedSmes={assignedSmes}
      selectedItem={selectedSme}
      onInputChange={(sme) => {
        setSelectedSme(sme);
        onInputChange(sme);
      }}
    />
  );
};
