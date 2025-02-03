    import '../../css/app.css';
    import React, { useState, useEffect } from 'react';
    import axios from 'axios';

    const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [totalPages, setTotalPages] = useState(1); // Total de páginas
    const [perPage, setPerPage] = useState(12); // Productos por página

    const deleteProduct = async (productId) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) return;
        
        try {
        await axios.get("/sanctum/csrf-cookie");
        
        await axios.delete(`/api/products/${productId}`, { withCredentials: true });
        
        alert("Producto eliminado correctamente");
        setProducts(products.filter(product => product.id !== productId));
        } catch (error) {
            if(error.response){
                if(error.response.status === 403){
                    alert("No tienes permisos para eliminar este producto");
                }
                else{
                    alert(`Error: ${error.response.status} - ${error.response.message}`)
                }
            }
            else{
                alert("Error eliminando el producto")
            }
        
        }
        };

    useEffect(() => {
        // Función para obtener los productos desde el endpoint con paginación
        const fetchProducts = async (page) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/products?page=${page}&per_page=${perPage}`, {
                credentials: "include",
            });
            if (response.redirected) {
                window.location.href = response.url;
                return;
                }
            const data = await response.json(); // Asumiendo que `meta` contiene los metadatos
            setProducts(data.data);
            console.log(data.data);
            setCurrentPage(data.meta.current_page);
            setTotalPages(data.meta.last_page);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
        };

        fetchProducts(currentPage);
    }, [currentPage, perPage]); // Dependencias: ejecuta cuando cambia la página o el número por página

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-6 bg-dark min-h-screen">
    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Product List</h1>
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (

            <li
                key={product.id}
                className="bg-red-50 shadow-lg rounded-xl overflow-hidden border border-gray-200 flex flex-col"
            >
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
                <div className="p-4 flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                    <p className="text-gray-600 mt-2">{product.description}</p>
                    <p className="text-gray-800 font-bold mt-4">Price: ${product.price}</p>
                    <p className="text-gray-600 mt-1">Quantity: {product.stock}</p>
                    <p>id:{product.user_id}</p>
                </div>
                <div className="p-4 flex justify-end">
                    <button onClick={ () => deleteProduct(product.id)} className="px-4 py-2  font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all">
                        Borrar Producto
                    </button>
                </div>
            </li>
        ))}
    </ul>
    
    {/* Controles de paginación */}
    <div className="flex justify-center items-center mt-6">
        <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Previous
        </button>
        <span className="px-4 py-2 text-gray-800">
            Page {currentPage} of {totalPages}
        </span>
        <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Next
        </button>
    </div>
</div>

    );
    };

export default ProductList;
