import "./stylesheet/PersediaanBarang.css";
import { useRef,useEffect, useState } from "react";

export default function PersediaanBarang() {
    const [persediaanBarangData, setPersediaanBarangData] = useState(null);

    const [IDBarangMasuk, setIDBarangMasuk] = useState("");
    const [namaBarangMasuk, setNamaBarangMasuk] = useState("");
    const [jumlahBarangMasuk, setJumlahBarangMasuk] = useState("");
    const [loadingNamaBarangMasuk, setLoadingNamaBarangMasuk] = useState(false);

    const [IDBarangKeluar, setIDBarangKeluar] = useState("");
    const [namaBarangKeluar, setNamaBarangKeluar] = useState("");
    const [stokBarangKeluar, setStokBarangKeluar] = useState("");
    const [loadingNamaBarangKeluar, setLoadingNamaBarangKeluar] = useState(false);

    function getPersediaanBarangData() {
        const token = sessionStorage.getItem('jwt');

        const response = fetch("http://localhost:3000/api/get/persediaan-barang", {
            method: 'GET',
            headers: {
                "Authorization" : token
            }
        }).then(res => res.json())
        .then(data => {
            if (data.success) {
                setPersediaanBarangData(data.persediaanBarang_data)
                alert('Data Persediaan Barang Retrieved.');
            } else {
                alert('Data Persediaan Barang Retrievation Failed');
            }
        })
    }
    const hasRun = useRef(false);
    useEffect(() => {
        if(hasRun.current) return;
        hasRun.current = true;

        getPersediaanBarangData()
    },[])

    // Handle ID input change for Barang Masuk - fetch product name from API
    async function handleIDMasukChange(e) {
        const idValue = e.target.value;
        setIDBarangMasuk(idValue);
        
        if (!idValue) {
            setNamaBarangMasuk("");
            setLoadingNamaBarangMasuk(false);
            return;
        }

        setLoadingNamaBarangMasuk(true);
        setNamaBarangMasuk("");

        const token = sessionStorage.getItem('jwt');
        
        try {
            const response = await fetch(`http://localhost:3000/api/get/persediaan-barang/nama-barang-from-id-barang/${idValue}`, {
                method: 'GET',
                headers: {
                    "Authorization": token
                }
            });

            const data = await response.json();
            
            if (data.success) {
                setNamaBarangMasuk(data.data.name_products);
            } else {
                setNamaBarangMasuk("");
            }
        } catch (error) {
            console.error("Error fetching product name:", error);
            setNamaBarangMasuk("");
        } finally {
            setLoadingNamaBarangMasuk(false);
        }
    }

    // Handle ID input change for Barang Keluar - fetch product name from API
    async function handleIDKeluarChange(e) {
        const idValue = e.target.value;
        setIDBarangKeluar(idValue);
        
        if (!idValue) {
            setNamaBarangKeluar("");
            setLoadingNamaBarangKeluar(false);
            return;
        }

        setLoadingNamaBarangKeluar(true);
        setNamaBarangKeluar("");

        const token = sessionStorage.getItem('jwt');
        
        try {
            const response = await fetch(`http://localhost:3000/api/get/persediaan-barang/nama-barang-from-id-barang/${idValue}`, {
                method: 'GET',
                headers: {
                    "Authorization": token
                }
            });

            const data = await response.json();
            
            if (data.success) {
                setNamaBarangKeluar(data.data.name_products);
            } else {
                setNamaBarangKeluar("");
            }
        } catch (error) {
            console.error("Error fetching product name:", error);
            setNamaBarangKeluar("");
        } finally {
            setLoadingNamaBarangKeluar(false);
        }
    }

    // Handle form submission for Barang Masuk via action
    async function handleActionBarangMasuk(formData) {
        setIDBarangMasuk(formData.get("masuk-id"));
        setJumlahBarangMasuk(formData.get("masuk-jumlah"));
        
        if (!IDBarangMasuk || !jumlahBarangMasuk) {
            alert("Mohon lengkapi ID Barang dan Jumlah Barang Masuk");
            return;
        }

        const token = sessionStorage.getItem('jwt');
        const transaction_date = new Date();
        
        try {
            const response = await fetch("http://localhost:3000/api/update/persediaan-barang", {
                method: 'PUT',
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: "in",
                    id_products: IDBarangMasuk,
                    name_products: namaBarangMasuk,
                    amount: parseInt(jumlahBarangMasuk),
                    date: transaction_date.getDay() + "/" + transaction_date.getMonth() + "/" + transaction_date.getFullYear() 
                })
            });

            const data = await response.json();
            console.log(data);
            if (data.success) {
                alert('Barang Masuk Berhasil Ditambahkan');
                setIDBarangMasuk("");
                setNamaBarangMasuk("");
                setJumlahBarangMasuk("");
                
                getPersediaanBarangData()
            } else {
                alert(`Gagal: ${data.message || 'Barang Masuk Gagal Ditambahkan'}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    // Handle form submission for Barang Keluar via action
    async function handleActionBarangKeluar(formData) {
        const idBarang = formData.get("keluar-id");
        const stokBarang = formData.get("keluar-stok");
        
        if (!idBarang || !stokBarang) {
            alert("Mohon lengkapi ID Barang dan Stok");
            return;
        }

        const token = sessionStorage.getItem('jwt');
        
        try {
            const response = await fetch("http://localhost:3000/api/update/barang-keluar", {
                method: 'POST',
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_products: idBarang,
                    stocks: parseInt(stokBarang)
                })
            });

            const data = await response.json();
            
            if (data.success) {
                alert('Barang Keluar Berhasil Dicatat');
                setIDBarangKeluar("");
                setNamaBarangKeluar("");
                setStokBarangKeluar("");

                // Refresh data
                getPersediaanBarangData()
            } else {
                alert(`Gagal: ${data.message || 'Barang Keluar Gagal Dicatat'}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    return (
        <div className="PersediaanBarang">
            <div className="grid">
                <section className="card">
                <h2 className="cardTitle">Input Barang Masuk</h2>
                <form className="form" action={handleActionBarangMasuk}>
                    <div className="field">
                        <label className="label" htmlFor="masuk-id">
                            ID Barang
                        </label>
                        <input
                            id="masuk-id"
                            name="masuk-id"
                            className="input"
                            type="text"
                            placeholder="Masukan ID Barang Yang Masuk"
                            value={IDBarangMasuk}
                            onChange={handleIDMasukChange}
                        />
                    </div>
                    <div className="field">
                        <label className="label" htmlFor="masuk-nama">
                            Nama Barang
                        </label>
                        <input
                            id="masuk-nama"
                            className="input"
                            type="text"
                            placeholder={loadingNamaBarangMasuk ? "Mengambil nama barang... Mohon tunggu" : "Nama Barang Dari ID Akan Muncul Disini"}
                            value={namaBarangMasuk}
                            disabled
                            readOnly
                        />
                    </div>
                    <div className="field">
                        <label className="label" htmlFor="masuk-jumlah">
                            Jumlah
                        </label>
                        <input
                            id="masuk-jumlah"
                            name="masuk-jumlah"
                            className="input"
                            type="number"
                            placeholder="Masukan Banyak Barang Yang Masuk"
                            value={jumlahBarangMasuk}
                            onChange={(e) => setJumlahBarangMasuk(e.target.value)}
                        />
                    </div>
                    <button style={namaBarangMasuk == "" ? {backgroundColor: '#bdc5ff'} : {backgroundColor: '#001EFF'}} className="button" type="submit" disabled={namaBarangMasuk == "" ? true : false}>
                        {namaBarangMasuk != "" ? "Submit" : "Mohon masukan ID barang"}
                    </button>
                </form>
                </section>

                <section className="card">
                <h2 className="cardTitle">Input Barang Keluar</h2>
                <form className="form" action={handleActionBarangKeluar}>
                    <div className="field">
                        <label className="label" htmlFor="keluar-id">
                            ID Barang
                        </label>
                        <input
                            id="keluar-id"
                            name="keluar-id"
                            className="input"
                            type="text"
                            placeholder="Masukan ID Barang Yang Keluar"
                            value={IDBarangKeluar}
                            onChange={handleIDKeluarChange}
                        />
                    </div>
                    <div className="field">
                        <label className="label" htmlFor="keluar-nama">
                            Nama Barang
                        </label>
                        <input
                            id="keluar-nama"
                            className="input"
                            type="text"
                            placeholder={loadingNamaBarangKeluar ? "Mengambil nama barang... Mohon tunggu" : "Nama Barang Dari ID Akan Muncul Disini"}
                            value={namaBarangKeluar}
                            disabled
                            readOnly
                        />
                    </div>
                    <div className="field">
                        <label className="label" htmlFor="keluar-stok">
                            Stok
                        </label>
                        <input
                            id="keluar-stok"
                            name="keluar-stok"
                            className="input"
                            type="number"
                            placeholder="Masukan Stok Barang Yang Keluar"
                            value={stokBarangKeluar}
                            onChange={(e) => setStokBarangKeluar(e.target.value)}
                        />
                    </div>
                    <button style={namaBarangKeluar == "" ? {backgroundColor: '#bdc5ff'} : {backgroundColor: '#001EFF'}} className="button" type="submit" disabled={namaBarangKeluar == "" ? true : false}>
                        {namaBarangKeluar != "" ? "Submit" : "Mohon masukan ID barang"}
                    </button>
                </form>
                </section>
            </div>

            <section className="tableCard">
                <h2 className="sectionHeader">Total Barang</h2>
                <table className="table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Barang</th>
                        <th>Stok</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        persediaanBarangData != null ?
                        persediaanBarangData.map((row,i = 0) => {
                            i += 1
                            return(
                                <tr key={i}>
                                    <td>{i}</td>
                                    <td>{row.name_products}</td>
                                    <td>{row.stocks}</td>
                                    <td className={row.stocks == 0 ? "status status--unavailable" : "status status--available"}>{row.stocks == 0 ? "Tidak Tersedia" : "Tersedia"}</td>
                                </tr>
                            )
                        })
                        :
                        <tr></tr>
                    }
                </tbody>
                </table>
            </section>
        </div>
    );
}
