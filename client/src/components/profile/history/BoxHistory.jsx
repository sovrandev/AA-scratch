import React, { useEffect, useState } from 'react';
import ProfilePageTemplate from '../template/ProfilePageTemplate';
import { useUser } from '../../../contexts/user';
import Loader from '../../common/Loader';
import HistoryGrid from '../../common/HistoryGrid';
import Pagination from '../../common/Pagination';
import BoxHistoryItem from './BoxHistoryItem';

const BoxHistory = () => {
  const [page, setPage] = useState(1);
  const { boxHistory, boxHistoryCount, boxHistoryLoading, fetchBoxHistory } = useUser();

  useEffect(() => {
    fetchBoxHistory(page);
  }, [page]);

  const totalPages = Math.ceil(boxHistoryCount / 10); // 10 items per page

  return (
    <ProfilePageTemplate title="Box History" count={boxHistoryCount}>
      {boxHistoryLoading ? (
        <Loader />
      ) : (
        <>
          <HistoryGrid>
            {boxHistory.map((box, index) => (
              <BoxHistoryItem key={index} box={box} />
            ))}
          </HistoryGrid>
          {boxHistoryCount > 0 && (
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

export default BoxHistory; 