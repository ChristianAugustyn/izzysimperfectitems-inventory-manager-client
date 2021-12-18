import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Layout from "./components/Layout";
import ProductsGrid from "./components/ProductsGrid";

const App = () => {

  const [activeTab, setActiveTab] = useState(0)
  const [collections, setCollections] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/api/product/collections')
      .then(res => {
        return res.data
      }).then(data => {
        setCollections(data)
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  return (
    <Layout>
      <ProductsGrid/>
    </Layout>
  );
}

export default App;
