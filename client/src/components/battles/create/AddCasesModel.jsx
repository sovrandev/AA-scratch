import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import AddCaseItem from "./AddCaseItem";
import FilterDropdown from "./FilterDropdown";
import SearchCase from "./SearchCase";

const useStyles = makeStyles(theme => ({
  modal: {
    "& .MuiDialog-paperWidthSm": {
      background: theme.bg.nav,
      borderRadius: "12px",
      padding: "24px",
      gap: "24px",
      display: "flex",
      flexDirection: "column",
      maxWidth: 800,
      maxHeight: 800,
      width: "100%",
      position: "relative",
      "@media (max-width: 1200px)": {
        margin: 4,
        padding: "24px 12px"
      },
    },
    fontWeight: 600
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: theme.text.primary,
    display: "flex",
    alignItems: "center",
    gap: 8,
    "& svg": {
      color: theme.text.primary,
      height: 24,
      width: 24
    }
  },
  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "@media (max-width: 1200px)": {
     flexDirection: "column",
     gap: 8,
     width: "100%"
    },
  },
  divider: {
    height: 1,
    backgroundColor: theme.bg.border,
    width: "100%",
    opacity: 0.5
  },
  totalCost: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    fontSize: 14,
    fontWeight: 600,
    background: theme.bg.box,
    color: theme.text.primary,
    padding: "10px 12px",
    borderRadius: "8px",
    gap: "6px",
    lineHeight: 1.2,
    "& span":{
      fontSize: 13,
      fontWeight: 600,
      color: theme.text.secondary,
    }

  },
  searchInput: {
    flex: 1,
    backgroundColor: theme.bg.box,
    border: `1px solid #262F3C`,
    borderRadius: 4,
    padding: "8px 12px",
    color: theme.text.primary,
    fontSize: 14,
    maxWidth: 210,
    "&::placeholder": {
      color: theme.text.secondary
    }
  },
  casesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    "@media (max-width: 1200px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    gap: 8,
    overflowY: "auto",
    maxHeight: "484px",
    minHeight: "484px",
    padding: 2,
    '&::-webkit-scrollbar': {
      width: '0px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#1D222A',
      borderRadius: '4px',
    },
  },
  filterContainer: {
    display: "flex",
    gap: 12,
    "@media (max-width: 1200px)": {
      width: "100%"
    },
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",    
  },
  confirmButton: {
    display: "flex",
    color: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    background: theme.accent.primaryGradient,
    gap: "6px",
    padding: "8px 28px",
    minWidth: 150,
    width: "fit-content",
    borderRadius: theme.spacing(0.75),
    // boxShadow: "0px 2px 0px 0px #FFFFFF40 inset, 0px -2px 0px 0px #00000040 inset",
    cursor: "pointer",
    userSelect: "none",
    fontWeight: 600,
    textShadow: "0px 2px 3px rgba(0, 0, 0, 0.25)",
    transition: 'all 0.2s ease',
    height: 40,
    '&:hover': {
      opacity: 0.8
    }
  },
}));

const AddCasesModel = ({ open, handleClose, cases, selectedCases, add, subtract }) => {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Price descending");
  const [filteredCases, setFilteredCases] = useState(cases);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const filtered = cases.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === "Price descending") {
      filtered.sort((a, b) => b.amount - a.amount);
    } else {
      filtered.sort((a, b) => a.amount - b.amount);
    }
    setFilteredCases(filtered);
  }, [search, sort]);

  useEffect(() => {
    const total = selectedCases.reduce((acc, curr) => acc + curr.quantity * curr.amount, 0);
    setTotalCost(total);
  }, [selectedCases]);

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      open={open}
    >
      <div className={classes.header}>
        <div className={classes.headerTitle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 21 16"><path fill="currentColor" d="m3.346 12.916 7.513 2.514 7.513-2.514V9.005l-5.983 1.955-1.53-2.234-1.53 2.234-5.983-1.955z"></path><path fill="currentColor" fillRule="evenodd" d="M.856 7.07 3.472 3.2 10.86.57l7.54 2.632 2.462 3.87-8.002 2.631-2-3.096-2 3.096zm5.078-3.56 4.925-1.703 4.924 1.703-4.924 1.703z" clipRule="evenodd"></path></svg>
          Add Boxes
        </div>
        <div className={classes.closeButton} onClick={handleClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M11.8333 1.34616L10.6542 0.166992L5.99999 4.82116L1.34582 0.166992L0.166656 1.34616L4.82082 6.00033L0.166656 10.6545L1.34582 11.8337L5.99999 7.17949L10.6542 11.8337L11.8333 10.6545L7.17916 6.00033L11.8333 1.34616Z" fill="#959597"/></svg>
        </div>
      </div>

      <div className={classes.divider} />

      <div className={classes.searchContainer}>
        <SearchCase 
          placeholder="Search for boxes..."
          value={search}
          setValue={(props) => setSearch(props)}
        />
        <div className={classes.filterContainer}>
          <FilterDropdown 
            options={["Price descending", "Price ascending"]}
            selectedOption={sort}
            setSelectedOption={(props) => setSort(props)}
          />

        </div>
      </div>

      <div className={classes.casesGrid}>
        {filteredCases.filter(box => box.type === "site").map((Case) => {
          const selectedCase = selectedCases.find(c => c._id === Case._id);
          const quantity = selectedCase ? selectedCase.quantity : 0;

          return (
            <AddCaseItem 
              key={Case._id}
              item={Case}
              quantity={quantity}
              add={(caseItem) => add(caseItem)}
              subtract={(caseItem) => subtract(caseItem)}
            />
          );
        })}
      </div>

      <div className={classes.divider} />

      <div className={classes.footer}>
        <div className={classes.totalCost}>
          <span>Total cost</span>
          ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={classes.confirmButton} onClick={handleClose}>Confirm Selection</div>
      </div>

    </Dialog>
  );
};

export default AddCasesModel;