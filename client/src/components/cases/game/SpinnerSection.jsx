import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, TablePagination } from "@material-ui/core";
import { motion, useAnimation } from "framer-motion";
import { useSound } from '../../../contexts/sound';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative",
  },
  spinnerContainer: {
    display: "flex",
    width: "100%",
    position: "relative",
    overflow: "hidden",
    height: props => props.numOfSpinners > 1 ? "400px" : "230px",
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerWrapper: {
    flex: 1,
    position: "relative",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    display: "flex",
    flexDirection: props => props.isHorizontal ? "row" : "column",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    willChange: "transform",
    width: props => props.isHorizontal ? "auto" : "140px",
    height: props => props.isHorizontal ? "140px" : "auto",
  },
  item: {
    width: "140px",
    height: "140px",
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    position: "relative",
    opacity: 0.3,
    "&.center": {
      opacity: 1,
      transform: "scale(1.1)",
    }
  },
  itemImage: {
    width: "80%",
    height: "80%",
    borderRadius: "6px",
    objectFit: "contain",
    position: "relative",
    filter: props => props.glowColor ? `drop-shadow(0 0 8px ${props.glowColor})` : "none",
  },
  itemDetails: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 4,
    zIndex: 100,
  },
  itemName: {
    fontSize: 12,
    color: theme.text.secondary,
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "90%",
    fontWeight: 500,
  },
  itemPrice: {
    fontSize: 12,
    color: theme.text.primary,
    fontWeight: 500,
  },
  divider: {
    width: "100%",
    height: 1,
    background: `linear-gradient(90deg, 
      ${theme.bg.inner}00 0%, 
      ${theme.bg.inner} 50%, 
      ${theme.bg.inner}00 100%
    )`,
  },
  itemsTrack: {
    display: "flex",
    flexDirection: props => props.isHorizontal ? "row" : "column",
    position: "relative",
    transform: props => props.isHorizontal ? 
      `translateX(${-10 * 140}px)` : 
      `translateY(${-10 * 140}px)`, // Start at 10th item
    willChange: "transform",
  },
  markerContainer: {
    position: "absolute",
    zIndex: 10,
    pointerEvents: "none",
  },
  horizontalMarkerTop: {
    top: -30,
    left: "50%",
    transform: "translateX(-50%) rotate(90deg)",
    color: theme.text.primary,
  },
  horizontalMarkerBottom: {
    bottom: -30,
    left: "50%",
    transform: "translateX(-50%) rotate(-90deg)",
    color: theme.text.primary,
  },
  verticalMarkerLeft: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: theme.text.primary,
    zIndex: 100,
  },
  verticalMarkerRight: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%) rotate(180deg)",
    color: theme.text.primary,
    zIndex: 100,
  },
  shadowLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "200px",
    height: "100%",
    background: `linear-gradient(to right, ${theme.bg.nav}CC 20%, transparent 100%)`,
    pointerEvents: "none",
    zIndex: 5
  },
  shadowRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "200px",
    height: "100%",
    background: `linear-gradient(to left, ${theme.bg.nav}CC 20%, transparent 100%)`,
    pointerEvents: "none",
    zIndex: 5
  },
  shadowTop: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100px",
    background: `linear-gradient(to bottom, ${theme.bg.nav}CC 20%, transparent 100%)`,
    pointerEvents: "none",
    zIndex: 5
  },
  shadowBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100px",
    background: `linear-gradient(to top, ${theme.bg.nav}CC 20%, transparent 100%)`,
    pointerEvents: "none",
    zIndex: 5
  }
}));

const getRadialGradient = (color) => {
  switch (color) {
    case 'gold':
      return 'radial-gradient(circle, rgba(196, 167, 7, 0.25), transparent 75%)';
    case 'red':
      return 'radial-gradient(circle, rgba(237, 27, 91, 0.25), transparent 75%)';
    case 'purple':
      return 'radial-gradient(circle, rgba(147, 51, 234, 0.25), transparent 75%)';
    case 'blue':
      return 'radial-gradient(circle, rgba(27, 149, 237, 0.25), transparent 75%)';
    case 'white':
      return 'radial-gradient(circle, rgba(141, 155, 172, 0.25), transparent 75%)';
    default:
      return 'none';
  }
};

