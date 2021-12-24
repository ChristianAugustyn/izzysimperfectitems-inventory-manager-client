import axios from "axios";
import { FC, useEffect, useState } from "react";
import Layout from "./components/Layout";
import ProductsGrid from "./components/ProductsGrid";
import { RouteComponentProps, useLocation } from "@reach/router";

const App: FC<RouteComponentProps> = () => {
  const location = useLocation()
  const [products, setProducts] = useState([])

  console.log(location)

  useEffect(() => {
      axios.get(`http://localhost:5000/api/product${location.search}`)
      .then(res => res.data)
      .then(data => setProducts(data))
      .catch(err => console.error(err))
  }, [location.search])

  return (
      <Layout>
        {/* <button className="btn" onClick={() => login({username: "admin", password: "izzys-admin@2022"})}>Login</button>
        <button className="btn" onClick={() => logout}>logout</button>
        <button className="btn" onClick={() => validateToken()}>validate</button> */}
        <ProductsGrid products={products}/>
      </Layout>
  );
}

export default App;
