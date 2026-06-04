import './stylesheet/MasterData.css'

export default function MasterData() {
    const masterDataData = {
        kategori_barang : [
            {
            name_products: "a",
            category: "a",
            stocks: "a"
            }
        ],
        daftar_semua_nama_barang : [
            {
                id_products: "1",
                name_products: "a"
            }
        ],
        manajemen_pengguna : [
            { 
                username: "a",
                role: "a"
            }
        ]
    }

    return(
        <div className="master-data">
            <div className="kategori-barang">
                <h3>Kategori Barang</h3>
                <hr />
                <select name="kateogri" id="kategori">
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
                            masterDataData != null ?
                            masterDataData.kategori_barang.map((row, i = 0) => {
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
                <input type="search" name="search-nama-barang" id="search-nama-barang" placeholder='Cari nama barang'/>
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
                            masterDataData != null ?
                            masterDataData.daftar_semua_nama_barang.map((row, i = 0) => {
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
                            masterDataData != null ?
                            masterDataData.manajemen_pengguna.map((row, i = 0) => {
                            i += 1;
                            
                            return(
                                <tr key={i}>
                                    <td>{i}</td>
                                    <td>{row.username}</td>
                                    <td>{row.role}</td>
                                    <td><img src="/Action.svg" alt="Add Account" style={{cursor:'pointer'}} title='Aksi'/></td>
                                </tr>
                            )
                            })
                            :
                            <tr></tr>
                        }
                        <tr>
                            <td>
                                <img src="/Add box.svg" alt="Add Account" className='tambah-akun-button' style={{cursor:'pointer'}} title='Tambah Akun'/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}