import axios from "axios";
import { FC, useEffect, useState } from "react";
import Layout from "./components/Layout";
import ProductsGrid from "./components/ProductsGrid";
import { RouteComponentProps, useLocation } from "@reach/router";
import { Product, ProductInfo } from "./interfaces";
import { AxiosResponse } from "axios";

const App: FC<RouteComponentProps> = () => {
  const location = useLocation()
  const [products, setProducts] = useState<ProductInfo[]>([])

  useEffect(() => {
      axios.get(`http://localhost:5000/api/v2/product`)
      .then((res: AxiosResponse) => res.data)
      .then((data: ProductInfo[]) => setProducts(data))
      .catch(err => console.error(err))
  }, [location.search])

  console.log(products)
  return (
      <Layout>
        <ProductsGrid products={products}/>
      </Layout>
  );
}
export default App;
