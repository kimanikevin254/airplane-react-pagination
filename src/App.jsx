import { useEffect, useState } from "react"
import Layout from "./components/Layout"
import ProductRow from "./components/ProductRow"
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from 'react-icons/md'

export default function App(){
  const [products, setProducts] = useState([])
  
  const [productsPerPage, setProductsPerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsToDisplay, setProductsToDisplay] = useState([])
  const [pageNumbers, setPageNumbers] = useState([])

const calculateProductsToDisplay = (itemsPerPage=productsPerPage, currentViewPage=1) => {
  setProductsPerPage(Number(itemsPerPage))
  setCurrentPage(Number(currentViewPage))
  const indexOfLastProductOnCurrentPage = currentViewPage * Number(itemsPerPage)
  const indexOfFirstProductOnCurrentPage = indexOfLastProductOnCurrentPage - Number(itemsPerPage)
  setProductsToDisplay(products.slice(indexOfFirstProductOnCurrentPage, indexOfLastProductOnCurrentPage))

  // page numbers
  const totalPages = Math.ceil(products.length / Number(itemsPerPage))
  setPageNumbers(Array.from({ length: totalPages }, (_, i) => i + 1))
}

const fetchProducts = () => {
  fetch('https://dummyjson.com/products?limit=100')
  .then(res => res.json())
  .then(({ products }) => {
      setProducts(products)
      setProductsToDisplay(products.slice(0, 5))
      const totalPages = Math.ceil(products.length / 5)
      setPageNumbers(Array.from({ length: totalPages }, (_, i) => i + 1))
  })
}

  useEffect(() => {
    fetchProducts()
  },[])
  return (
    <Layout>
      <div className='mb-8 flex items-center gap-12'>
        <h1 className="text-3xl font-bold">Products</h1>

        <div className="border p-2 flex gap-3">
          <h3>Products per page</h3>
          <select className="px-2 py-1" value={productsPerPage} onChange={e => calculateProductsToDisplay(e.target.value, undefined)}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
          </select>
      </div>

        <div className="flex gap-3">
            <button disabled={currentPage === 1} onClick={() => calculateProductsToDisplay(undefined, currentPage-1)} className="px-4 py-1 bg-gray-200 rounded disabled:bg-red-400">
            <MdOutlineNavigateBefore />
            </button>

            <button disabled={currentPage === pageNumbers.length} onClick={() => calculateProductsToDisplay(undefined, currentPage+1)} className="px-4 py-1 bg-gray-200 rounded disabled:bg-red-400">
            <MdOutlineNavigateNext />
            </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-6 mb-32">
        <table className="">
          <thead>
            <tr>
              <td>ID</td>
              <td>Thumbnail</td>
              <td>Title</td>
              <td>Brand</td>
              <td>Category</td>
              <td>Price</td>
              <td>Discount</td>
              <td>Rating</td>
              <td>In stock</td>
              <td>Description</td>
            </tr>
          </thead>

          <tbody>
            {
                productsToDisplay.length > 0 && productsToDisplay.map(product => (
                    <ProductRow key={product.id} product={product} />
                ))
            }
          </tbody>
        </table>

        <div className="mt-8 w-fit mx-auto flex gap-2">
            {
                pageNumbers.map((num, i) => (
                    <button key={i} onClick={() => calculateProductsToDisplay(undefined, num)} className={num === currentPage ? "px-4 py-1 bg-gray-500 text-white rounded" : "px-4 py-1 bg-gray-200 rounded"}>{num}</button>
                ))
            }
        </div>

      </div>
    </Layout>
  )
}