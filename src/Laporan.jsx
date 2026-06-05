import { useState, useRef, useEffect } from "react";
import './stylesheet/Laporan.css'

export default function Laporan() {
    const [laporanData, setLaporanData] = useState(null)

    const hasRun = useRef(false);
    useEffect(() => {
        if(hasRun.current) return;
        hasRun.current = true;

        const token = sessionStorage.getItem('jwt');

        const response = fetch("http://localhost:3000/api/get/laporan", {
            method: 'GET',
            headers: {
            "Authorization" : token
            }
        }).then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                setLaporanData(data.laporan_data)
                alert('Data Laporan Retrieved.');
            } else {
                alert('Data Laporan Retrievation Failed');
            }
        })
    },[])

    return(
        <div className="laporan">
            <div className="total-stok-masuk">
            <h3>Total Stok Masuk</h3>
            <hr />
            <table>
                <thead>
                    <tr>
                    <th>No</th>
                    <th>Nama Barang</th>
                    <th>Tanggal</th>
                    <th>Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        laporanData != null ?
                        laporanData.total_stok_masuk.map((row, i = 0) => {
                        i += 1;
                        
                        return(
                            <tr key={i}>
                            <td>{i}</td>
                            <td>{row.name_products}</td>
                            <td>{row.date.split('T')[0] /*remove timezone*/}</td> 
                            <td>{row.amount}</td>
                            </tr>
                        )
                        })
                        :
                        <tr></tr>
                    }
                </tbody>
            </table>
            </div>
            <div className="total-stok-keluar">
                <h3>Total Stok Keluar</h3>
                <hr />
                <table>
                <thead>
                    <tr>
                    <th>No</th>
                    <th>Nama Barang</th>
                    <th>Tanggal</th>
                    <th>Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        laporanData != null ?
                        laporanData.total_stok_keluar.map((row, i = 0) => {
                        i += 1;
                        
                        return(
                            <tr key={i}>
                            <td>{i}</td>
                            <td>{row.name_products}</td>
                            <td>{row.date.split('T')[0] /*remove timezone*/}</td> 
                            <td>{row.amount}</td>
                            </tr>
                        )
                        })
                        :
                        <tr></tr>
                    }
                </tbody>
                </table>
            </div>
        </div>
    )
}