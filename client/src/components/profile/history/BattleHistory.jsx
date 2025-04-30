import React, { useEffect, useState } from 'react';
import ProfilePageTemplate from '../template/ProfilePageTemplate';
import { useUser } from '../../../contexts/user';
import Loader from '../../common/Loader';
import HistoryGrid from '../../common/HistoryGrid';
import Pagination from '../../common/Pagination';
import BattleHistoryItem from './BattleHistoryItem';

const BattleHistory = () => {
  const [page, setPage] = useState(1);
  const { battleHistory, battleHistoryCount, battleHistoryLoading, fetchBattleHistory } = useUser();

  useEffect(() => {
    fetchBattleHistory(page);
  }, [page]);

  const totalPages = Math.ceil(battleHistoryCount / 10); // 10 items per page

  return (
    <ProfilePageTemplate title="Battle History" count={battleHistoryCount}>
      {battleHistoryLoading ? (
        <Loader />
      ) : (
        <>
          <HistoryGrid>
            {battleHistory.map((battle, index) => (
              <BattleHistoryItem key={index} battle={battle} />
            ))}
          </HistoryGrid>
          {battleHistoryCount > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </ProfilePageTemplate>
  );
};

export default BattleHistory; 