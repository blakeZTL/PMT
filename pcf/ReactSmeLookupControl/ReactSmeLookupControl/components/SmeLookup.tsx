import * as React from "react";

import {
  Combobox,
  makeStyles,
  Option,
  useId,
} from "@fluentui/react-components";
import type { ComboboxProps } from "@fluentui/react-components";

import { AssignedSme } from "../types/AssignedSme";

export interface SmeLookupProps extends ComboboxProps {
  assignedSmes: AssignedSme[];
  selectedItem: ComponentFramework.LookupValue | null;
  onInputChange: (sme: ComponentFramework.LookupValue | null) => void;
}

const useStyles = makeStyles({
  root: {
    // Stack the label above the field with a gap
    display: "grid",
    gridTemplateRows: "repeat(1fr)",
    justifyItems: "start",
    gap: "2px",
    maxWidth: "400px",
  },
});

export const SmeLookup = (props: SmeLookupProps) => {
  const { assignedSmes, selectedItem, ...comboboxProps } = props;
  const comboId = useId("reactSmeLookupCombobox");
  const styles = useStyles();

  const [query, setQuery] = React.useState<string>("");

  React.useEffect(() => {
    if (selectedItem) {
      const selectedSme = assignedSmes.find(
        (sme) => sme.id === selectedItem.id
      );
      if (selectedSme) {
        setQuery(
          `[${selectedSme.facility.facilityId}] ${selectedSme.fullName} (${selectedSme.email})`
        );
      }
    }
  }, [selectedItem, assignedSmes]);

  const onOptionSelect: ComboboxProps["onOptionSelect"] = (e, data) => {
    setQuery(data.optionText ?? "");
    const selectedSme = assignedSmes.find((sme) => sme.id === data.optionValue);
    const lookupValue = {
      id: selectedSme?.id,
      name: selectedSme?.email,
      entityType: "pmt_assignedsme",
    } as ComponentFramework.LookupValue;
    props.onInputChange(lookupValue);
  };

  const filteredOptions = assignedSmes.filter((sme) =>
    `${sme.fullName} ${sme.email} ${sme.facility.facilityId}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  console.debug("SmeLookup.selectedItem", selectedItem);

  return (
    <div className={styles.root} id={comboId}>
      <Combobox
        {...comboboxProps}
        placeholder="---"
        clearable
        onOptionSelect={onOptionSelect}
        onChange={(ev) => setQuery(ev.target.value)}
        defaultSelectedOptions={
          selectedItem?.id ? [selectedItem.id] : undefined
        }
        value={query}
      >
        {filteredOptions.map((sme) => (
          <Option
            key={sme.id}
            value={sme.id}
            text={`[${sme.facility.facilityId}] ${sme.fullName} (${sme.email})`}
          >
            <div>
              <div>{`${sme.fullName} (${sme.email})`}</div>
              <div>{`${sme.facility.facilityId}`}</div>
            </div>
          </Option>
        ))}
      </Combobox>
    </div>
  );
};
