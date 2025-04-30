import React, { useEffect, useState } from 'react';
import ProfilePageTemplate from '../template/ProfilePageTemplate';
import { useUser } from '../../../contexts/user';
import Loader from '../../common/Loader';
import HistoryGrid from '../../common/HistoryGrid';
import Pagination from '../../common/Pagination';
import MinesHistoryItem from './MinesHistoryItem';

const MinesHistory = () => {
  const [page, setPage] = useState(1);
  const { minesHistory, minesHistoryCount, minesHistoryLoading, fetchMinesHistory } = useUser();

  useEffect(() => {
    fetchMinesHistory(page);
  }, [page]);

  const totalPages = Math.ceil(minesHistoryCount / 10); // 10 items per page

  return (
    <ProfilePageTemplate title="Mines History" count={minesHistoryCount}>
      {minesHistoryLoading ? (
        <Loader />
      ) : (
        <>
          <HistoryGrid>
            {minesHistory.map((mine, index) => (
              <MinesHistoryItem key={index} mine={mine} />
            ))}
          </HistoryGrid>
          {minesHistoryCount > 0 && (
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

export default MinesHistory; 