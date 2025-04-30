import React, { useEffect, useState } from 'react';
import ProfilePageTemplate from '../template/ProfilePageTemplate';
import { useUser } from '../../../contexts/user';
import Loader from '../../common/Loader';
import HistoryGrid from '../../common/HistoryGrid';
import Pagination from '../../common/Pagination';
import DepositItem from './DepositItem';

const Deposits = () => {
  const [page, setPage] = useState(1);
  const { deposits, depositsCount, depositsLoading, fetchDeposits } = useUser();

  useEffect(() => {
    fetchDeposits(page);
  }, [page]);

  const totalPages = Math.ceil(depositsCount / 8); // 8 items per page

  return (
    <ProfilePageTemplate title="Deposits" count={depositsCount}>
      {depositsLoading ? (
        <Loader />
      ) : (
        <>
          <HistoryGrid>
            {deposits.map((deposit, index) => (
              <DepositItem key={index} deposit={deposit} />
            ))}
          </HistoryGrid>
          {depositsCount > 0 && (
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

export default Deposits; 