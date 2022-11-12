import { useState } from "react";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from "victory";
import api from "../spos-client";
import { PricePoint, Product, Transaction } from "../spos-client/types";

const colors = ["1f363d", "40798c", "70a9a1", "9ec1a3", "cfe0c3"];
let colorIndex = 0;

const map: { [product: number]: string } = {};

function productToBar(
  data: { product: Product; quantity: number },
  label: boolean
) {
  if (!map[data.product.id])
    map[data.product.id] = colors[colorIndex++ % colors.length];

  return (
    <VictoryBar
      animate={{
        duration: 600,
      }}
      style={{
        data: {
          fill: `#${map[data.product.id]}`,
          strokeWidth: 5,
        },
        labels: {
          fontSize: 15,
          fill: ({}) => `#${map[data.product.id]}`,
        },
      }}
      labels={({ datum }) => {
        return label ? datum.y : "";
      }}
      data={[{ x: data.product.name, y: data.quantity }]}
    />
  );
}

function transactionsToBars(transactions: Transaction[], label: boolean) {
  const map: { [id: number]: { product: Product; quantity: number } } = {};
  for (const t of transactions) {
    for (const i of t.items) {
      if (!map[i.product.id])
        map[i.product.id] = { product: i.product, quantity: 0 };
      map[i.product.id].quantity += i.quantity;
    }
  }

  return Object.values(map).map((data) => productToBar(data, label));
}

function TransactionGraph(props: { label: boolean }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  if (transactions.length === 0)
    api.transactions
      .list()
      .then((transactions) => setTransactions(transactions));

  return (
    <div>
      <VictoryChart width={800} theme={VictoryTheme.material}>
        <VictoryAxis dependentAxis />
        <VictoryAxis />
        {transactions.map((p) => transactionsToBars(transactions, props.label))}
      </VictoryChart>
    </div>
  );
}

export default TransactionGraph;
