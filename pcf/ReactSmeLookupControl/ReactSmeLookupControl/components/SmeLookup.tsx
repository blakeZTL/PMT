import * as React from "react";

import {
  Combobox,
  makeStyles,
  Option,
  OptionGroup,
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
    display: "grid",
    gridTemplateRows: "repeat(1fr)",
    justifyItems: "start",
    gap: "2px",
    backgroundColor: "rgb(245,245,245)",
    width: "100%",
  },
  optionDiv: {
    marginLeft: "3px",
    marginTop: "5px",
    marginBottom: "5px",
    marginRight: "3px",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "rgb(245,245,245)",
    },
  },
  listboxDiv: {
    backgroundColor: "white",
  },
  optionName: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  optionFacility: {
    color: "gray",
    fontSize: "12px",
  },
  combobox: {
    width: "100%",
    paddingLeft: "10px",
  },
  card: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ebf3fc",
    marginTop: "5px",
    marginBottom: "5px",
    marginLeft: "10px",
    borderRadius: "5px",
  },
  cardText: {
    color: "#0f6cbd",
    textDecoration: "underline",
    paddingTop: "3px",
    paddingLeft: "5px",
    paddingBottom: "3px",
    paddingRight: "5px",
    cursor: "pointer",
  },
  expandIcon: {
    width: "20px",
  },
});

export const SmeLookup = (props: SmeLookupProps) => {
  const { assignedSmes, selectedItem, ...comboboxProps } = props;
  const comboId = useId("reactSmeLookupCombobox");
  const styles = useStyles();

  const [query, setQuery] = React.useState<string>("");
  const [value, setValue] = React.useState<string>("");
  const [openSearch, setOpenSearch] = React.useState(false);

  const groups = assignedSmes.map((sme) => sme.facility.facilityId);
  const groupOptions = [...new Set(groups)].sort();

  React.useEffect(() => {
    if (selectedItem) {
      const selectedSme = assignedSmes.find(
        (sme) => sme.id === selectedItem.id
      );
      if (selectedSme) {
        setValue(
          `[${selectedSme.facility.facilityId}] ${selectedSme.fullName} (${selectedSme.email})`
        );
      }
    }
  }, [selectedItem, assignedSmes]);

  const onOptionSelect: ComboboxProps["onOptionSelect"] = (e, data) => {
    setOpenSearch(false);
    setQuery("");
    setValue(data.optionText ?? "");
    const selectedSme = assignedSmes.find((sme) => sme.id === data.optionValue);
    const lookupValue = {
      id: selectedSme?.id,
      name: selectedSme?.email,
      entityType: "pmt_assignedsme",
    } as ComponentFramework.LookupValue;
    props.onInputChange(lookupValue);
  };

  const filteredOptions = assignedSmes
    .filter(
      (sme) =>
        `${sme.fullName} ${sme.email} ${sme.facility.facilityId}`
          .toLowerCase()
          .includes(query.toLowerCase()) && sme.id !== selectedItem?.id
    )
    .sort((a, b) => a.fullName.localeCompare(b.fullName));

  const onClear = () => {
    setQuery("");
    setValue("");
    props.onInputChange(null);
  };

  console.debug("SmeLookup.selectedItem", selectedItem);
  return (
    <div className={styles.root} id={comboId}>
      {value ? (
        <div className={styles.card}>
          <div className={styles.cardText} onClick={onClear}>
            {value} <span className="symbolFont Cancel-symbol"></span>
          </div>
        </div>
      ) : (
        <Combobox
          {...comboboxProps}
          placeholder="---"
          clearable
          appearance="underline"
          onOptionSelect={onOptionSelect}
          onChange={(ev) => {
            setQuery(ev.target.value);
          }}
          defaultSelectedOptions={
            selectedItem?.id ? [selectedItem.id] : undefined
          }
          value={value ? value : query}
          className={styles.combobox}
          expandIcon={
            <span
              className={`symbolFont SearchButton-symbol ${styles.expandIcon}`}
              onSelect={() => setOpenSearch(!openSearch)}
            ></span>
          }
          listbox={{
            className: styles.listboxDiv,
          }}
        >
          {groupOptions.map((group) => (
            <OptionGroup key={group} label={group}>
              {filteredOptions.map((sme) => {
                if (sme.facility.facilityId !== group) {
                  return null;
                }
                return (
                  <Option
                    key={sme.id}
                    value={sme.id}
                    text={`[${sme.facility.facilityId}] ${sme.fullName} (${sme.email})`}
                    className={styles.optionDiv}
                  >
                    <div>
                      <div
                        className={styles.optionName}
                      >{`${sme.fullName} (${sme.email})`}</div>
                      <div
                        className={styles.optionFacility}
                      >{`${sme.facility.facilityId}`}</div>
                    </div>
                  </Option>
                );
              })}
            </OptionGroup>
          ))}
        </Combobox>
      )}
    </div>
  );
};
