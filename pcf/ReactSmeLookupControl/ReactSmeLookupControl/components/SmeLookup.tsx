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
  const { assignedSmes, ...comboboxProps } = props;
  const comboId = useId("reactSmeLookupCombobox");
  const styles = useStyles();

  const [query, setQuery] = React.useState<string>("");
  const onOptionSelect: ComboboxProps["onOptionSelect"] = (e, data) => {
    setQuery(data.optionText ?? "");
  };

  const filteredOptions = assignedSmes.filter((sme) =>
    `${sme.fullName} ${sme.email} ${sme.facility.facilityId}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className={styles.root} id={comboId}>
      <Combobox
        {...comboboxProps}
        placeholder="---"
        clearable
        onOptionSelect={onOptionSelect}
        onChange={(ev) => setQuery(ev.target.value)}
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
