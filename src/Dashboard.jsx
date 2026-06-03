import './stylesheet/Dashboard.css'

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="total-barang">
        <h3>Total Barang</h3>
        <hr />
        <table>
          <tr>
            <th>No</th>
            <th>Nama Barang</th>
            <th>Kategori</th>
            <th>Stok</th>
          </tr>
          <tr>
            <td>1</td>
            <td>Barang A</td>
            <td>Kategori 1</td>
            <td>100</td>
          </tr>
        </table>
      </div>
      <div className="total-stok-masuk">
        <h3>Total Stok Masuk</h3>
        <hr />
        <table>
          <tr>
            <th>No</th>
            <th>Nama Barang</th>
            <th>Tanggal</th>
            <th>Stok</th>
          </tr>
          <tr>
            <td>1</td>
            <td>Barang A</td>
            <td>2023-01-01</td>
            <td>100</td>
          </tr>
        </table>
      </div>
      <div className="total-stok-keluar">
        <h3>Total Stok Keluar</h3>
        <hr />
        <table>
          <tr>
            <th>No</th>
            <th>Nama Barang</th>
            <th>Tanggal</th>
            <th>Stok</th>
          </tr>
          <tr>
            <td>1</td>
            <td>Barang A</td>
            <td>2023-01-01</td>
            <td>100</td>
          </tr>
        </table>
      </div>
      <div className="total-stok-terendah">
        <h3>Total Stok Terendah</h3>
        <hr />
        <table>
          <tr>
            <th>No</th>
            <th>Nama Barang</th>
            <th>Kategori</th>
            <th>Stok</th>
          </tr>
          <tr>
            <td>1</td>
            <td>Barang A</td>
            <td>Kategori 1</td>
            <td>100</td>
          </tr>
        </table>
      </div>
      <div className="total-stok-tertinggi">
        <h3>Total Stok Tertinggi</h3>
        <hr />
        <table>
          <tr>
            <th>No</th>
            <th>Nama Barang</th>
            <th>Kategori</th>
            <th>Stok</th>
          </tr>
          <tr>
            <td>1</td>
            <td>Barang A</td>
            <td>Kategori 1</td>
            <td>100</td>
          </tr>
        </table>
      </div>
    </div>
  );
}