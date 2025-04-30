import React, { useEffect, useState } from 'react';
import ProfilePageTemplate from '../template/ProfilePageTemplate';
import { useUser } from '../../../contexts/user';
import Loader from '../../common/Loader';
import HistoryGrid from '../../common/HistoryGrid';
import Pagination from '../../common/Pagination';
import WithdrawalItem from './WithdrawalItem';

const Withdrawals = () => {
  const [page, setPage] = useState(1);
  const { withdrawals, withdrawalsCount, withdrawalsLoading, fetchWithdrawals } = useUser();

  useEffect(() => {
    fetchWithdrawals(page);
  }, [page]);

  const totalPages = Math.ceil(withdrawalsCount / 8);

  return (
    <ProfilePageTemplate title="Withdrawals" count={withdrawalsCount}>
      {withdrawalsLoading ? (
        <Loader />
      ) : (
        <>
          <HistoryGrid>
            {withdrawals.map((withdrawal, index) => (
              <WithdrawalItem key={index} withdrawal={withdrawal} />
            ))}
          </HistoryGrid>
          {withdrawalsCount > 0 && (
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

export default Withdrawals; 