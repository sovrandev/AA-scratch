import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: theme.bg.box,
    padding: '0 16px',
    borderRadius: '6px',
    height: 40,
    minWidth: '300px',
    "@media (max-width: 1200px)": {
      width: "100%",
    },
  },
  label: {
    color: theme.text.secondary,
    fontSize: '14px',
    fontWeight: 500,
    whiteSpace: 'nowrap'
  },
  sliderContainer: {
    width: '100%',
    position: 'relative',
    height: 40,
    display: 'flex',
    alignItems: 'center'
  },
  railContainer: {
    width: '100%',
    height: 4,
    display: 'flex',
    gap: '2px',
    position: 'absolute',
    zIndex: 1
  },
  railSection: {
    flex: 1,
    height: '100%',
    borderRadius: 0,
  },
  slider: {
    width: '100%',
    padding: '15px 0',
    position: 'absolute',
    zIndex: 2,
    '& .MuiSlider-rail': {
      display: 'none'
    },
    '& .MuiSlider-track': {
      display: 'none'
    },
    '& .MuiSlider-thumb': {
      width: 12,
      height: 12,
      backgroundColor: '#fff',
      boxShadow: '0 0 0 2px #13181E',
      '&:hover, &.Mui-focusVisible': {
        boxShadow: '0 0 0 2px #13181E'
      },
      '&.Mui-active': {
        boxShadow: '0 0 0 3px #13181E'
      }
    },
    '& .MuiSlider-mark': {
      display: 'none'
    }
  }
}));

// Marks for the 4 risk levels (0, 0.33, 0.66, 1)
const marks = [
  { value: 0.25, label: '' },
  { value: 0.5, label: '' },
  { value: 0.75, label: '' },
  { value: 1, label: '' }
];

const RiskRangeSlider = ({ value, onChange }) => {
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.label}>Risk:</div>
      <div className={classes.sliderContainer}>
        <div className={classes.railContainer}>
          <div className={classes.railSection} style={{ backgroundColor: '#4CAF50' }} />
          <div className={classes.railSection} style={{ backgroundColor: '#2196F3' }} />
          <div className={classes.railSection} style={{ backgroundColor: '#FFC107' }} />
          <div className={classes.railSection} style={{ backgroundColor: '#F44336' }} />
        </div>
        <Slider
          className={classes.slider}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="off"
          marks={marks}
          min={0}
          max={1}
          step={0.01}
        />
      </div>
    </div>
  );
};

export default RiskRangeSlider; 