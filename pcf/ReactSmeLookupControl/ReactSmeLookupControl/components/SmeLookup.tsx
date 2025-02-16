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
import { ResourceRequest } from "../types/ResourceRequest";

export interface SmeLookupProps extends ComboboxProps {
  assignedSmes: AssignedSme[];
  selectedItem: ComponentFramework.LookupValue | undefined;
  resourceRequest: ResourceRequest | undefined;
  filterSmes?: boolean;
  onInputChange: (sme: ComponentFramework.LookupValue | undefined) => void;
}

const useStyles = makeStyles({
  root: {
    backgroundColor: "transparent",
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
    display: "grid",
    gridTemplateRows: "repeat(1fr)",
    justifyItems: "start",
    gap: "2px",
    backgroundColor: "rgb(245,245,245)",
    width: "100%",
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
    fontSize: "14px",
  },
  warningMessage: {
    color: "red",
    fontSize: "10px",
    fontStyle: "italic",
    marginLeft: "10px",
    display: "flex",
  },
  input: {
    width: "100%",
  },
});

export const SmeLookup = (props: SmeLookupProps) => {
  const {
    assignedSmes,
    selectedItem,
    resourceRequest,
    filterSmes,
    ...comboboxProps
  } = props;
  const comboId = useId("reactSmeLookupCombobox");
  const styles = useStyles();

  const [query, setQuery] = React.useState<string>("");
  const [value, setValue] = React.useState<string>("");
  const [openSearch, setOpenSearch] = React.useState(false);
  const [validSme, setValidSme] = React.useState(true);

  const groups = assignedSmes.map((sme) => {
    if (filterSmes) {
      const isValidSme = resourceRequest?.assignedSmes.some((assignedSme) => {
        return assignedSme.id === sme.id;
      });
      if (isValidSme) {
        return sme.facility.facilityId;
      }
    } else {
      return sme.facility.facilityId;
    }
  });
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
    } else {
      setValue("");
    }
  }, [selectedItem, assignedSmes]);

  React.useEffect(() => {
    if (selectedItem && resourceRequest) {
      const isValidSme = resourceRequest.assignedSmes.some((sme) => {
        return sme.id === selectedItem.id;
      });
      setValidSme(isValidSme);
    }
  }, [selectedItem, resourceRequest]);

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
    .filter((sme) => {
      const isValidSme = filterSmes
        ? resourceRequest?.assignedSmes.some((assignedSme) => {
            return assignedSme.id === sme.id;
          })
        : true;
      return (
        isValidSme &&
        `${sme.fullName} ${sme.email} ${sme.facility.facilityId}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        sme.id !== selectedItem?.id
      );
    })
    .sort((a, b) => a.fullName.localeCompare(b.fullName));

  const onClear = () => {
    setQuery("");
    setValue("");
    props.onInputChange(undefined);
  };

  console.debug("SmeLookup.assignedSmes", assignedSmes);
  return (
    <div className={styles.root}>
      <div className={styles.combobox} id={comboId}>
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
            input={{
              className: styles.input,
            }}
          >
            {
              // TODO: Style the option groups
              groupOptions.map((group) => (
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
              ))
            }
          </Combobox>
        )}
      </div>
      {!validSme && value && (
        <div className={styles.warningMessage}>
          *Selected SME not associated with the Resource Request
        </div>
      )}
    </div>
  );
};
