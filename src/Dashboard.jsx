import { useEffect, useRef, useState } from 'react';
import './stylesheet/Dashboard.css'

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)

  const hasRun = useRef(false);
  useEffect(() => {
    if(hasRun.current) return;
    hasRun.current = true;

    const token = sessionStorage.getItem('jwt');

    const response = fetch("http://localhost:3000/api/get/dashboard", {
      method: 'GET',
      headers: {
        "Authorization" : token
      }
    }).then(res => res.json())
    .then(data => {
      if (data.success) {
        setDashboardData(data.dashboard_data)
        alert('Data Dashboard Retrieved.');
      } else {
        alert('Data Dashboard Retrievation Failed');
      }
    })
  },[])

  return (
    <div className="dashboard">
      <div className="total-barang">
        <h3>Total Barang</h3>
        <hr />
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
                dashboardData != null ?
                dashboardData.total_barang.map((row, i = 0) => {
                  i += 1;
                  
                  return(
                    <tr>
                      <td>{i}</td>
                      <td>{row.name_products}</td>
                      <td>Kategori 1</td>
                      <td>{row.stocks}</td>
                    </tr>
                  )
                })
                :
                "Kosong"
              }
            </tbody>
        </table>
      </div>
      <div className="total-stok-masuk">
        <h3>Total Stok Masuk</h3>
        <hr />
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Barang</th>
              <th>Tanggal</th>
              <th>Stok</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Barang A</td>
              <td>2023-01-01</td>
              <td>100</td>
            </tr>
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
              <th>Stok</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Barang A</td>
              <td>2023-01-01</td>
              <td>100</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="total-stok-terendah">
        <h3>Total Stok Terendah</h3>
        <hr />
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
            <tr>
              <td>1</td>
              <td>Barang A</td>
              <td>Kategori 1</td>
              <td>100</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="total-stok-tertinggi">
        <h3>Total Stok Tertinggi</h3>
        <hr />
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
            <tr>
              <td>1</td>
              <td>Barang A</td>
              <td>Kategori 1</td>
              <td>100</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}