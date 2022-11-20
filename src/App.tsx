import axios from "axios";
import { FC, useEffect, useState } from "react";
import Layout from "./components/Layout";
import ProductsGrid from "./components/ProductsGrid";
import { RouteComponentProps, useLocation } from "@reach/router";
import { ProductInfo } from "./interfaces";
import { AxiosResponse } from "axios";
import { parse } from 'query-string';

const App: FC<RouteComponentProps> = () => {
  const location = useLocation();
  const searchParams = parse(location.search);
  const [products, setProducts] = useState<ProductInfo[]>([])
  
  useEffect(() => {
      axios.get(`http://localhost:5000/api/v2/products?Name=${!!searchParams.name ? searchParams.name : ''}`)
      .then((res: AxiosResponse) => res.data)
      .then((data: ProductInfo[]) => setProducts(data))
      .catch(err => console.error(err))
  }, [searchParams])

  return (
      <Layout>
        <ProductsGrid products={products}/>
      </Layout>
  );
}
export default App;