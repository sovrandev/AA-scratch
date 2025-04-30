import React, { useEffect, useState } from 'react';
import ProfilePageTemplate from '../template/ProfilePageTemplate';
import { useUser } from '../../../contexts/user';
import Loader from '../../common/Loader';
import HistoryGrid from '../../common/HistoryGrid';
import Pagination from '../../common/Pagination';
import UpgraderHistoryItem from './UpgraderHistoryItem';

const UpgraderHistory = () => {
  const [page, setPage] = useState(1);
  const { upgraderHistory, upgraderHistoryCount, upgraderHistoryLoading, fetchUpgraderHistory } = useUser();

  useEffect(() => {
    fetchUpgraderHistory(page);
  }, [page]);

  const totalPages = Math.ceil(upgraderHistoryCount / 10); // 10 items per page

  return (
    <ProfilePageTemplate title="Upgrader History" count={upgraderHistoryCount}>
      {upgraderHistoryLoading ? (
        <Loader />
      ) : (
        <>
          <HistoryGrid>
            {upgraderHistory.map((upgrade, index) => (
              <UpgraderHistoryItem key={index} upgrade={upgrade} />
            ))}
          </HistoryGrid>
          {upgraderHistoryCount > 0 && (
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

export default UpgraderHistory; 