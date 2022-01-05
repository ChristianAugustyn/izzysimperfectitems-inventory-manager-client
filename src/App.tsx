import axios from "axios";
import { FC, useEffect, useState } from "react";
import Layout from "./components/Layout";
import ProductsGrid from "./components/ProductsGrid";
import { RouteComponentProps, useLocation } from "@reach/router";
import { Product } from "./interfaces";

const App: FC<RouteComponentProps> = () => {
  const location = useLocation()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
      axios.get(`http://localhost:5000/api/product${location.search}`)
      .then(res => res.data)
      .then(data => setProducts(data))
      .catch(err => console.error(err))
  }, [location.search])

  return (
      <Layout>
        <ProductsGrid products={products}/>
      </Layout>
  );
}

export default App;
