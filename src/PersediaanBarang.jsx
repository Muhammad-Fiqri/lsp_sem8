import "./stylesheet/PersediaanBarang.css";
import { useRef,useEffect, useState } from "react";

export default function PersediaanBarang() {
    const [persediaanBarangData, setPersediaanBarangData] = useState(null);

    const hasRun = useRef(false);
    useEffect(() => {
        if(hasRun.current) return;
        hasRun.current = true;

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
    },[])
    return (
        <div className="PersediaanBarang">
            <div className="grid">
                <section className="card">
                <h2 className="cardTitle">Input Barang Masuk</h2>
                <form className="form" onSubmit={(event) => event.preventDefault()}>
                    <div className="field">
                    <label className="label" htmlFor="masuk-id">
                        ID Barang
                    </label>
                    <input
                        id="masuk-id"
                        className="input"
                        type="text"
                        placeholder="Masukan ID Barang Yang Masuk"
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
                        placeholder="Nama Barang Dari ID Akan Muncul Disini"
                    />
                    </div>
                    <div className="field">
                    <label className="label" htmlFor="masuk-stok">
                        Stok
                    </label>
                    <input
                        id="masuk-stok"
                        className="input"
                        type="number"
                        placeholder="Masukan Stok Barang Yang Masuk"
                    />
                    </div>
                    <button className="button" type="submit">
                    Submit
                    </button>
                </form>
                </section>

                <section className="card">
                <h2 className="cardTitle">Input Barang Keluar</h2>
                <form className="form" onSubmit={(event) => event.preventDefault()}>
                    <div className="field">
                    <label className="label" htmlFor="keluar-id">
                        ID Barang
                    </label>
                    <input
                        id="keluar-id"
                        className="input"
                        type="text"
                        placeholder="Masukan ID Barang Yang Keluar"
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
                        placeholder="Nama Barang Dari ID Akan Muncul Disini"
                    />
                    </div>
                    <div className="field">
                    <label className="label" htmlFor="keluar-stok">
                        Stok
                    </label>
                    <input
                        id="keluar-stok"
                        className="input"
                        type="number"
                        placeholder="Masukan Stok Barang Yang Keluar"
                    />
                    </div>
                    <button className="button" type="submit">
                    Submit
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
