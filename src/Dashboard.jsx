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
                dashboardData != null ?
                dashboardData.total_stok_masuk.map((row, i = 0) => {
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
                dashboardData != null ?
                dashboardData.total_stok_keluar.map((row, i = 0) => {
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
            { 
              dashboardData != null ?
              dashboardData.total_stok_terendah.map((row, i = 0) => {
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
            { 
              dashboardData != null ?
              dashboardData.total_stok_tertinggi.map((row, i = 0) => {
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
    </div>
  );
}