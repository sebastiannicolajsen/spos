import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme } from "victory";
import api from "../spos-client";
import { PricePoint, Product } from "../spos-client/types";

const colors = ["1f363d", "40798c", "70a9a1", "9ec1a3", "cfe0c3"];
let colorIndex = 0;

const map: { [product: number]: string } = {};

function productToLine(product: Product, label: boolean) {
  if (!map[product.id]) map[product.id] = colors[colorIndex++ % colors.length];

  return (
    <VictoryLine
    animate={{
      duration: 600,
    }}
      interpolation="linear"
      labels={({ datum }) => {
        return label ? datum.y : "";
      }}
      style={{
        data: {
          stroke: `#${map[product.id]}`,
          strokeWidth: 2,
        },
      }}
      data={product.price_points.map((pp: PricePoint) => {
        return { x: pp.timestamp, y: parseInt(`${pp.value}`) };
      })}
    />
  );
}

function PriceGraph(props: { label: boolean }) {
  const products = api.products.useProducts();
  return (
    <div>
      <VictoryChart
        width={900}
        theme={VictoryTheme.material}
      >
        <VictoryAxis dependentAxis />
        <VictoryAxis
          tickFormat={(t) =>
            `${new Date(t).getHours()}:${new Date(t).getMinutes()}`
          }
        />
        {products.map((p) => productToLine(p, props.label))}
      </VictoryChart>
      <div>
        {products.map((p) => (
          <span
            className="font-semibold p-1 m-3 bg-slate-100"
            style={{ color: `#${map[p.id]}` }}
          >
            {p.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default PriceGraph;
