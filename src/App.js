import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Layout from "./components/Layout";
import ProductsGrid from "./components/ProductsGrid";
import { navigate } from "@reach/router";
import { validateToken } from "./components/Auth";

const App = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [products, setProducts] = useState([])

  useEffect(() => {
      axios.get(`https://izzys-inventory-manager.herokuapp.com/api/product`)
      .then(res => res.data)
      .then(data => setProducts(data))
      .catch(err => console.error(err))
  }, [])

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
