import { useEffect, useState } from 'react';
import './stylesheet/MasterData.css'

export default function MasterData() {
    const masterDataTemplate = {
        kategori_barang : [
            {
            name_products: "",
            category: "",
            stocks: ""
            }
        ],
        daftar_semua_nama_barang : [
            {
                id_products: "",
                name_products: ""
            }
        ],
        manajemen_pengguna : [
            { 
                username: "",
                role: ""
            }
        ]
    }

    const [masterData,setMasterData] = useState(masterDataTemplate);

    const handleCategoryChange = async (e) => {
        e.preventDefault;
        let category = e.target.value

        if(category == "") {
            setMasterData((prev) => ({ ...prev, kategori_barang : masterDataTemplate.kategori_barang }));
            return;
        }
        
        const token = sessionStorage.getItem('jwt');
        try {
            const response = await fetch(`http://localhost:3000/api/get/master-data/kategori-barang/${category}`,{
                method: 'GET',
                headers: {
                    Authorization: token
                }
            })

            const data = await response.json();
            if (data.success) {
                setMasterData((prev) => ({ ...prev, kategori_barang : data.data }));
            } else {
                setMasterData((prev) => ({ ...prev, kategori_barang : masterDataTemplate.kategori_barang }));
            }
        } catch (error) {
            console.error("Error fetching product by category:", error);
            setMasterData((prev) => ({ ...prev, kategori_barang : masterDataTemplate.kategori_barang }));
        }
    }

    useEffect(() => {
        getNamaBarang("*")
    },[])

    const getNamaBarang = async (nama_barang) => {
        const token = sessionStorage.getItem('jwt');
        try {
            const response = await fetch(`http://localhost:3000/api/get/master-data/semua-nama-barang/${nama_barang}`,{
                method: 'GET',
                headers: {
                    Authorization: token
                }
            })

            const data = await response.json();
            console.log(data);
            if (data.success) {
                setMasterData((prev) => ({ ...prev, daftar_semua_nama_barang: data.data }));
            } else {
                setMasterData((prev) => ({ ...prev, daftar_semua_nama_barang : masterDataTemplate.daftar_semua_nama_barang }));
            }
        } catch(error) {
            console.error("Error getting item name:",error);
            setMasterData((prev) => ({ ...prev, daftar_semua_nama_barang : masterDataTemplate.daftar_semua_nama_barang }));
        }
    }

    const handleSemuaNamaBarangSearch = (e) => {
        e.preventDefault;

        let nama_barang = e.target.value;

        if(nama_barang == "") {
            nama_barang = "*"
        }

        getNamaBarang(nama_barang);
    }

    const toggleOverlay = (e) => {
        e.preventDefault;
        if (document.querySelector(".overlay").style.display == "block") {
            const overlayElement = document.querySelector(".overlay").style.display = "none"
        } else {
            const overlayElement = document.querySelector(".overlay").style.display = "block"
        }
    }

    const handleUserForm = (formData) => {
        let mode = formData.get("mode");
        let username = formData.get("username");
        let password = formData.get("password");
        let role = formData.get("role");

        const token = sessionStorage.getItem('jwt');

        async function createUserAdmin(token) {
            const response = await fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization'  : token
                },
                body: JSON.stringify({
                    username,
                    password
                })
            })

            const data = await response.json();

            if(data.success){
                alert(data.message);
            } else {
                alert("Failed creating account");
                console.error(data.error)
            }
        }

        async function createUserManager(token) {
            const response = await fetch('http://localhost:3000/api/create/persediaan-barang/manager-account', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization'  : token
                },
                body: JSON.stringify({
                    username,
                    password,
                    role
                })
            })

            const data = await response.json();

            if(data.success){
                alert(data.message);
            } else {
                alert("Failed creating manager account");
                console.error(data.error)
            }
        }

        if(mode == "create") {
            if(role == "admin") {
                createUserAdmin(token);
            }
            if(role == "manager") {
                createUserManager(token)
            }
        }
        
        async function deleteUser(token) {
            try {
                const response = await fetch('http://localhost:3000/api/delete/account', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization'  : token
                    },
                    body: JSON.stringify({
                        username,
                        password,
                        role
                    })
                })

                const data = await response.json();

                if(data.success){
                    alert(data.message);
                } else {
                    alert("Failed deleting account");
                    console.error(data.error)
                }
            } catch(err) {
                alert("Failed deleting account");
                console.log(err);
            }
        }

        if(mode == "delete") {
            deleteUser(token)
        }

        async function updateUserPassword(token) {
            try {
                const response = await fetch('http://localhost:3000/api/update/master-data/account', {
                    method: 'PUT',
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization'  : token
                    },
                    body: JSON.stringify({
                        username,
                        password,
                        role
                    })
                })

                const data = await response.json();

                if(data.success){
                    alert(data.message);
                } else {
                    alert(data.message);
                    console.error(data.error)
                }
            } catch(err) {
                alert("Failed updating account");
                console.log(err);
            }
        }

        if(mode == "update") {
            updateUserPassword(token)
        }
    }

    const getUsersData = async () => {
        const token = sessionStorage.getItem('jwt');
        try {
            const response = await fetch('http://localhost:3000/api/get/master-data/account', {
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization'  : token
                }
            })

            const data = await response.json();
            console.log(data);
            if(data.success){
                alert(data.message);
                setMasterData((prev) => ({ ...prev, manajemen_pengguna: data.data }));
            } else {
                alert(data.message);
                console.error(data.error)
                setMasterData((prev) => ({ ...prev, manajemen_pengguna: masterDataTemplate.manajemen_pengguna }));
            }
        } catch(err) {
            alert("Failed getting users data");
            console.log(err);
            setMasterData((prev) => ({ ...prev, manajemen_pengguna: masterDataTemplate.manajemen_pengguna }));
        }
    }


    useEffect(() => {
        getUsersData()
    },[])

    return(
        <div className="master-data">
            <div className="kategori-barang">
                <h3>Kategori Barang</h3>
                <hr />
                <select onChange={handleCategoryChange} name="kateogri" id="kategori">
                    <option value="">--Tolong Pilih Kategori--</option>
                    <option value="Struktural">Struktural</option>
                    <option value="Penunjang">Penunjang</option>
                    <option value="Isolasi">Isolasi</option>
                    <option value="Penutup">Penutup</option>
                </select>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Barang</th>
                            <th>Kategori</th>
                            <th>Stok</th>
                        </tr>
                    </thead>
                    <tbody>
                        { 
                            masterData != null ?
                            masterData.kategori_barang.map((row, i = 0) => {
                            i += 1;
                            return(
                                <tr key={i}>
                                <td>{i}</td>
                                <td>{row.name_products}</td>
                                <td>{row.category}</td>
                                <td>{row.stocks}</td>
                                </tr>
                            )
                            })
                            :
                            <tr></tr>
                        }
                    </tbody>
                </table>
            </div>
            <div className="daftar-semua-nama-barang">
                <h3>Daftar Semua Nama Barang</h3>
                <hr />
                <input onChange={handleSemuaNamaBarangSearch} type="search" name="search-nama-barang" id="search-nama-barang" placeholder='Cari nama barang'/>
                <img src="/Search.svg" alt="Search!" id='search'/>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>ID</th>
                            <th>Nama Barang</th>
                        </tr>
                    </thead>
                    <tbody>
                        { 
                            masterData != null ?
                            masterData.daftar_semua_nama_barang.map((row, i = 0) => {
                            i += 1;
                            
                            return(
                                <tr key={i}>
                                    <td>{i}</td>
                                    <td>{row.id_products}</td>
                                    <td>{row.name_products}</td>
                                </tr>
                            )
                            })
                            :
                            <tr></tr>
                        }
                    </tbody>
                </table>
            </div>
            <div className="manajemen-pengguna">
                <h3>Manajemen Pengguna</h3>
                <hr />
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Pengguna</th>
                            <th>Role</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        { 
                            masterData != null ?
                            masterData.manajemen_pengguna.map((row, i = 0) => {
                            i += 1;
                            
                            return(
                                <tr key={i}>
                                    <td>{i}</td>
                                    <td>{row.username}</td>
                                    <td>{row.role}</td>
                                    <td><img onClick={toggleOverlay} src="/Action.svg" alt="Add Account" style={{cursor:'pointer'}} title='Aksi'/></td>
                                </tr>
                            )
                            })
                            :
                            <tr></tr>
                        }
                        <tr>
                            <td>
                                <img onClick={toggleOverlay} src="/Add box.svg" alt="Add Account" className='tambah-akun-button' style={{cursor:'pointer'}} title='Tambah Akun'/>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="overlay">
                    <button onClick={toggleOverlay} className='close-button'>Tutup</button>
                    <form action={handleUserForm}>
                        <select name="mode" id="mode">
                            <option value="create">Buat Pengguna</option>
                            <option value="update">Perbarui Pengguna</option>
                            <option value="delete">Hapus Pengguna</option>
                        </select>
                        <label htmlFor="username">
                            Username:
                        </label>
                        <input type="text" name='username' placeholder='Masukan Nama Pengguna'/>
                        <label htmlFor="password">
                            Password:
                        </label>
                        <input type="text" name='password' placeholder='Masukan Sandi Pengguna'/>
                        <label htmlFor="role">
                            Role:
                        </label>
                        <select name="role" id="role">
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button type='submit'>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    )
}