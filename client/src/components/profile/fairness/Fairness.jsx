import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ProfilePageTemplate from '../template/ProfilePageTemplate';
import { useNotification } from '../../../contexts/notification';
import { useUser } from '../../../contexts/user';
import { format } from 'date-fns';
import theme from '../../../styles/theme';
import Pagination from '../../common/Pagination';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  section: {
    background: theme.bg.box,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3),
    "@media (max-width: 1200px)": {
      padding: theme.spacing(2),
    }
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    color: theme.text.primary
  },
  description: {
    fontSize: "14px",
    color: theme.text.secondary,
    marginBottom: theme.spacing(2),
    lineHeight: 1.5
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  inputLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: theme.text.secondary
  },
  inputValue: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    background: theme.bg.main,
    padding: "4px 4px 4px 12px",
    borderRadius: 6,
    width: "100%"
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: theme.text.primary,
    fontSize: "14px",
    fontWeight: 500,
    "&:focus": {
      outline: "none"
    }
  },
  button: {
    background: theme.accent.primaryGradient,
    color: theme.text.primary,
    border: "none",
    minWidth: 80,
    borderRadius: 4,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      opacity: 0.9,
    }
  },
  codeBlock: {
    background: theme.bg.main,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(0.75),
    fontFamily: 'monospace',
    fontSize: '14px',
    color: theme.text.primary,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    marginTop: theme.spacing(2),
    "@media (max-width: 1200px)": {
      fontSize: "12px",
    }
  },
  seedPair: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: theme.spacing(2)
  },
  seedPairItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  seedPairLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: theme.text.secondary
  },
  seedPairValue: {
    fontSize: "14px",
    color: theme.text.primary,
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    background: theme.bg.main,
    padding: "12px",
    borderRadius: 6,
    width: "100%",
    "@media (max-width: 1200px)": {
      fontSize: "12px",
      padding: theme.spacing(1),
    }
  },
  seedHistory: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginTop: theme.spacing(2)
  },
  seedHistoryItem: {
    background: theme.bg.main,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(0.75),
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  seedHistoryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  seedHistoryDate: {
    fontSize: "12px",
    color: theme.text.secondary
  },
  verifySection: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2)
  },
  gameModeButtons: {
    position: 'relative',
    display: 'flex',
    backgroundColor: theme.bg.main,
    borderRadius: '6px',
    padding: '4px',
    height: '40px',
    alignItems: 'center',
    width: 'fit-content'
  },
  gameModeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    position: 'relative',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    color: theme.text.secondary,
    transition: 'all 0.2s ease',
    zIndex: 1,
    '&.active': {
      color: theme.text.primary
    }
  },
  highlight: {
    position: 'absolute',
    height: '32px',
    top: '4px',
    borderRadius: '6px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: theme.bg.inner
  }
}));

