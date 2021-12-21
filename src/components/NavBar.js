import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Menu } from '@headlessui/react'
import { Link } from '@reach/router'

const NavBar = () => {

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
        <div className=' relative w-full h-16 bg-red-400 p-1 flex flex-row items-center'>
          <div className='p-0 m-0 text-white'>Izzys Imperfect Items</div>
          <Menu as='div' className="absolute text-left right-1 z-50">
            <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">Collections</Menu.Button>
            <Menu.Items className='absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              {
                collections.map((c, i) => {
                  return (
                    <Menu.Item key={i} className='group flex rounded-md items-center w-full px-2 py-2 text-sm cursor-pointer'>
                      <Link to={`/${c}`}>{c}</Link>
                    </Menu.Item>
                  )
                })
              }
            </Menu.Items>
          </Menu>
        </div>
    )
}

export default NavBar