const SpinnerItem = React.memo(({ item, isActive, isSpinning }) => {
  const classes = useStyles();

  if (!item?.item) return null;

  return (
    <motion.div 
      className={`${classes.item} ${isActive ? classes.activeItem : ""}`}
      animate={{
        transform: isActive ? 'scale(1.30)' : 'scale(1)',
        opacity: isActive ? 1 : 0.5,
        transition: 'transform 0.25s ease-in-out'
      }}
      initial={{
        opacity: 0.5,
        transform: 'scale(1)',
      }}
    >
      <motion.img 
        src={item.item.image} 
        alt={item.item.name}
        className={classes.itemImage}
        style={{ 
          background: getRadialGradient(item.color),
        }}
        animate={isActive && !isSpinning ? { y: [0, -10, 0] } : {}}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
      />
      {isActive && !isSpinning && (
        <div className={classes.itemDetails}>
          <motion.div 
            className={classes.itemName}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {item.item.name}
          </motion.div>
          <motion.div 
            className={classes.itemPrice}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            ${item.item.amountFixed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
});

const formatItems = (caseData, items) => {
  if (!caseData || !items) return [];

  const calculateEstimatedCaseValue = (items) => {
    if (!items || items.length === 0) return 0;
    
    const totalTickets = items.reduce((sum, item) => sum + (item.tickets || 1), 0);
    
    const expectedValue = items.reduce((sum, item) => {
      const probability = (item.tickets || 1) / totalTickets;
      return sum + (item.item.amountFixed * probability);
    }, 0);
    
    return expectedValue;
  };
  
  return items.map(item => {
    if (!item) return null;
    
    const casePrice = caseData.amount || calculateEstimatedCaseValue(caseData?.items || []);

    const itemPrice = item.item?.amountFixed || 0;
    const ratio = itemPrice / casePrice;

    // Determine color based on ratio
    let color;
    if(ratio >= 9) {
      color = 'gold';
    } else if(ratio >= 5) {
      color = 'red';
    } else if(ratio >= 1.8) {
      color = 'purple';
    } else if(ratio >= 0.8) {
      color = 'blue';
    } else {
      color = 'white';
    }

    return { ...item, color };
  }).filter(Boolean);
};

const SpinnerContent = React.memo(({ 
  spinnerIndex,
  isSpinning,
  spinnerControl,
  spinnerItems,
  centerIndex,
  isHorizontal
}) => {
  const classes = useStyles({ isHorizontal });

  return (
    <div className={classes.spinner}>
      {/* Only show markers for horizontal spinner (single spinner) */}
      {isHorizontal && (
        <>
          <svg className={`${classes.markerContainer} ${classes.horizontalMarkerTop}`} xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 19 26" fill="currentColor">
            <path d="M17.0717 15.3426L4.87409 25.1007C2.9098 26.6722 -1.62884e-07 25.2736 -2.72841e-07 22.7581L-1.12592e-06 3.24187C-1.23588e-06 0.726357 2.9098 -0.672161 4.87409 0.899269L17.0717 10.6574C18.573 11.8584 18.573 14.1416 17.0717 15.3426Z" fill="currentColor"/>
          </svg>
          <svg className={`${classes.markerContainer} ${classes.horizontalMarkerBottom}`} xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 19 26" fill="currentColor">
            <path d="M17.0717 15.3426L4.87409 25.1007C2.9098 26.6722 -1.62884e-07 25.2736 -2.72841e-07 22.7581L-1.12592e-06 3.24187C-1.23588e-06 0.726357 2.9098 -0.672161 4.87409 0.899269L17.0717 10.6574C18.573 11.8584 18.573 14.1416 17.0717 15.3426Z" fill="currentColor"/>
          </svg>
        </>
      )}

      <motion.div 
        className={classes.itemsTrack} 
        animate={spinnerControl}
      >
        {spinnerItems.map((item, itemIndex) => (
          <SpinnerItem
            key={`${item?.item?._id}-${spinnerIndex}-${itemIndex}`}
            item={item}
            isActive={itemIndex === centerIndex}
            isSpinning={isSpinning}
          />
        ))}
      </motion.div>
    </div>
  );
});

// Replace the current useSpinnerControls implementation with this:
const useSpinnerControls = (count) => {
  // Create individual controls using separate hooks
  const control1 = useAnimation();
  const control2 = useAnimation();
  const control3 = useAnimation();
  const control4 = useAnimation();

  // Return an array of the controls based on count
  return React.useMemo(() => {
    const controls = [control1, control2, control3, control4];
    return controls.slice(0, count);
  }, [count, control1, control2, control3, control4]);
};

const SpinnerSection = ({ numOfSpinners = 1, caseData, spinData, isSpinning, onSpinComplete, fastSpin }) => {
  const classes = useStyles({ 
    isHorizontal: numOfSpinners === 1,
    numOfSpinners
  });
  const { playTick, playUnbox } = useSound();

  const [spinnerItems, setSpinnerItems] = useState([]);
  const [centerIndices, setCenterIndices] = useState([]);
  const [spinCompleted, setSpinCompleted] = useState([]);
  const [key, setKey] = useState(0); // Add key for forcing re-render
  
  // Add refs for spinner containers
  const spinnerRefs = useRef([]);
  
  // Use the custom hook with numOfSpinners
  const spinnerControls = useSpinnerControls(numOfSpinners);

  // Add new state to track if animation is in progress
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Add a mounted ref to track component existence
  const isMounted = useRef(true);

  const ITEM_SIZE = 140;
  const TOTAL_ITEMS = 99;
  const RESULT_POSITION = 90;
  const SPIN_DURATION = fastSpin ? 1500 : 5500;

  // Set isMounted to false when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Reset states when number of spinners changes
  useEffect(() => {
    setKey(prev => prev + 1); // Force re-render
    setCenterIndices(Array(numOfSpinners).fill(30));
    setSpinCompleted(Array(numOfSpinners).fill(false));
    spinnerRefs.current = Array(numOfSpinners).fill(null).map(() => React.createRef());
    
    // Generate initial items for all spinners
    if (caseData?.items) {
      const initialItems = generateSpinnerItems(caseData.items, []);
      setSpinnerItems(initialItems);
    }
  }, [numOfSpinners]);

  // Handle spin data changes
  useEffect(() => {
    if (spinData && spinData.length > 0 && !isAnimating) {
      setIsAnimating(true);
      setSpinCompleted(Array(numOfSpinners).fill(false));
      
      const items = generateSpinnerItems(caseData?.items || [], spinData);
      setSpinnerItems(items);
      
      setTimeout(() => {
        startSpinAnimation();
      }, 0);
    }
  }, [spinData]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      spinnerControls.forEach(control => control.stop());
    };
  }, []);

  const generateSpinnerItems = (items = [], results = []) => {
    return Array(numOfSpinners).fill(null).map((_, spinnerIndex) => {
      const spinnerItemList = [];
      
      // Create weighted items list based on tickets
      const weightedItems = items.flatMap(item => 
        Array(Math.floor((item.tickets / 100000) * 50)).fill({
          item: item.item,
          tickets: item.tickets,
          color: formatItems(caseData, [item])[0]?.color || 'white'
        })
      );

      // Ensure we have at least some items in the weighted list
      if (weightedItems.length === 0 && items.length > 0) {
        // Fallback to using all items with equal weight
        items.forEach(item => {
          weightedItems.push({
            item: item.item,
            tickets: item.tickets,
            color: formatItems(caseData, [item])[0]?.color || 'white'
          });
        });
      }

      for (let i = 0; i < TOTAL_ITEMS; i++) {
        if (i === RESULT_POSITION && results[spinnerIndex]) {
          // Place the result item at the result position
          spinnerItemList.push({
            item: results[spinnerIndex].item,
            color: results[spinnerIndex].color,
            payout: results[spinnerIndex].payout,
            multiplier: results[spinnerIndex].multiplier
          });
        } else {
          // For all other positions, use random weighted items
          const randomIndex = Math.floor(Math.random() * weightedItems.length);
          spinnerItemList.push(weightedItems[randomIndex] || {
            item: items[0]?.item || { name: 'Default Item', image: '', price: 0 },
            color: 'white'
          });
        }
      }

      return spinnerItemList;
    });
  };

  const START_INDEX = 50; // Spinner starts centered on the 50th item

  const calculateCenterIndex = (xPosition, slotIndex) => {
      const totalItems = TOTAL_ITEMS;  // 99 total items
      const visibleItemWidth = ITEM_SIZE;
  
      // Invert xPosition so that moving right (which gives a negative xPosition)
      // results in a positive offset.
      let centerIndex = START_INDEX + Math.round(-xPosition / visibleItemWidth);
  
      // Wrap the index to keep it in the range [0, totalItems - 1]
      centerIndex = ((centerIndex % totalItems) + totalItems) % totalItems;
  
      centerIndex = centerIndex - 1;
  
      setCenterIndices(prev => {
        if (prev[slotIndex] === centerIndex) return prev;
  
        playTick();
        
        const newIndices = [...prev];
        newIndices[slotIndex] = centerIndex;
        return newIndices;
      });
  }; 


  const startSpinAnimation = () => {
    if (!isMounted.current) return;
    
    // Generate random offset for all spinners
    const randomOffset = Math.floor(Math.random() * 110) - 55;
    let completedSpinners = 0;
    
    // Start all spinner animations simultaneously
    spinnerControls.forEach((control, index) => {
      if (!isMounted.current) return;
      
      // Calculate total distance including initial offset
      const totalDistance = ITEM_SIZE * (RESULT_POSITION - 49);

      // Reset to initial position
      control.set({ 
        [numOfSpinners === 1 ? 'x' : 'y']: 0
      });
      
      // Start the spin animation
      if (isMounted.current) {
        control.start({
          [numOfSpinners === 1 ? 'x' : 'y']: -totalDistance - randomOffset,
          transition: {
            duration: SPIN_DURATION / 1000,
            ease: [0.15, 0.86, 0, 1],
            onUpdate: (latest) => {
              if (isMounted.current) {
                calculateCenterIndex(latest, index);
              }
            },
            onComplete: () => {
              if (!isMounted.current) return;
              
              setTimeout(() => {
                // Final adjustment to exact position
                if(!isMounted.current) return;
                
                control.start({
                  [numOfSpinners === 1 ? 'x' : 'y']: -totalDistance,
                  transition: {
                    duration: 0.25,
                    ease: "easeOut",
                    onUpdate: (latest) => calculateCenterIndex(latest, index)
                  }
                }).then(() => {
                  setSpinCompleted(prev => {
                    const newState = [...prev];
                    newState[index] = true;
                    
                    completedSpinners++;
                    if (completedSpinners === numOfSpinners) {
                      playUnbox();
                      setIsAnimating(false);
                      onSpinComplete?.();
                    }
                    
                    return newState;
                  });
                });
              }, 250);
            }
          }
        }).catch(err => {
          // Silently catch any errors if component unmounted
          console.log("Animation error caught:", err);
        });
      }
    });
  };

  return (
    <div className={classes.root} key={key}>
      <div className={classes.divider} />
      <div className={classes.spinnerContainer}>
        {/* Add shadows based on spinner orientation */}
        {numOfSpinners === 1 ? (
          <>
            <div className={classes.shadowLeft} />
            <div className={classes.shadowRight} />
          </>
        ) : (
          <>
            <div className={classes.shadowTop} />
            <div className={classes.shadowBottom} />
          </>
        )}
        
        {numOfSpinners > 1 && (
          <>
            <div className={`${classes.markerContainer} ${classes.verticalMarkerLeft}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 19 26" fill="currentColor">
                <path d="M17.0717 15.3426L4.87409 25.1007C2.9098 26.6722 -1.62884e-07 25.2736 -2.72841e-07 22.7581L-1.12592e-06 3.24187C-1.23588e-06 0.726357 2.9098 -0.672161 4.87409 0.899269L17.0717 10.6574C18.573 11.8584 18.573 14.1416 17.0717 15.3426Z" fill="currentColor"/>
              </svg>
            </div>
            <div className={`${classes.markerContainer} ${classes.verticalMarkerRight}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 19 26" fill="currentColor">
                <path d="M17.0717 15.3426L4.87409 25.1007C2.9098 26.6722 -1.62884e-07 25.2736 -2.72841e-07 22.7581L-1.12592e-06 3.24187C-1.23588e-06 0.726357 2.9098 -0.672161 4.87409 0.899269L17.0717 10.6574C18.573 11.8584 18.573 14.1416 17.0717 15.3426Z" fill="currentColor"/>
              </svg>
            </div>
          </>
        )}
        
        {Array.from({ length: numOfSpinners }).map((_, index) => (
          <div 
            key={`spinner-${index}-${key}`}
            className={classes.spinnerWrapper}
            ref={el => spinnerRefs.current[index] = el}
          >
            <SpinnerContent
              spinnerIndex={index}
              isSpinning={!spinCompleted[index]}
              spinnerControl={spinnerControls[index]}
              spinnerItems={spinnerItems[index] || []}
              centerIndex={centerIndices[index]}
              isHorizontal={numOfSpinners === 1}
            />
          </div>
        ))}
      </div>
      <div className={classes.divider} />
    </div>
  );
};

export default SpinnerSection;