const Fairness = () => {
  const classes = useStyles();
  const notify = useNotification();
  const { 
    currentSeed, 
    nextSeed, 
    seedHistory,
    seedHistoryCount,
    seedHistoryLoading,
    fetchCurrentSeed,
    fetchSeedHistory,
    updateClientSeed 
  } = useUser();
  const [clientSeed, setClientSeed] = useState('');
  const [selectedMode, setSelectedMode] = useState('battles');
  const [page, setPage] = useState(1);
  const buttonRefs = {
    battles: useRef(null),
    upgrader: useRef(null),
    mines: useRef(null),
    unbox: useRef(null)
  };
  const highlightRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    if (!seedHistoryLoading && mounted) {
      fetchCurrentSeed();
      fetchSeedHistory(page);
    }

    return () => {
      mounted = false;
    };
  }, [page]); // Run when page changes

  useEffect(() => {
    const activeButton = buttonRefs[selectedMode]?.current;
    const highlight = highlightRef.current;
    
    if (activeButton && highlight) {
      const { offsetLeft, offsetWidth } = activeButton;
      highlight.style.width = `${offsetWidth}px`;
      highlight.style.left = `${offsetLeft}px`;
    }
  }, [selectedMode]);

  const handleSaveClientSeed = async () => {
    if (clientSeed.trim()) {
      const success = await updateClientSeed(clientSeed);
      if (success) {
        setClientSeed('');
      }
    }
  };

  const handleGenerateRandomSeed = () => {
    const randomSeed = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
    setClientSeed(randomSeed);
  };

  const totalPages = Math.ceil(seedHistoryCount / 10);

  const getVerificationCode = () => {
    switch(selectedMode) {
      case 'battles':
        return `const crypto = require('crypto');

// Input variables
const clientSeed = 'your_client_seed';
const serverSeed = 'your_server_seed';
const eosHash = 'eos_block_hash';
const blockNumber = 123456; // EOS block number
const playerCount = 2; // Number of players
const rounds = 5; // Number of rounds

const getBattleTicket = (clientSeed, serverSeed, eosHash, blockNumber, round, player) => {
  const combined = \`\${clientSeed}-\${serverSeed}-\${eosHash}-\${blockNumber}-\${round}-\${player}\`;
  const hash = crypto.createHash('sha256').update(combined).digest('hex');
  const ticket = parseInt(hash.substr(0, 8), 16) % 100000;
  return ticket;
};

// Simulate a full battle game
const simulateBattle = () => {
  const results = [];
  
  for (let round = 1; round <= rounds; round++) {
    const roundTickets = [];
    
    for (let player = 0; player < playerCount; player++) {
      const ticket = getBattleTicket(clientSeed, serverSeed, eosHash, blockNumber, round, player);
      roundTickets.push(ticket);
    }
    
    results.push({
      round: round,
      tickets: roundTickets
    });
  }
  
  return results;
};

// Print results in a table format
const printBattleResults = (results) => {
  console.log('Battle Results:');
  console.log('+---------+---------------------+');
  console.log('| Round   | Player Tickets      |');
  console.log('+---------+---------------------+');
  
  results.forEach((round) => {
    const ticketList = round.tickets.map((ticket, index) => 
      \`Player \${index + 1}: \${ticket}\`
    ).join(' | ');
    
    console.log(\`| Round \${round.round.toString().padEnd(2)} | \${ticketList.padEnd(19)} |\`);
    console.log('+---------+---------------------+');
  });
};

// Run simulation and print results
const battleResults = simulateBattle();
printBattleResults(battleResults);`;
      case 'upgrader':
        return `const crypto = require('crypto');

// Input variables
const clientSeed = 'your_client_seed';
const serverSeed = 'your_server_seed';
const nonce = 0; // Increments with each game

const getUpgraderTicket = (clientSeed, serverSeed, nonce) => {
  const combined = \`\${serverSeed}-\${nonce}-\${clientSeed}\`;
  const hash = crypto.createHash('sha256').update(combined).digest('hex');
  const ticket = parseInt(hash.substr(0, 8), 16) % 100000;
  return ticket;
};

console.log('Upgrader Ticket:', getUpgraderTicket(clientSeed, serverSeed, nonce));`;
      case 'mines':
        return `const crypto = require('crypto');
const ChanceJs = require('chance');

// Input variables
const clientSeed = 'your_client_seed';
const serverSeed = 'your_server_seed';
const nonce = 0; // Increments with each game
const mineCount = 5; // Number of mines in game

const getMinesDeck = (clientSeed, serverSeed, nonce, mineCount) => {
  // Generate hash from seed data
  const combined = \`\${serverSeed}-\${nonce}-\${clientSeed}\`;
  const hash = crypto.createHash('sha256').update(combined).digest('hex');
  
  // Use hash to create deterministic random
  const chance = new ChanceJs(hash);
  let deck = [];

  // Create deck with mines and coins
  for(let i = 0; i < 25; i++) {
    if(i < mineCount) {
      deck.push('mine');
    } else {
      deck.push('coin');
    }
  }

  // Shuffle deck using provably fair hash
  return chance.shuffle(deck);
};

// Get the deck
const deck = getMinesDeck(clientSeed, serverSeed, nonce, mineCount);

// Print the deck as array
console.log('Mines Deck Array:');
console.log(deck);

// Print deck in 5x5 grid format for better visualization
console.log('\\nMines Grid (5x5):');
console.log('+-----------------+');
for (let i = 0; i < 5; i++) {
  let row = '|';
  for (let j = 0; j < 5; j++) {
    const index = i * 5 + j;
    // Display mines as X and coins as O
    row += deck[index] === 'mine' ? ' X ' : ' O ';
  }
  row += '|';
  console.log(row);
}
console.log('+-----------------+');
console.log('X = Mine, O = Coin');

// Print mine positions
const minePositions = deck.map((tile, index) => 
  tile === 'mine' ? index : null).filter(pos => pos !== null);
console.log('\\nMine positions:', minePositions);`;
      case 'unbox':
        return `const crypto = require('crypto');

// Input variables
const clientSeed = 'your_client_seed';
const serverSeed = 'your_server_seed';
const nonce = 0; // Increments with each game

const getUnboxTicket = (clientSeed, serverSeed, nonce) => {
  const combined = \`\${serverSeed}-\${nonce}-\${clientSeed}\`;
  const hash = crypto.createHash('sha256').update(combined).digest('hex');
  const ticket = parseInt(hash.substr(0, 8), 16) % 100000;
  return ticket;
};

console.log('Unbox Ticket:', getUnboxTicket(clientSeed, serverSeed, nonce));`;
      default:
        return '';
    }
  };

  return (
    <ProfilePageTemplate title="Fairness">
      <div className={classes.root}>
        <div className={classes.section}>
          <div className={classes.sectionTitle}>Change your client seed</div>
          <div className={classes.description}>
            This is a random string that is used (in combination with the server seed, and a nonce) to generate a random number. You can change your client seed at any time. Note that this will rotate your current seed pair.
          </div>
          <div className={classes.inputGroup}>
            <div className={classes.inputLabel}>Client seed</div>
            <div className={classes.inputValue}>
              <input
                type="text"
                className={classes.input}
                placeholder="Enter your new client seed"
                value={clientSeed}
                onChange={(e) => setClientSeed(e.target.value)}
              />
              <button
                className={classes.button}
                onClick={handleSaveClientSeed}
              >
                Save
              </button>
            </div>
          </div>
        </div>

        <div className={classes.section}>
          <div className={classes.sectionTitle}>Current Seed Pair</div>
          <div className={classes.description}>
            This shows your current active seed pair. The server seed is hashed to maintain fairness, and will be revealed once it is rotated.
          </div>
          {currentSeed && (
            <div className={classes.seedPair}>
              <div className={classes.seedPairItem}>
                <div className={classes.seedPairLabel}>Client Seed</div>
                <div className={classes.seedPairValue}>{currentSeed.seedClient}</div>
              </div>
              <div className={classes.seedPairItem}>
                <div className={classes.seedPairLabel}>Server Seed Hash</div>
                <div className={classes.seedPairValue}>{currentSeed.hash}</div>
              </div>
              <div className={classes.seedPairItem}>
                <div className={classes.seedPairLabel}>Nonce</div>
                <div className={classes.seedPairValue}>{currentSeed.nonce}</div>
              </div>
              {nextSeed && (
                <div className={classes.seedPairItem}>
                  <div className={classes.seedPairLabel}>Next Server Seed Hash</div>
                  <div className={classes.seedPairValue}>{nextSeed.hash}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={classes.section}>
          <div className={classes.sectionTitle}>Seed History</div>
          <div className={classes.description}>
            These are your previous seed pairs that have been rotated. You can use these to verify the fairness of your past games.
          </div>
          <div className={classes.seedHistory}>
            {seedHistory.map((seed, index) => (
              <div key={index} className={classes.seedHistoryItem}>
                <div className={classes.seedHistoryHeader}>
                  <div className={classes.seedPairLabel}>Seed Pair #{seedHistoryCount - ((page - 1) * 10) - index}</div>
                  <div className={classes.seedHistoryDate}>
                    {format(new Date(seed.createdAt), 'MMM d, yyyy HH:mm')}
                  </div>
                </div>
                <div className={classes.seedPairItem}>
                  <div className={classes.seedPairLabel}>Client Seed</div>
                  <div className={classes.seedPairValue} style={{ background: theme.bg.box }}>{seed.seedClient}</div>
                </div>
                <div className={classes.seedPairItem}>
                  <div className={classes.seedPairLabel}>Server Seed</div>
                  <div className={classes.seedPairValue} style={{ background: theme.bg.box }}>{seed.seedServer}</div>
                </div>
                <div className={classes.seedPairItem}>
                  <div className={classes.seedPairLabel}>Hash</div>
                  <div className={classes.seedPairValue} style={{ background: theme.bg.box }}>{seed.hash}</div>
                </div>
                <div className={classes.seedPairItem}>
                  <div className={classes.seedPairLabel}>Nonce</div>
                  <div className={classes.seedPairValue} style={{ background: theme.bg.box }}>{seed.nonce}</div>
                </div>
              </div>
            ))}
          </div>
          {seedHistoryCount > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>

        <div className={classes.section}>
          <div className={classes.sectionTitle}>Verify randomness</div>
          <div className={classes.description}>
            To maintain transparency, we provide verification functions for each game mode. Select a mode below to see its specific verification code.
          </div>
          <div className={classes.verifySection}>
            <div className={classes.gameModeButtons}>
              <div 
                ref={highlightRef}
                className={classes.highlight}
              />
              <div 
                ref={buttonRefs.battles}
                className={`${classes.gameModeButton} ${selectedMode === 'battles' ? 'active' : ''}`}
                onClick={() => setSelectedMode('battles')}
              >
                Battles
              </div>
              <div 
                ref={buttonRefs.upgrader}
                className={`${classes.gameModeButton} ${selectedMode === 'upgrader' ? 'active' : ''}`}
                onClick={() => setSelectedMode('upgrader')}
              >
                Upgrader
              </div>
              <div 
                ref={buttonRefs.mines}
                className={`${classes.gameModeButton} ${selectedMode === 'mines' ? 'active' : ''}`}
                onClick={() => setSelectedMode('mines')}
              >
                Mines
              </div>
              <div 
                ref={buttonRefs.unbox}
                className={`${classes.gameModeButton} ${selectedMode === 'unbox' ? 'active' : ''}`}
                onClick={() => setSelectedMode('unbox')}
              >
                Unbox
              </div>
            </div>
            <div className={classes.codeBlock}>{getVerificationCode()}</div>
          </div>
        </div>
      </div>
    </ProfilePageTemplate>
  );
};

export default Fairness; 