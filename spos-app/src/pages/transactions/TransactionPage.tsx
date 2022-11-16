import TransactionGraph from "../../components/TransactionGraph";
import api from "../../spos-client";
import { Transaction } from "../../spos-client/types";

const TransactionPage = () => {
  const transactions = api.transactions.useTransactions();

  const transaction = (t: Transaction) => {
    return (
      <div className="grid grid-cols-4 ">
        <div>{t.id}</div>
        <div>{t.seller.username}</div>
        <div>{t.items.length}</div>
        <div>
          {t.items.reduce(
            (acc, i) => acc + i.quantity * i.price_point.value,
            0
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <TransactionGraph label={true} />
      <div className="grid grid-cols-4 text-slate-500 font-semibold pb-5 text-left">
        <div>ID</div>
        <div>Seller</div>
        <div>Items</div>
        <div>Total</div>
      </div>
      {transactions.map(transaction)}
    </div>
  );
};

export default TransactionPage;
