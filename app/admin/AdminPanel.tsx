import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css";

export default function AdminPanel() {
    const [view, setView] = useState("productos"); 
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [formCat, setFormCat] = useState({ nombre: "" });
    const [formProd, setFormProd] = useState({
        nombre: "", descripcion: "", precio: "", stock: "", imagen: "", categoria_id: ""
    });

    const loadCategorias = async () => {
        const res = await axios.get("http://localhost/api/categorias_get.php");
        setCategorias(res.data);
    };

    const loadProductos = async () => {
        const res = await axios.get("http://localhost/api/productos_get.php");
        setProductos(res.data);
    };

    useEffect(() => {
        loadCategorias();
        loadProductos();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const createCategoria = async () => {
        await axios.post("http://localhost/api/categorias_create.php", formCat);
        setFormCat({ nombre: "" });
        loadCategorias();
    };

    const createProducto = async () => {
        await axios.post("http://localhost/api/productos_create.php", formProd);
        setFormProd({ nombre: "", descripcion: "", precio: "", stock: "", imagen: "", categoria_id: "" });
        loadProductos();
    };

    return (
        <div className="admin-container">

            {/* SIDEBAR */}
            <aside className="sidebar">
                <h2 className="logo">🧢 Admin Gorras</h2>
                <button onClick={() => setView("productos")} className="menu-btn">Productos</button>
                <button onClick={() => setView("categorias")} className="menu-btn">Categorías</button>
                <button onClick={logout} className="logout-btn">Cerrar sesión</button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main">

                {view === "categorias" && (
                    <div>
                        <h2>Gestionar Categorías</h2>

                        <div className="form">
                            <input 
                                type="text" 
                                placeholder="Nombre categoría"
                                value={formCat.nombre}
                                onChange={e => setFormCat({ nombre: e.target.value })}
                            />
                            <button onClick={createCategoria}>Crear</button>
                        </div>

                        <h3>Listado</h3>
                        <ul className="listado">
                            {categorias.map(c => (
                                <li key={c.id}>{c.nombre}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {view === "productos" && (
                    <div>
                        <h2>Gestionar Productos</h2>

                        <div className="form">
                            <input placeholder="Nombre" 
                                value={formProd.nombre}
                                onChange={e => setFormProd({ ...formProd, nombre: e.target.value })}
                            />
                            <input placeholder="Descripción" 
                                value={formProd.descripcion}
                                onChange={e => setFormProd({ ...formProd, descripcion: e.target.value })}
                            />
                            <input placeholder="Precio" type="number"
                                value={formProd.precio}
                                onChange={e => setFormProd({ ...formProd, precio: e.target.value })}
                            />
                            <input placeholder="Stock" type="number"
                                value={formProd.stock}
                                onChange={e => setFormProd({ ...formProd, stock: e.target.value })}
                            />
                            <input placeholder="URL Imagen"
                                value={formProd.imagen}
                                onChange={e => setFormProd({ ...formProd, imagen: e.target.value })}
                            />

                            <select 
                                value={formProd.categoria_id}
                                onChange={e => setFormProd({ ...formProd, categoria_id: e.target.value })}
                            >
                                <option value="">Seleccione categoría</option>
                                {categorias.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>

                            <button onClick={createProducto}>Crear producto</button>
                        </div>

                        <h3>Listado</h3>

                        <div className="grid">
                            {productos.map(p => (
                                <div className="card" key={p.id}>
                                    <img src={p.imagen} alt="img" />
                                    <h4>{p.nombre}</h4>
                                    <p>{p.categoria}</p>
                                    <strong>${p.precio}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
